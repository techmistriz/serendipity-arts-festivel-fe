"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { authService } from "@/services/auth.service";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSession } from "@/redux/slices/authSlice";
import { UpdateProfilePayload } from "@/types/updateProfile";
import type { AuthUser } from "@/types/auth";

type ProfileFormValues = {
  name: string;
  gender: string;
  age_group: string;
  country_id: string;
  state_id: string;
  city_id: string;
  custom_city: string;
  interest: string[];
  hearabout: string;
  subscribe: boolean;
  visited: string;
  visited_year: string[];
};

const visitedYears = [
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
];

export default function ProfileEditForm() {
  const dispatch = useAppDispatch();

  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [profile, setProfile] = useState<AuthUser | null>(null);

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,

    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      name: "",
      gender: "",
      age_group: "",
      country_id: "",
      state_id: "",
      city_id: "",
      custom_city: "",
      interest: [],
      hearabout: "",
      subscribe: false,
      visited: "",
      visited_year: [],
    },
  });

  const visited = useWatch({
    control,
    name: "visited",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const profileData = await authService.profile();

        setProfile(profileData);

        reset({
          name: profileData.name ?? "",
          gender: profileData.gender ?? "",
          age_group: profileData.age_group ?? "",

          country_id: profileData.country_id ? String(profileData.country_id) : "",

          state_id: profileData.state_id ? String(profileData.state_id) : "",

          city_id: profileData.city_id ? String(profileData.city_id) : "",

          custom_city: profileData.custom_city ?? "",

          interest: Array.isArray(profileData.interest) ? profileData.interest : [],

          hearabout: profileData.hearabout ?? "",

          subscribe: Boolean(profileData.subscribe),

          visited: profileData.visited ?? "",

          visited_year: Array.isArray(profileData.visited_year)
            ? profileData.visited_year.map(String)
            : [],
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      void loadProfile();
    }
  }, [accessToken, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: UpdateProfilePayload = {
        name: values.name,
        gender: values.gender,
        age_group: values.age_group,
        country_id: values.country_id ? Number(values.country_id) : null,
        state_id: values.state_id ? Number(values.state_id) : null,
        city_id: values.city_id ? Number(values.city_id) : null,
        custom_city: values.custom_city,
        interest: values.interest,
        hearabout: values.hearabout,
        subscribe: values.subscribe ? 1 : 0,
        visited: values.visited,
        visited_year: values.visited_year,
      };
      const updatedUser = await authService.updateProfile(payload);

      if (accessToken) {
        dispatch(
          setSession({
            user: updatedUser,
            token: accessToken,
          }),
        );
      }

      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {success && <div className="border border-green-500 p-4">{success}</div>}

      {error && <div className="border border-red-500 p-4">{error}</div>}

      <div>
        <label>Name</label>

        <input
          {...register("name", {
            required: "Name is required",
          })}
          className="mt-2 w-full border p-3"
        />

        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Gender</label>

        <select {...register("gender")} className="mt-2 w-full border p-3">
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label>Age group</label>

        <select {...register("age_group")} className="mt-2 w-full border p-3">
          <option value="">Select age group</option>
          <option value="18-24">18-24</option>
          <option value="25-34">25-34</option>
          <option value="35-44">35-44</option>
          <option value="45-54">45-54</option>
          <option value="55+">55+</option>
        </select>
      </div>

      <div>
        <label>Country</label>

        <input
          value={profile?.country?.name ?? ""}
          readOnly
          className="mt-2 w-full border p-3 bg-gray-100"
        />
      </div>

      <div>
        <label>State</label>

        <input
          value={profile?.state?.name ?? ""}
          readOnly
          className="mt-2 w-full border p-3 bg-gray-100"
        />
      </div>

      <div>
        <label>City</label>

        <input
          value={profile?.city?.name ?? ""}
          readOnly
          className="mt-2 w-full border p-3 bg-gray-100"
        />
      </div>

      <div>
        <label>Custom city</label>

        <input {...register("custom_city")} className="mt-2 w-full border p-3" />
      </div>

      <div>
        <label>Interest</label>

        <input
          value={profile?.interest?.join(", ") ?? ""}
          readOnly
          className="mt-2 w-full border p-3 bg-gray-100"
        />
      </div>

      <div>
        <label>How did you hear about us?</label>

        <select {...register("hearabout")} className="mt-2 w-full border p-3">
          <option value="">Select</option>
          <option value="Google">Google</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="Friend">Friend</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label>Have you visited before?</label>

        <select {...register("visited")} className="mt-2 w-full border p-3">
          <option value="">Select</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      {visited === "Yes" && (
        <div>
          <label>Years visited</label>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {visitedYears.map((year) => (
              <label key={year} className="flex items-center gap-2">
                <input type="checkbox" value={year} {...register("visited_year")} />

                <span>{year}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <label className="flex items-center gap-3">
        <input type="checkbox" {...register("subscribe")} />
        <span>Subscribe to updates</span>
      </label>

      <button
        type="submit"
        disabled={saving}
        className="rounded-full border px-8 py-4 uppercase disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
