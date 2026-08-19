"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

type VolunteerForm = {
  firstName: string;
  lastName: string;
  email: string;
  contact: string;
  gender: string;
  dob: string;
  address: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  qualification: string;
  profession: string;

  resume: FileList;
  profileImage: FileList;
  aadhaarFront: FileList;
  aadhaarBack: FileList;

  parentsName: string;
  parentsContact: string;
  emergencyName: string;
  emergencyContact: string;

  priorVolunteer: string;

  d1: string;
  d2: string;
  d3: string;

  dep1: string;
  dep2: string;
  dep3: string;

  interests: string;
  motivation: string;
  accept: boolean;
};

export default function VolunteerApply() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VolunteerForm>({
    defaultValues: {
      contact: "+91 ",
      country: "India",
      priorVolunteer: "No",
      gender: "",
      accept: false,
    },
  });

  const firstName = watch("firstName");
  const email = watch("email");

  const onSubmit = (data: VolunteerForm) => {
    console.log("Volunteer application:", data);

    // API call will go here later

    setSent(true);
  };

  if (sent) {
    return (
      <div className="container-editorial pt-16 md:pt-24 pb-40">
        <h1 className="display uppercase text-[12vw] md:text-[8vw] leading-[0.9]">
          Application received.
        </h1>

        <p className="mt-8 max-w-xl text-muted-foreground headline text-lg">
          Thank you, {firstName || "friend"}. Shortlisted candidates will be contacted by 15 October
          - keep an eye on {email}.
        </p>
      </div>
    );
  }

  return (
    <div className="container-editorial pt-10 md:pt-20 pb-32">
      <h1 className="display uppercase text-[12vw] md:text-[9vw] leading-[0.9] mt-2">
        Volunteer
        <br />
        Registration
      </h1>

      <p className="mt-6 max-w-2xl text-muted-foreground headline text-base md:text-lg">
        Fill out the form below to apply. Shortlisted candidates will be contacted by 15 October
        2026.
      </p>

      <form
        className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* First Name / Last Name / Email / Contact */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <F label="First Name*">
            <input
              required
              className="input"
              {...register("firstName", {
                required: "First name is required",
              })}
            />
          </F>

          <F label="Last Name*">
            <input
              required
              className="input"
              {...register("lastName", {
                required: "Last name is required",
              })}
            />
          </F>

          <F label="Email*">
            <input
              required
              type="email"
              className="input"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Please enter a valid email",
                },
              })}
            />
          </F>

          <F label="Contact*">
            <input
              required
              inputMode="tel"
              className="input"
              {...register("contact", {
                required: "Contact is required",
              })}
            />
          </F>
        </div>

        {/* Gender */}
        <div className="md:col-span-12">
          <F label="Gender*">
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {["He/Him", "She/Her", "Other"].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm headline">
                  <input
                    type="radio"
                    value={g}
                    {...register("gender", {
                      required: "Gender is required",
                    })}
                    className="accent-accent"
                  />
                  {g}
                </label>
              ))}
            </div>

            {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
          </F>
        </div>

        {/* DOB */}
        <div className="md:col-span-12">
          <F label="DOB*">
            <input
              required
              type="date"
              className="input"
              {...register("dob", {
                required: "Date of birth is required",
              })}
            />

            <p className="mt-1 text-xs text-muted-foreground">
              * You must be 18+ years as of 1st December 2026.
            </p>
          </F>
        </div>

        {/* Address */}
        <div className="md:col-span-12">
          <F label="Address*">
            <textarea
              required
              rows={2}
              className="input"
              {...register("address", {
                required: "Address is required",
              })}
            />
          </F>
        </div>

        {/* Country / State / City / Pincode */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <F label="Country*">
            <input
              required
              className="input"
              {...register("country", {
                required: "Country is required",
              })}
            />
          </F>

          <F label="State*">
            <input
              required
              className="input"
              {...register("state", {
                required: "State is required",
              })}
            />
          </F>

          <F label="City*">
            <input
              required
              className="input"
              {...register("city", {
                required: "City is required",
              })}
            />
          </F>

          <F label="Pincode*">
            <input
              required
              inputMode="numeric"
              className="input"
              {...register("pincode", {
                required: "Pincode is required",
              })}
            />
          </F>
        </div>

        {/* Qualification / Profession */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <F label="Highest Qualification*">
            <input
              required
              className="input"
              {...register("qualification", {
                required: "Qualification is required",
              })}
            />
          </F>

          <F label="Profession*">
            <select
              required
              className="input"
              {...register("profession", {
                required: "Profession is required",
              })}
            >
              <option value="">Select</option>
              <option>Student</option>
              <option>Private Employee</option>
              <option>Government Employee</option>
              <option>Self-employed</option>
              <option>Freelancer</option>
              <option>Other</option>
            </select>
          </F>
        </div>

        {/* Files */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <F label="Resume / CV*">
            <input
              required
              type="file"
              accept=".pdf,.doc,.docx"
              className="text-sm headline"
              {...register("resume", {
                required: "Resume / CV is required",
                validate: {
                  size: (files) =>
                    !files?.[0] || files[0].size <= 2 * 1024 * 1024 || "Max 2MB allowed.",
                },
              })}
            />

            <p className="mt-1 text-xs text-muted-foreground">Max 2MB allowed.</p>
          </F>

          <F label="Profile Image*">
            <input
              required
              type="file"
              accept="image/*"
              className="text-sm headline"
              {...register("profileImage", {
                required: "Profile image is required",
                validate: {
                  size: (files) =>
                    !files?.[0] || files[0].size <= 1 * 1024 * 1024 || "Max 1MB allowed.",
                },
              })}
            />

            <p className="mt-1 text-xs text-muted-foreground">Max 1MB allowed.</p>
          </F>

          <F label="Aadhaar - front side*">
            <input
              required
              type="file"
              accept="image/*"
              className="text-sm headline"
              {...register("aadhaarFront", {
                required: "Aadhaar front side is required",
              })}
            />
          </F>

          <F label="Aadhaar - back side*">
            <input
              required
              type="file"
              accept="image/*"
              className="text-sm headline"
              {...register("aadhaarBack", {
                required: "Aadhaar back side is required",
              })}
            />
          </F>
        </div>

        {/* Parents / Guardian */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <F label="Parents / Guardian Name*">
            <input
              required
              className="input"
              {...register("parentsName", {
                required: "Parents / Guardian name is required",
              })}
            />
          </F>

          <F label="Parents / Guardian Contact*">
            <input
              required
              inputMode="tel"
              className="input"
              {...register("parentsContact", {
                required: "Parents / Guardian contact is required",
              })}
            />
          </F>
        </div>

        {/* Emergency Contact */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <F label="Emergency Contact Name*">
            <input
              required
              className="input"
              {...register("emergencyName", {
                required: "Emergency contact name is required",
              })}
            />
          </F>

          <F label="Emergency Contact Number*">
            <input
              required
              inputMode="tel"
              className="input"
              {...register("emergencyContact", {
                required: "Emergency contact number is required",
              })}
            />
          </F>
        </div>

        {/* Previous Volunteer */}
        <div className="md:col-span-12">
          <F label="Have you already been a volunteer with us?*">
            <select
              required
              className="input"
              {...register("priorVolunteer", {
                required: "Please select an option",
              })}
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </F>
        </div>

        {/* Discipline Heading */}
        <div className="md:col-span-12">
          <p className="display uppercase text-lg md:text-xl leading-tight pt-4">
            If given a chance, which discipline & department would you like to volunteer for?
          </p>
        </div>

        {/* Discipline */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["d1", "d2", "d3"] as const).map((k, i) => (
            <F key={k} label={`Discipline priority ${i + 1}*`}>
              <select
                required
                className="input"
                {...register(k, {
                  required: `Discipline priority ${i + 1} is required`,
                })}
              >
                <option value="">Select</option>
                <option>Visual Arts</option>
                <option>Performance Art</option>
                <option>Theatre</option>
                <option>Music</option>
                <option>Dance</option>
                <option>Culinary Arts</option>
                <option>Photography</option>
                <option>Film</option>
              </select>
            </F>
          ))}
        </div>

        {/* Department */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["dep1", "dep2", "dep3"] as const).map((k, i) => (
            <F key={k} label={`Department priority ${i + 1}*`}>
              <select
                required
                className="input"
                {...register(k, {
                  required: `Department priority ${i + 1} is required`,
                })}
              >
                <option value="">Select</option>
                <option>Production</option>
                <option>Transportation</option>
                <option>Festival Shop</option>
                <option>Registration</option>
                <option>Hospitality</option>
                <option>Backstage</option>
                <option>Social Media</option>
                <option>Art Guiding</option>
              </select>
            </F>
          ))}
        </div>

        {/* Interests */}
        <div className="md:col-span-12">
          <F label="Interests*">
            <input
              required
              className="input"
              placeholder="Dance, Music…"
              {...register("interests", {
                required: "Interests are required",
              })}
            />
          </F>
        </div>

        {/* Motivation */}
        <div className="md:col-span-12">
          <p className="display uppercase text-lg md:text-xl leading-tight pt-4">
            What do you hope to gain from volunteering at Serendipity Arts Festival?
          </p>

          <F label="Your answer*">
            <textarea
              required
              rows={4}
              className="input"
              {...register("motivation", {
                required: "Your answer is required",
              })}
            />
          </F>
        </div>

        {/* Terms */}
        <div className="md:col-span-12">
          <label className="flex items-start gap-3 text-sm headline pt-4">
            <input
              required
              type="checkbox"
              {...register("accept", {
                required: "You must accept the Terms & Conditions",
              })}
              className="mt-1 accent-accent"
            />
            I accept the{" "}
            <a href="/terms" className="underline underline-offset-4 hover:text-accent">
              Terms & Conditions
            </a>
            .
          </label>

          {errors.accept && <p className="mt-1 text-xs text-red-500">{errors.accept.message}</p>}
        </div>

        {/* Submit */}
        <div className="md:col-span-12">
          <button
            type="submit"
            className="display uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors"
          >
            Submit application →
          </button>
        </div>
      </form>
    </div>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="label text-muted-foreground">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
