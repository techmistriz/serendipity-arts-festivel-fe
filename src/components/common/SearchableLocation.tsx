"use client";

import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { getCities, getCountries, getStates } from "@/src/services/location.service";

export default function SearchableLocation({
  control,
  setValue,
  watch,
}: any) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState({
    countries: false,
    states: false,
    cities: false,
  });

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);

  // Watch the form values to sync with selectedCountry/State
  const countryValue = watch?.("country");
  const stateValue = watch?.("state");

  // Sync selectedCountry with form value
  useEffect(() => {
    if (countryValue) {
      const countryId = typeof countryValue === 'string'
        ? parseInt(countryValue)
        : countryValue;
      if (!isNaN(countryId) && countryId !== selectedCountry) {
        setSelectedCountry(countryId);
      }
    }
  }, [countryValue]);

  // Sync selectedState with form value
  useEffect(() => {
    if (stateValue) {
      const stateId = typeof stateValue === 'string'
        ? parseInt(stateValue)
        : stateValue;
      if (!isNaN(stateId) && stateId !== selectedState) {
        setSelectedState(stateId);
      }
    }
  }, [stateValue]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load countries
    setIsLoading(prev => ({ ...prev, countries: true }));
    try {
      const countryRes = await getCountries();
      setCountries(Array.isArray(countryRes) ? countryRes : []);
    } catch (e) {
      console.error("Countries Error:", e);
      setCountries([]);
    } finally {
      setIsLoading(prev => ({ ...prev, countries: false }));
    }

    // Load states
    setIsLoading(prev => ({ ...prev, states: true }));
    try {
      const stateRes = await getStates();
      setStates(Array.isArray(stateRes) ? stateRes : []);
    } catch (e) {
      console.error("States Error:", e);
      setStates([]);
    } finally {
      setIsLoading(prev => ({ ...prev, states: false }));
    }

    // Load cities
    setIsLoading(prev => ({ ...prev, cities: true }));
    try {
      const cityRes = await getCities();
      setCities(Array.isArray(cityRes) ? cityRes : []);
    } catch (e) {
      console.error("Cities Error:", e);
      setCities([]);
    } finally {
      setIsLoading(prev => ({ ...prev, cities: false }));
    }
  };

  // Filter states based on selected country
  const filteredStates = useMemo(() => {
    if (!selectedCountry || !Array.isArray(states)) return [];
    return states.filter(
      (state: any) => state.country_id === selectedCountry
    );
  }, [states, selectedCountry]);

  // Filter cities based on selected state
  const filteredCities = useMemo(() => {
    if (!selectedState || !Array.isArray(cities)) return [];
    return cities.filter(
      (city: any) => city.state_id === selectedState
    );
  }, [cities, selectedState]);

  // Helper to format options
  const formatOptions = (items: any[]) => {
    return items.map((item: any) => ({
      label: item.name,
      value: item.id,
    }));
  };

  // Helper to find selected option
  const findSelectedOption = (options: any[], value: any) => {
    if (!value) return null;
    const val = typeof value === 'string' ? parseInt(value) : value;
    return options.find((opt) => opt.value === val) || null;
  };

  // Clear dependent fields when parent changes
  const handleCountryChange = (option: any) => {
    const value = option?.value || null;
    setSelectedCountry(value);
    setSelectedState(null);
    setValue("country", value ? String(value) : "");
    setValue("state", "");
    setValue("city", "");
  };

  const handleStateChange = (option: any) => {
    const value = option?.value || null;
    setSelectedState(value);
    setValue("state", value ? String(value) : "");
    setValue("city", "");
  };

  const handleCityChange = (option: any) => {
    const value = option?.value || null;
    setValue("city", value ? String(value) : "");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* COUNTRY */}
      <div>
        <p className="label text-muted-foreground">Country*</p>
        <div className="mt-2">
          <Controller
            control={control}
            name="country"
            render={({ field: { onChange, value } }) => {
              const options = formatOptions(countries);
              const selected = findSelectedOption(options, value);

              return (
                <Select
                  instanceId="country"
                  placeholder={isLoading.countries ? "Loading..." : "Search Country"}
                  options={options}
                  value={selected}
                  onChange={(option) => {
                    onChange(option?.value ? String(option.value) : "");
                    handleCountryChange(option);
                  }}
                  isSearchable
                  isLoading={isLoading.countries}
                  isDisabled={isLoading.countries}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              );
            }}
          />
        </div>
      </div>

      {/* STATE */}
      <div>
        <p className="label text-muted-foreground">State*</p>
        <div className="mt-2">
          <Controller
            control={control}
            name="state"
            render={({ field: { onChange, value } }) => {
              const options = formatOptions(filteredStates);
              const selected = findSelectedOption(options, value);

              return (
                <Select
                  instanceId="state"
                  placeholder={!selectedCountry ? "Select country first" : "Search State"}
                  options={options}
                  value={selected}
                  onChange={(option) => {
                    onChange(option?.value ? String(option.value) : "");
                    handleStateChange(option);
                  }}
                  isSearchable
                  isDisabled={!selectedCountry || isLoading.states}
                  isLoading={isLoading.states}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  noOptionsMessage={() =>
                    !selectedCountry
                      ? "Please select a country first"
                      : "No states available"
                  }
                />
              );
            }}
          />
        </div>
      </div>

      {/* CITY */}
      <div>
        <p className="label text-muted-foreground">City*</p>
        <div className="mt-2">
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, value } }) => {
              const options = formatOptions(filteredCities);
              const selected = findSelectedOption(options, value);

              return (
                <Select
                  instanceId="city"
                  placeholder={!selectedState ? "Select state first" : "Search City"}
                  options={options}
                  value={selected}
                  onChange={(option) => {
                    onChange(option?.value ? String(option.value) : "");
                    handleCityChange(option);
                  }}
                  isSearchable
                  isDisabled={!selectedState || isLoading.cities}
                  isLoading={isLoading.cities}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  noOptionsMessage={() =>
                    !selectedState
                      ? "Please select a state first"
                      : "No cities available"
                  }
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}