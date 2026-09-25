"use client";

import { useEffect, useState } from "react";
import {
  Controller,
  useFormState,
  type Control,
  type FieldValues,
  type UseFormRegister,
  type UseFormSetValue,
  type UseFormWatch,
} from "react-hook-form";
import Select, { type SingleValue } from "react-select";

import {
  getCities,
  getCountries,
  getStates,
  type LocationOption,
} from "@/services/location.service";

type SelectOption = {
  label: string;
  value: number;
  std_code?: string;
};

type SearchableLocationProps = {
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

const toId = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const toOptions = (items: LocationOption[]): SelectOption[] =>
  items.map((item) => ({
    label: item.name,
    value: Number(item.id),
    std_code: item.std_code,
  }));

const findSelectedOption = (options: SelectOption[], value: unknown) => {
  const id = toId(value);
  return id === null ? null : (options.find((option) => option.value === id) ?? null);
};

const OTHER_CITY_OPTION: SelectOption = {
  label: "Other",
  value: -1,
};

export default function SearchableLocation({
  register,
  control,
  setValue,
  watch,
}: SearchableLocationProps) {
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [statesForCountryId, setStatesForCountryId] = useState<number | null>(null);
  const [citiesForStateId, setCitiesForStateId] = useState<number | null>(null);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const selectedCountry = toId(watch("country"));
  const selectedState = toId(watch("state"));
  const customCity = String(watch("custom_city") ?? "");

  const [isCustomCity, setIsCustomCity] = useState(Boolean(customCity));
  const { errors } = useFormState({ control });

  useEffect(() => {
    if (customCity && !isCustomCity) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCustomCity(true);
    }
  }, [customCity, isCustomCity]);

  useEffect(() => {
    let active = true;

    void getCountries()
      .then((countryData) => {
        if (!active) return;
        setCountries(countryData);
      })
      .catch((error: unknown) => {
        if (!active) return;

        console.error("Unable to load countries:", error);
        setLocationError("Unable to load countries. Please refresh and try again.");
      })
      .finally(() => {
        if (active) setIsCountriesLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    if (selectedCountry === null) {
      return () => {
        active = false;
      };
    }

    void getStates(selectedCountry)
      .then((stateData) => {
        if (!active) return;

        setStates(stateData);
        setStatesForCountryId(selectedCountry);
        setLocationError(null);
      })
      .catch((error: unknown) => {
        if (!active) return;

        console.error("Unable to load states:", error);
        setStates([]);
        setStatesForCountryId(selectedCountry);
        setLocationError("Unable to load states. Please select the country again.");
      });

    return () => {
      active = false;
    };
  }, [selectedCountry]);

  useEffect(() => {
    let active = true;

    if (selectedState === null) {
      return () => {
        active = false;
      };
    }

    void getCities(selectedState)
      .then((cityData) => {
        if (!active) return;

        setCities(cityData);
        setCitiesForStateId(selectedState);
        setLocationError(null);
      })
      .catch((error: unknown) => {
        if (!active) return;

        console.error("Unable to load cities:", error);
        setCities([]);
        setCitiesForStateId(selectedState);
        setLocationError("Unable to load cities. Please select the state again.");
      });

    return () => {
      active = false;
    };
  }, [selectedState]);

  const handleCountryChange = (option: SingleValue<SelectOption>) => {
    setLocationError(null);

    setValue("country", option ? String(option.value) : "");
    setValue("state", "");
    setValue("city", "");
    setValue("custom_city", "");

    setIsCustomCity(false);
  };

  const handleStateChange = (option: SingleValue<SelectOption>) => {
    setLocationError(null);

    setValue("state", option ? String(option.value) : "");
    setValue("city", "");
    setValue("custom_city", "");

    setIsCustomCity(false);
  };

  const handleCityChange = (option: SingleValue<SelectOption>) => {
    if (option?.value === OTHER_CITY_OPTION.value) {
      setValue("city", "");
      setValue("custom_city", "");
      setIsCustomCity(true);
      return;
    }

    setValue("city", option ? String(option.value) : "");
    setValue("custom_city", "");
    setIsCustomCity(false);
  };

  const isStatesLoading = selectedCountry !== null && statesForCountryId !== selectedCountry;

  const isCitiesLoading = selectedState !== null && citiesForStateId !== selectedState;

  const stateOptions = statesForCountryId === selectedCountry ? toOptions(states) : [];

  const cityOptions =
    citiesForStateId === selectedState ? [...toOptions(cities), OTHER_CITY_OPTION] : [];

  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <LocationField
          control={control}
          name="country"
          label="Country*"
          options={toOptions(countries)}
          isLoading={isCountriesLoading}
          placeholder={isCountriesLoading ? "Loading..." : "Search country"}
          onChange={handleCountryChange}
        />

        <LocationField
          control={control}
          name="state"
          label="State*"
          options={stateOptions}
          isLoading={isStatesLoading}
          isDisabled={isStatesLoading || selectedCountry === null}
          placeholder={selectedCountry === null ? "Select country first" : "Search state"}
          emptyMessage={
            selectedCountry === null ? "Please select a country first" : "No states available"
          }
          onChange={handleStateChange}
        />

        <div>
          {!isCustomCity && (
            <LocationField
              control={control}
              name="city"
              label="City*"
              options={cityOptions}
              isLoading={isCitiesLoading}
              isDisabled={isCitiesLoading || selectedState === null}
              placeholder={selectedState === null ? "Select state first" : "Search city"}
              emptyMessage={
                selectedState === null ? "Please select a state first" : "No cities available"
              }
              onChange={handleCityChange}
            />
          )}

          {isCustomCity && (
            <div>
              <p className="label text-muted-foreground">Custom City*</p>

              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter your city"
                  {...register("custom_city")}
                  className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none focus:border-foreground"
                />

                {errors.custom_city?.message && (
                  <p className="mt-1 text-sm text-red-500">{String(errors.custom_city.message)}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {locationError && <p className="mt-2 text-sm text-red-500">{locationError}</p>}
    </div>
  );
}

function LocationField({
  control,
  name,
  label,
  options,
  isLoading,
  isDisabled = false,
  placeholder,
  emptyMessage,
  onChange,
}: {
  control: Control<FieldValues>;
  name: string;
  label: string;
  options: SelectOption[];
  isLoading: boolean;
  isDisabled?: boolean;
  placeholder: string;
  emptyMessage?: string;
  onChange: (option: SingleValue<SelectOption>) => void;
}) {
  return (
    <div>
      <p className="label text-muted-foreground">{label}</p>

      <div className="mt-2">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange: setFieldValue, value }, fieldState: { error } }) => (
            <>
              <Select<SelectOption>
                instanceId={name}
                placeholder={placeholder}
                options={options}
                value={findSelectedOption(options, value)}
                onChange={(option) => {
                  setFieldValue(option ? String(option.value) : "");
                  onChange(option);
                }}
                isSearchable
                isLoading={isLoading}
                isDisabled={isDisabled}
                className="react-select-container"
                classNamePrefix="react-select"
                noOptionsMessage={() => emptyMessage ?? "No options available"}
              />

              {error?.message && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
            </>
          )}
        />
      </div>
    </div>
  );
}
