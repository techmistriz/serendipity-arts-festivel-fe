"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
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

type SelectOption = { label: string; value: number };

type SearchableLocationProps = {
  control: Control<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

const toId = (value: unknown) => {
  const parsed = typeof value === "number" ? value : Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const toOptions = (items: LocationOption[]): SelectOption[] =>
  items.map((item) => ({ label: item.name, value: item.id }));

const findSelectedOption = (options: SelectOption[], value: unknown) => {
  const id = toId(value);
  return id === null ? null : (options.find((option) => option.value === id) ?? null);
};

export default function SearchableLocation({ control, setValue, watch }: SearchableLocationProps) {
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedCountry = toId(watch("country"));
  const selectedState = toId(watch("state"));

  useEffect(() => {
    let active = true;

    void Promise.all([getCountries(), getStates(), getCities()])
      .then(([countryData, stateData, cityData]) => {
        if (!active) return;
        setCountries(countryData);
        setStates(stateData);
        setCities(cityData);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) console.error("Unable to load location data:", error.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredStates = useMemo(
    () => states.filter((state) => state.country_id === selectedCountry),
    [selectedCountry, states],
  );
  const filteredCities = useMemo(
    () => cities.filter((city) => city.state_id === selectedState),
    [cities, selectedState],
  );

  const handleCountryChange = (option: SingleValue<SelectOption>) => {
    setValue("country", option ? String(option.value) : "");
    setValue("state", "");
    setValue("city", "");
  };
  const handleStateChange = (option: SingleValue<SelectOption>) => {
    setValue("state", option ? String(option.value) : "");
    setValue("city", "");
  };
  const handleCityChange = (option: SingleValue<SelectOption>) => {
    setValue("city", option ? String(option.value) : "");
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      <LocationField
        control={control}
        name="country"
        label="Country*"
        options={toOptions(countries)}
        isLoading={isLoading}
        placeholder={isLoading ? "Loading..." : "Search country"}
        onChange={handleCountryChange}
      />
      <LocationField
        control={control}
        name="state"
        label="State*"
        options={toOptions(filteredStates)}
        isLoading={isLoading}
        isDisabled={isLoading || selectedCountry === null}
        placeholder={selectedCountry === null ? "Select country first" : "Search state"}
        emptyMessage={
          selectedCountry === null ? "Please select a country first" : "No states available"
        }
        onChange={handleStateChange}
      />
      <LocationField
        control={control}
        name="city"
        label="City*"
        options={toOptions(filteredCities)}
        isLoading={isLoading}
        isDisabled={isLoading || selectedState === null}
        placeholder={selectedState === null ? "Select state first" : "Search city"}
        emptyMessage={
          selectedState === null ? "Please select a state first" : "No cities available"
        }
        onChange={handleCityChange}
      />
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
          render={({ field: { onChange: setFieldValue, value } }) => (
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
          )}
        />
      </div>
    </div>
  );
}
