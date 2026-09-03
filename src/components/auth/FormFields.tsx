"use client";

import { useCheckArchiveUser } from "./hooks/useCheckArchiveUser";

import { useState } from "react";
import type {
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Field, YesNo } from "./FieldComponents";
import { useOTP } from "./hooks/useOTP";
import SearchableLocation from "../common/SearchableLocation";

type RegistrationFieldsProps = {
  register: UseFormRegister<FieldValues>;
  control?: Control<FieldValues>;
  watch: UseFormWatch<FieldValues>;
  setValue: UseFormSetValue<FieldValues>;
  formState: { errors: FieldErrors<FieldValues> };
};

function getErrorMessage(error: unknown): string | undefined {
  if (typeof error !== "object" || error === null || !("message" in error)) return undefined;
  return typeof error.message === "string" ? error.message : undefined;
}

// General Form Component
export const GeneralForm = ({
  register,
  control,
  watch,
  setValue,
  formState: { errors },
}: RegistrationFieldsProps) => {
  const [age, setAge] = useState("");

  const { handleSendOTP, isSendingOTP, otpError, otpSent } = useOTP();

  const email = watch("email");
  const whatsapp = watch("whatsapp");
  const { isChecking, userExists, archiveError } = useCheckArchiveUser(email, 3);

  const AGE_GROUPS = [
    "Under 13",
    "13-17",
    "18-24",
    "25-34",
    "35-44",
    "45-54",
    "55-64",
    "65-70",
    "70+",
  ];
  const AGE_NOTES: Record<string, string> = {
    "Under 13":
      "Age may be verified during registration at the venue. Children below 13 must be accompanied by a parent or legal guardian at all times within festival venues, and may enter using their parent’s Art Pass.",
    "13-17":
      "Age may be verified during registration at the venue. For visitors aged 13–17, tickets to limited-seating programmes must be purchased by a parent or legal guardian.",
  };
  const GENDERS = ["Man", "Woman", "Transgender", "Non-Binary/Non-Conforming", "Prefer Not To Say"];
  const PAST_YEARS = [
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2022",
    "2023",
    "2024",
    "2025",
    "First time",
  ];
  const INTERESTS = [
    "Visual Arts",
    "Craft",
    "Dance",
    "Music",
    "Theatre",
    "Photography",
    "Culinary Arts",
    "Children’s Programmes",
    "Performance Art",
    "Accessibility",
    "Public Art",
    "All",
  ];
  const HEARD = [
    "Newspaper",
    "Social Media",
    "Friends",
    "Radio",
    "Television",
    "Billboard",
    "Other",
  ];

  return (
    <>
      <Field label="Email ID*">
        <input type="email" {...register("email")} className="input" required />

        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.email)}</p>
        )}

        {isChecking && <p className="text-sm text-muted-foreground mt-1">Checking email...</p>}

        {!isChecking && userExists === true && (
          <p className="text-green-500 text-sm mt-1">
            You’ve been part of previous editions of the Serendipity Arts Festival. Welcome back!
          </p>
        )}

        {/* {!isChecking && userExists === false && (
          <p className="text-green-600 text-sm mt-1">Email is available.</p>
        )} */}

        {archiveError && <p className="text-red-500 text-sm mt-1">{archiveError}</p>}
      </Field>

      <Field label="Full Name*">
        <input {...register("fullName")} className="input" required />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.fullName)}</p>
        )}
      </Field>

      <Field label="Gender">
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {GENDERS.map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm">
              <input type="radio" {...register("gender")} value={g} className="accent-accent" />
              {g}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Age Group">
        <input type="hidden" {...register("age")} />
        <div className="mt-3 flex flex-wrap gap-2">
          {AGE_GROUPS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => {
                setAge(a);
                setValue("age", a);
              }}
              className={`headline text-xs md:text-sm border rounded-md px-4 py-2 transition-colors ${
                age === a
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
        {AGE_NOTES[age] && (
          <div className="mt-4 border border-accent bg-muted/30 p-4 max-w-prose">
            <p className="label text-accent">A quick note</p>
            <p className="mt-2 text-sm md:text-base leading-relaxed headline text-muted-foreground whitespace-pre-line">
              {AGE_NOTES[age]}
            </p>
          </div>
        )}
      </Field>

      <SearchableLocation
        control={control!}
        setValue={setValue}
        watch={watch} // Add this
      />

      <Field label="Have you attended the Festival before?">
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {PAST_YEARS.map((y) => (
            <label key={y} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                value={y}
                {...register("visitedYears")}
                className="accent-accent"
              />
              {y}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Interests">
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {INTERESTS.map((i) => (
            <label key={i} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                value={i}
                {...register("interests")}
                className="accent-accent"
              />
              {i}
            </label>
          ))}
        </div>
      </Field>

      <Field label="How did you hear about us">
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {HEARD.map((h) => (
            <label key={h} className="flex items-center gap-2 text-sm">
              <input type="radio" {...register("heard")} value={h} className="accent-accent" />
              {h}
            </label>
          ))}
        </div>
      </Field>

      <Field label="WhatsApp Number">
        <div className="grid grid-cols-[110px_1fr] gap-3">
          <select {...register("std_code")} className="input">
            <option value="91">+91</option>
            <option value="1">+1</option>
            <option value="44">+44</option>
          </select>
          <input
            inputMode="numeric"
            maxLength={10}
            placeholder="10 digit number"
            className="input"
            {...register("whatsapp")}
          />
        </div>
      </Field>

      <Field label="OTP">
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <input inputMode="numeric" maxLength={6} className="input" {...register("otp")} />
          <button
            type="button"
            onClick={() => handleSendOTP(email, whatsapp, watch("std_code") || "91")}
            disabled={isSendingOTP}
            className="label border border-foreground rounded-full px-5 hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
          >
            {isSendingOTP ? "Sending..." : otpSent ? "Resend OTP" : "Get OTP"}
          </button>
        </div>
        {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
        {otpSent && <p className="text-green-500 text-sm mt-1">OTP sent successfully!</p>}
      </Field>
    </>
  );
};

// SEA Form Component
export const SeaForm = ({
  register,
  formState: { errors },
  watch,
  setValue,
  control,
}: RegistrationFieldsProps) => {
  const { handleSendOTP, isSendingOTP, otpError, otpSent } = useOTP();
  const email = watch("email");
  const whatsapp = watch("whatsapp");

  const GENDERS = ["Man", "Woman", "Transgender", "Non-Binary/Non-Conforming", "Prefer Not To Say"];

  return (
    <>
      <Field label="Email ID*">
        <input type="email" {...register("email")} className="input" required />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.email)}</p>
        )}
      </Field>

      <Field label="Full Name*">
        <input {...register("fullName")} className="input" required />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.fullName)}</p>
        )}
      </Field>

      <Field label="Gender">
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {GENDERS.map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm">
              <input type="radio" {...register("gender")} value={g} className="accent-accent" />
              {g}
            </label>
          ))}
        </div>
      </Field>

      <SearchableLocation
        control={control!}
        setValue={setValue}
        watch={watch} // Add this
      />

      <Field label="WhatsApp Number*">
        <div className="grid grid-cols-[110px_1fr] gap-3">
          <select {...register("std_code")} className="input" required>
            <option value="91">+91</option>
            <option value="1">+1</option>
            <option value="44">+44</option>
          </select>
          <input
            required
            inputMode="numeric"
            maxLength={12}
            placeholder="WhatsApp number"
            className="input"
            {...register("whatsapp")}
          />
        </div>
        {errors.whatsapp && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.whatsapp)}</p>
        )}
      </Field>

      <Field label="OTP*">
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <input
            required
            inputMode="numeric"
            maxLength={6}
            className="input"
            {...register("otp")}
          />
          <button
            type="button"
            onClick={() => handleSendOTP(email, whatsapp, watch("std_code") || "91")}
            disabled={isSendingOTP}
            className="label border border-foreground rounded-full px-5 hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
          >
            {isSendingOTP ? "Sending..." : otpSent ? "Resend OTP" : "Get OTP"}
          </button>
        </div>
        {errors.otp && <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.otp)}</p>}
        {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
        {otpSent && <p className="text-green-500 text-sm mt-1">OTP sent successfully!</p>}
      </Field>

      <div className="border border-foreground p-5 md:p-6">
        <p className="label">Once you’re verified</p>
        <p className="mt-3 text-sm text-muted-foreground headline">
          All Festival programming becomes complimentary for SEA delegates. You’ll still need to
          reserve individual programmes so we can hold your seat.
        </p>
      </div>
    </>
  );
};

// Guest Form Component
export const GuestForm = ({
  register,
  formState: { errors },
  setValue,
}: RegistrationFieldsProps) => {
  const GUEST_DATES = [
    "13 December",
    "14 December",
    "15 December",
    "16 December",
    "17 December",
    "18 December",
    "19 December",
    "20 December",
  ];
  const GUEST_NOTES = [
    "VIP Pass does not guarantee entry to the VIP Lounge. Access is subject to availability and operates on a first-come, first-served basis.",
    "VIP Pass is non-transferable.",
    "Each invitee may bring one accompanying guest only.",
    "Post-registration, guests are required to book individual programmes. Attendance is subject to prior reservation of specific events.",
    "Guests are requested to arrive 15–20 minutes prior to the start of each programme to ensure smooth entry.",
    "For special assistance (e.g. wheelchair or mobility support), guests must inform us in advance. Support is not subject to availability — it is priority assistance extended to those who need it, which must be informed prior.",
    "Seating for programmes is limited and subject to availability.",
    "Your Art Pass will be available on our app closer to the festival.",
    "Show your pass at any venue in front of our zappers to enter.",
  ];

  return (
    <>
      <Field label="Email ID*">
        <input type="email" {...register("email")} className="input" required />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.email)}</p>
        )}
      </Field>

      <Field label="Full Name*">
        <input {...register("fullName")} className="input" required />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.fullName)}</p>
        )}
      </Field>

      <Field label="Contact Number*">
        <div className="grid grid-cols-[140px_1fr] gap-3">
          <select {...register("std_code")} className="input" required>
            <option value="91">India (+91)</option>
            <option value="1">USA (+1)</option>
            <option value="44">UK (+44)</option>
          </select>
          <input
            required
            inputMode="numeric"
            maxLength={12}
            placeholder="Phone number"
            className="input"
            {...register("contact")}
          />
        </div>
        {errors.contact && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.contact)}</p>
        )}
      </Field>

      <Field label="Dates Attending*">
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {GUEST_DATES.map((d) => (
            <label key={d} className="flex items-center gap-2 text-sm">
              <input type="checkbox" value={d} {...register("dates")} className="accent-accent" />
              {d}
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              value="All of the above"
              onChange={(e) => {
                if (e.target.checked) {
                  setValue("dates", GUEST_DATES);
                } else {
                  setValue("dates", []);
                }
              }}
              className="accent-accent"
            />
            All of the above
          </label>
        </div>
        {errors.dates && (
          <p className="text-red-500 text-sm mt-1">{getErrorMessage(errors.dates)}</p>
        )}
      </Field>

      <YesNo label="Travel Assistance Required*" name="travel" register={register} />
      <YesNo label="Lodging/Boarding Assistance Required*" name="lodging" register={register} />
      <YesNo label="Accommodation Assistance Required*" name="accom" register={register} />
      <YesNo label="Will you be accompanied by anyone?*" name="accompanied" register={register} />

      <Field label="If yes, please specify names of accompanying persons">
        <input
          className="input"
          {...register("accompaniedPersons")}
          placeholder="Names of accompanying persons"
        />
      </Field>

      <Field label="Additional Requests or Preferences">
        <textarea rows={3} className="input" {...register("additionalRequests")} />
      </Field>

      <div className="border border-foreground p-5 md:p-6">
        <p className="label">A few quick notes for a smooth experience</p>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground headline list-disc pl-5">
          {GUEST_NOTES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm headline">
          For any queries, kindly reach out to us at{" "}
          <a href="mailto:rsvp@serendipityarts.org" className="underline underline-offset-4">
            rsvp@serendipityarts.org
          </a>
        </p>
      </div>
    </>
  );
};
