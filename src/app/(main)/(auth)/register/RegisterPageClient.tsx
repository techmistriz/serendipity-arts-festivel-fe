"use client";

import { Suspense, useEffect } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch, type FieldValues, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { mediaPaths } from "@/config/images";
import { registerUser, registerVIP, registerSEA } from "@/services/register.service";

// Import schemas
import { generalSchema, seaSchema, guestSchema, ROLE_IDS } from "@/components/auth/hooks/schemas";

// Import form components
import { GeneralForm, SeaForm, GuestForm } from "@/components/auth/FormFields";
import { useCheckArchiveUser } from "@/components/auth/hooks/useCheckArchiveUser";
import { RouteLoadingOverlay } from "@/components/common/LoadingSkeletons";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "";
  const initialMode = (searchParams.get("mode") as "general" | "guest" | "sea") || "general";

  //for general show only
  // const initialMode = "general" as const;

  const [mode, setMode] = useState<"general" | "guest" | "sea">(initialMode);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setGlobalError] = useState<string | null>(null);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const schema = mode === "sea" ? seaSchema : mode === "guest" ? guestSchema : generalSchema;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    setError,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema) as unknown as Resolver<FieldValues>,
    defaultValues: {
      email: "",
      fullName: "",
      gender: "",
      std_code: "91",
      whatsapp: "",
      otp: "",
      newsletter: false,
      terms: false,
    },
  });

  const email = String(useWatch({ control, name: "email" }) ?? "");

  const isSea = mode === "sea";
  const isGuest = mode === "guest";

  const roleId = isSea ? ROLE_IDS.sea : isGuest ? ROLE_IDS.guest : ROLE_IDS.general;

  const { isChecking, userExists, archivedUser } = useCheckArchiveUser(email, roleId);

  useEffect(() => {
    if (!userExists || !archivedUser) {
      return;
    }

    setValue("email", archivedUser.email ?? "");
    setValue("fullName", archivedUser.name ?? "");
    setValue("gender", archivedUser.gender ?? "");

    setValue("std_code", archivedUser.std_code ?? "91");

    setValue("whatsapp", archivedUser.contact ? String(archivedUser.contact) : "");

    setValue("country", archivedUser.country_id ? String(archivedUser.country_id) : "");

    setValue("state", archivedUser.state_id ? String(archivedUser.state_id) : "");

    setValue("city", archivedUser.city_id ? String(archivedUser.city_id) : "");

    // General registration fields
    setValue("age", archivedUser.age_group ?? "");

    setValue("visitedYears", archivedUser.visited_year ?? []);

    setValue("newsletter", archivedUser.subscribe === 1);
  }, [userExists, archivedUser, setValue]);

  const handleModeChange = (newMode: "general" | "guest" | "sea") => {
    setMode(newMode);
    setGlobalError(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", newMode);
    router.replace(`/register?${params.toString()}`, { scroll: false });
  };

  const onSubmit = async (data: FieldValues) => {
    if (isChecking) {
      setGlobalError("Please wait while we check your email.");
      return;
    }

    if (userExists === null) {
      setGlobalError("Please enter a valid email and wait for the email check.");
      return;
    }

    setIsLoading(true);
    setGlobalError(null);

    const subscribe: 0 | 1 = data.newsletter ? 1 : 0;
    const isOldUser: 0 | 1 = userExists === true ? 1 : 0;

    try {
      let response;

      if (isSea) {
        const seaData = {
          role_id: ROLE_IDS.sea,
          name: data.fullName,
          email: data.email,
          gender: data.gender || "Prefer Not To Say",

          country_id: Number(data.country),
          state_id: Number(data.state),
          city_id: Number(data.city),

          std_code: data.std_code || "91",
          contact: data.whatsapp,
          otp: data.otp,

          referrer: "web",
          interest: ["SEA Delegate"],
          hearabout: "Website",

          subscribe,
          terms: data.terms,
          is_old_user: isOldUser,
        };

        response = await registerSEA(seaData);
      } else if (isGuest) {
        const guestData = {
          role_id: ROLE_IDS.guest,
          name: data.fullName,
          email: data.email,
          contact: data.contact,
          std_code: data.std_code || "91",

          dates: data.dates || [],
          travel: data.travel || "No",
          boarding: data.lodging || "No",
          accompanied_anyone: data.accompanied || "No",
          accompanied_persons: data.accompaniedPersons || "",
          additional_requests: data.additionalRequests || "",
          accomodation_assistance_required: data.accom || "No",

          // Existing archived user = 1
          // New user = 0
          is_old_user: isOldUser,
          subscribe,
        };

        response = await registerVIP(guestData);
      } else {
        const generalData = {
          role_id: ROLE_IDS.general,
          name: data.fullName,
          email: data.email,
          gender: data.gender || "Prefer Not To Say",

          country_id: parseInt(data.country) || 0,
          state_id: parseInt(data.state) || 0,
          city_id: parseInt(data.city) || 0,

          std_code: data.std_code || "91",
          contact: data.whatsapp || "",
          otp: data.otp || "",

          referrer: "web",
          interest: data.interests || [],
          hearabout: data.heard || "Other",

          subscribe,

          age_group: data.age || "",
          visited: data.visitedYears?.length ? "Yes" : "No",
          visited_year: data.visitedYears || [],
          custom_city: "",

          // Existing archived user = 1
          // New user = 0
          is_old_user: isOldUser,

          terms: data.terms,
        };

        response = await registerUser(generalData);
      }

      if (response) {
        const isSuccess = response.status === true || response.success === true;

        if (isSuccess) {
          setRegisteredEmail(data.email);

          reset({
            email: "",
            fullName: "",
            gender: "",
            std_code: "91",
            whatsapp: "",
            otp: "",
            newsletter: false,
            terms: false,
            dates: [],
            interests: [],
            visitedYears: [],
          });

          if (next) {
            router.push(next);
          } else {
            setSubmitted(true);
          }
        } else {
          const backendErrors = response.errors;

          if (backendErrors && typeof backendErrors === "object" && !Array.isArray(backendErrors)) {
            const messages = Object.values(backendErrors)
              .flat()
              .filter((message): message is string => typeof message === "string");

            if (messages.length > 0) {
              setGlobalError(messages.join(" "));
            } else {
              setGlobalError(
                typeof response.message === "string" ? response.message : "Registration failed",
              );
            }
          } else {
            setGlobalError(
              typeof response.message === "string" ? response.message : "Registration failed",
            );
          }
        }
      } else {
        setGlobalError("Registration failed: Invalid response");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const responseData = err.response?.data;

        const backendErrors = responseData?.errors;

        // Backend field-level errors
        if (backendErrors && typeof backendErrors === "object" && !Array.isArray(backendErrors)) {
          let hasFieldErrors = false;

          Object.entries(backendErrors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              hasFieldErrors = true;

              setError(field, {
                type: "server",
                message: String(messages[0]),
              });
            }
          });

          // Don’t show global error when backend
          // returned field-specific errors.
          if (hasFieldErrors) {
            return;
          }
        }

        // General backend error
        if (typeof backendErrors === "string") {
          setGlobalError(backendErrors);
        } else {
          setGlobalError("Registration failed. Please try again.");
        }
      } else {
        setGlobalError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container-editorial pt-16 md:pt-24 pb-40">
        <h1 className="display uppercase text-[14vw] md:text-[10vw] leading-[0.9]">You’re in.</h1>
        <p className="mt-8 max-w-xl text-muted-foreground">
          A confirmation has been sent to{" "}
          <span className="font-semibold text-foreground">{registeredEmail}</span>.
        </p>
        <div className="mt-8 max-w-xl border border-foreground p-6 md:p-8">
          <p className="label text-accent">
            {isSea
              ? "Your SEA Delegate Pass"
              : isGuest
                ? "Your Special Guest Pass"
                : "Your Art Pass"}
          </p>
          <p className="mt-3 display uppercase text-2xl md:text-3xl leading-[1] tracking-[-0.02em]">
            Sent to your email. Available on the app too.
          </p>
          <p className="mt-4 text-sm text-muted-foreground headline">
            {isGuest
              ? `Your Art Pass has been emailed to you and will also be available to download on our Festival app. Every programme you book gets added to the same pass — just show it at any venue in front of our zappers.`
              : ""}
          </p>
        </div>
        <Link
          href="/programmes"
          className="mt-10 inline-block label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
        >
          Browse programmes →
        </Link>
      </div>
    );
  }

  return (
    <div className="container-editorial pt-10 md:pt-16 pb-32">
      {/* Film banner */}
      <div className="relative overflow-hidden bg-black text-white aspect-[16/7] md:aspect-[16/5] w-full">
        <video
          src={mediaPaths.aftermovie}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" aria-hidden />
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
          <h1 className="display uppercase text-white text-[9vw] md:text-[5.5vw] leading-[0.9] tracking-[-0.03em] text-center max-w-[16ch]">
            {isSea
              ? "SEA Registration"
              : isGuest
                ? "Special Guest Registration"
                : "Visitor Registration"}
          </h1>
        </div>
      </div>

      {/* Mode tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {/* {(["general", "guest", "sea"] as const).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`headline uppercase tracking-[0.06em] text-xs md:text-sm border-2 px-4 py-2 transition-colors ${
              mode === m
                ? "bg-foreground text-background border-foreground"
                : "border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            {m === "general" ? "Visitor" : m === "guest" ? "Special Guest" : "SEA Delegate"}
          </button>
        ))} */}

        {/* for general show only */}

        {(["general"] as const).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`headline uppercase tracking-[0.06em] text-xs md:text-sm border-2 px-4 py-2 transition-colors ${
              mode === m
                ? "bg-foreground text-background border-foreground"
                : "border-foreground hover:bg-foreground hover:text-background"
            }`}
          >
            Visitor
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left column — copy */}
        <aside className="md:col-span-4">
          {isSea ? (
            <>
              <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
                Serendipity Exchange for the Arts.
              </p>
              <p className="mt-5 text-sm text-muted-foreground headline max-w-sm">
                SEA is a delegate program running parallel to the Serendipity Arts Festival 2026 — a
                platform for artists, companies, curators, producers and arts managers to present
                their work, exchange ideas and foster future collaborations.
              </p>
              <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
                Once your delegate registration is complete, all programming becomes complimentary
                for you.
              </p>
              <Link
                href="/sea"
                className="mt-6 inline-block label border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors"
              >
                About SEA →
              </Link>
            </>
          ) : isGuest ? (
            <>
              <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
                A curated welcome, on the house.
              </p>
              <p className="mt-5 text-sm text-muted-foreground headline max-w-sm">
                We welcome you to the exclusive VIP experience at the Serendipity Arts Festival
                2026. As a valued and distinguished guest, we are dedicated to ensuring that your
                visit is exceptional in every way.
              </p>
              <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
                Serendipity Arts Festival’s VIP programme offers our esteemed guests access to
                onsite VIP lounges, exclusive culinary experiences and a bespoke itinerary tailored
                to your preferences.
              </p>
              <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
                Please complete the form below, and our VIP management team will be in touch soon
                with a curated itinerary for your festival experience.
              </p>
            </>
          ) : (
            <>
              <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
                Your Art Pass, free.
              </p>
              <p className="mt-5 text-sm text-muted-foreground max-w-sm">
                Registration is free and open to all. The Art Pass will be available to download
                closer to the festival on our app.
              </p>
              <p className="mt-4 text-sm text-muted-foreground max-w-sm">
                Select programmes with limited seating are ticketed — you’ll be able to book them
                once you’re registered. Each booking gets added to the same Art Pass.
              </p>
            </>
          )}
          <p className="mt-8 label">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-foreground underline underline-offset-4 hover:text-accent"
            >
              Login here
            </Link>
          </p>
        </aside>

        {/* Form */}
        <form className="md:col-span-8 space-y-10" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          {mode === "general" && (
            <GeneralForm
              register={register}
              control={control}
              formState={{ errors }}
              watch={watch}
              setValue={setValue}
            />
          )}
          {mode === "sea" && (
            <SeaForm
              register={register}
              control={control}
              formState={{ errors }}
              watch={watch}
              setValue={setValue}
            />
          )}
          {mode === "guest" && (
            <GuestForm
              register={register}
              formState={{ errors }}
              watch={watch}
              setValue={setValue}
            />
          )}

          <div className="space-y-3 pt-4">
            <label className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                {...register("terms")}
                className="mt-1 accent-accent"
                required
              />
              I accept and agree to all the{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-accent">
                Terms and Conditions
              </Link>
            </label>
            {errors.terms?.message && (
              <p className="text-red-500 text-sm">{errors.terms.message.toString()}</p>
            )}

            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" {...register("newsletter")} className="mt-1 accent-accent" />
              Stay updated on this year’s programming and secure tickets before they sell out.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}

            className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors disabled:opacity-50"
          >
            {isLoading
              ? "Submitting..."
              : isGuest || isSea
                ? "Complete Registration →"
                : "Submit form →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function RegisterPageClient() {
  return (
    <Suspense fallback={<RouteLoadingOverlay label="Loading registration" />}>
      <RegisterContent />
    </Suspense>
  );
}
