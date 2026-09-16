"use client";

import { useEffect, useState } from "react";
import type { FieldValues, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { getCountries } from "@/services/location.service";

type CountryOption = {
  name: string;
  std_code: string;
};

type CountryCodeSelectProps = {
  register: UseFormRegister<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  showCountryName?: boolean;
};

export default function CountryCodeSelect({
  register,
  setValue,
  showCountryName = false,
}: CountryCodeSelectProps) {
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [selectedCode, setSelectedCode] = useState("91");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    void getCountries()
      .then((countryData) => {
        if (!active) return;

        const uniqueCountries = Array.from(
          new Map(
            countryData
              .filter((country) => country.std_code?.trim())
              .map((country) => [
                `${country.name}-${country.std_code}`,
                {
                  name: country.name.trim(),
                  std_code: country.std_code!.trim(),
                },
              ]),
          ).values(),
        );

        setCountries(uniqueCountries);

        const india = uniqueCountries.find((country) => country.name.toLowerCase() === "india");

        const indiaCode = india?.std_code || "91";

        setSelectedCode(indiaCode);

        setValue("std_code", indiaCode, {
          shouldValidate: false,
          shouldDirty: false,
        });
      })
      .catch((error: unknown) => {
        console.error("Unable to load country calling codes:", error);

        if (!active) return;

        setCountries([
          {
            name: "India",
            std_code: "91",
          },
        ]);

        setSelectedCode("91");

        setValue("std_code", "91", {
          shouldValidate: false,
          shouldDirty: false,
        });
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [setValue]);

  const registration = register("std_code");

  return (
    <select
      {...registration}
      value={selectedCode}
      onChange={(event) => {
        const value = event.target.value;

        setSelectedCode(value);
        registration.onChange(event);
      }}
      className="input"
      disabled={loading}
    >
      {loading ? (
        <option value="91">{showCountryName ? "India (+91)" : "+91"}</option>
      ) : (
        countries.map((country) => (
          <option key={`${country.name}-${country.std_code}`} value={country.std_code}>
            {showCountryName ? `${country.name} (+${country.std_code})` : `+${country.std_code}`}
          </option>
        ))
      )}
    </select>
  );
}
