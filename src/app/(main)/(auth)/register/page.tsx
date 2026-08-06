"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { registerUser, registerVIP, registerSEA } from "@/src/services/register.service";

// Import schemas
import { 
    generalSchema, 
    seaSchema, 
    guestSchema, 
    ROLE_IDS,
    type GeneralFormData,
    type SEAFormData,
    type GuestFormData
} from "@/src/components/register/hooks/schemas";

// Import form components
import { GeneralForm, SeaForm, GuestForm } from "@/src/components/register/FormFields";

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "";
    const initialMode = (searchParams.get("mode") as "general" | "guest" | "sea") || "general";

    const [mode, setMode] = useState<"general" | "guest" | "sea">(initialMode);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [registeredEmail, setRegisteredEmail] = useState("");

    // Choose the appropriate schema based on mode
    const getSchema = () => {
        switch (mode) {
            case "general":
                return generalSchema;
            case "sea":
                return seaSchema;
            case "guest":
                return guestSchema;
            default:
                return generalSchema;
        }
    };

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<any>({
        resolver: zodResolver(getSchema()),
        defaultValues: {
            std_code: "91",
            terms: false,
            newsletter: false,
            dates: [],
            interests: [],
            visitedYears: [],
        },
    });

    const isGuest = mode === "guest";
    const isSea = mode === "sea";

    const handleModeChange = (newMode: "general" | "guest" | "sea") => {
        setMode(newMode);
        setError(null);
        const params = new URLSearchParams(searchParams.toString());
        params.set("mode", newMode);
        router.replace(`/register?${params.toString()}`, { scroll: false });
    };

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setError(null);

        try {
            let response;

            if (isSea) {
                // Transform SEA data
                const seaData = {
                    role_id: ROLE_IDS.sea,
                    name: data.fullName,
                    email: data.email,
                    gender: data.gender || "Prefer Not To Say",
                    country_id: parseInt(data.country),
                    state_id: parseInt(data.state),
                    city_id: parseInt(data.city),
                    std_code: data.std_code || "91",
                    contact: data.whatsapp,
                    otp: data.otp,
                    referrer: "web",
                    interest: ["SEA Delegate"],
                    hearabout: "Website",
                    subscribe: data.newsletter ? 1 : 0,
                    terms: data.terms,
                };
                response = await registerSEA(seaData);
            } else if (isGuest) {
                // Transform Guest/VIP data
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
                    is_old_user: false,
                };
                response = await registerVIP(guestData);
            } else {
                // Transform General data
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
                    subscribe: data.newsletter ? 1 : 0,
                    age_group: data.age || "",
                    visited: data.visitedYears?.length ? "Yes" : "No",
                    visited_year: data.visitedYears || [],
                    custom_city: "",
                    is_old_user: 0,
                    terms: data.terms,
                };
                console.log("Form Data:", data);
                console.log("Age:", data.age);
                response = await registerUser(generalData);
            }

            console.log(response.data);

            // Check if response and response.data exist
            if (response && response.data) {
                // Check for success in response
                const isSuccess = response.data.status === true || response.data.success === true;

                if (isSuccess) {
                    setRegisteredEmail(data.email);

                    // Clear the form
                    reset({
                        std_code: "91",
                        terms: false,
                        newsletter: false,
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
                    // Handle error message - ensure it's a string
                    const errorMessage = typeof response.data.message === 'string'
                        ? response.data.message
                        : "Registration failed";
                    setError(errorMessage);
                }
            } else {
                setError("Registration failed: Invalid response");
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                const errorMessage = typeof err.response?.data?.message === 'string'
                    ? err.response.data.message
                    : "Registration failed. Please try again.";
                setError(errorMessage);
                // Handle validation errors
                if (err.response) {
                    console.log("Status:", err.response.status);
                    console.log("Response:", err.response.data);

                    if (err.response.data.errors) {
                        console.table(err.response.data.errors);
                    }
                }
            } else {
                setError("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="container-editorial pt-16 md:pt-24 pb-40">
                <h1 className="display uppercase text-[14vw] md:text-[10vw] leading-[0.9]">You're in.</h1>
                <p className="mt-8 max-w-xl text-muted-foreground">
                    A confirmation has been sent to{" "}
                    <span className="font-semibold text-foreground">
                        {registeredEmail}
                    </span>.
                </p>
                <div className="mt-8 max-w-xl border border-foreground p-6 md:p-8">
                    <p className="label text-accent">
                        {isSea ? "Your SEA Delegate Pass" : isGuest ? "Your Special Guest Pass" : "Your Art Pass"}
                    </p>
                    <p className="mt-3 display uppercase text-2xl md:text-3xl leading-[1] tracking-[-0.02em]">
                        Available on our app, closer to the festival.
                    </p>
                    <p className="mt-4 text-sm text-muted-foreground headline">
                        {isGuest
                            ? "We can't wait to see you in Panjim, Goa, 13–20 December."
                            : "Each time you book a programme, it will be added to your single Art Pass, just show it at any venue in front of our zappers."}
                    </p>
                </div>
                <Link href="/programmes" className="mt-10 inline-block label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors">
                    Browse programmes →
                </Link>
            </div>
        );
    }

    return (
        <div className="container-editorial pt-10 md:pt-16 pb-32">
            {/* Film banner */}
            <div className="relative overflow-hidden bg-black text-white aspect-[16/7] md:aspect-[16/5] w-full">
                <video src="/saf-aftermovie.mp4" autoPlay muted loop playsInline preload="auto"
                    className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/45" aria-hidden />
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
                    <h1 className="display uppercase text-white text-[9vw] md:text-[5.5vw] leading-[0.9] tracking-[-0.03em] text-center max-w-[16ch]">
                        {isSea ? "SEA Registration" : isGuest ? "Special Guest Registration" : "General Visitor Registration"}
                    </h1>
                </div>
            </div>

            {/* Mode tabs */}
            <div className="mt-8 flex flex-wrap gap-2">
                {(["general", "guest", "sea"] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => handleModeChange(m)}
                        className={`headline uppercase tracking-[0.06em] text-xs md:text-sm border-2 px-4 py-2 transition-colors ${mode === m
                            ? "bg-foreground text-background border-foreground"
                            : "border-foreground hover:bg-foreground hover:text-background"
                            }`}
                    >
                        {m === "general" ? "General Visitor" : m === "guest" ? "Special Guest" : "SEA Delegate"}
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
                                SEA is a delegate program running parallel to the Serendipity Arts Festival 2026 — a platform for artists, companies, curators, producers and arts managers to present their work, exchange ideas and foster future collaborations.
                            </p>
                            <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
                                Once your delegate registration is complete, all programming becomes complimentary for you.
                            </p>
                            <Link href="/sea" className="mt-6 inline-block label border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors">
                                About SEA →
                            </Link>
                        </>
                    ) : isGuest ? (
                        <>
                            <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
                                A curated welcome, on the house.
                            </p>
                            <p className="mt-5 text-sm text-muted-foreground headline max-w-sm">
                                We welcome you to the exclusive VIP experience at the Serendipity Arts Festival 2026. As a valued and distinguished guest, we are dedicated to ensuring that your visit is exceptional in every way.
                            </p>
                            <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
                                Serendipity Arts Festival's VIP programme offers our esteemed guests access to onsite VIP lounges, exclusive culinary experiences and a bespoke itinerary tailored to your preferences.
                            </p>
                            <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
                                Please complete the form below, and our VIP management team will be in touch soon with a curated itinerary for your festival experience.
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
                                Your Art Pass, free.
                            </p>
                            <p className="mt-5 text-sm text-muted-foreground max-w-sm">
                                Registration is free and open to all. The Art Pass will be available to download closer to the festival on our app.
                            </p>
                            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
                                Select programmes with limited seating are ticketed — you'll be able to book them once you're registered. Each booking gets added to the same Art Pass.
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
                    {mode === "general" && <GeneralForm register={register} formState={{ errors }} watch={watch} setValue={setValue} />}
                    {mode === "sea" && <SeaForm register={register} formState={{ errors }} watch={watch} setValue={setValue} />}
                    {mode === "guest" && <GuestForm register={register} formState={{ errors }} watch={watch} setValue={setValue} />}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3 pt-4">
                        <label className="flex items-start gap-3 text-sm">
                            <input type="checkbox" {...register("terms")} className="mt-1 accent-accent" required/>
                            I accept and agree to all the <Link href="/terms" className="underline underline-offset-4 hover:text-accent">Terms and Conditions</Link>
                        </label>
                        {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

                        <label className="flex items-start gap-3 text-sm">
                            <input type="checkbox" {...register("newsletter")} className="mt-1 accent-accent" />
                            Stay updated on this year's programming and secure tickets before they sell out.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors disabled:opacity-50"
                    >
                        {isLoading ? "Submitting..." : isGuest || isSea ? "Complete Registration →" : "Submit form →"}
                    </button>
                </form>
            </div>
        </div>
    );
}








// "use client";

// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { sendOTP, registerUser, registerVIP, registerSEA } from "@/src/services/auth.service";
// import { ApiResponse } from "@/src/types/auth";
// import { AxiosError } from "axios";

// const ROLE_IDS = {
//     general: 3,
//     guest: 5,
//     sea: 9,
// };

// // Define schemas for each mode with std_code added
// const baseSchema = {
//     email: z.string().min(1, "Email is required").email("Invalid email"),
//     fullName: z.string().min(3, "Full name is required"),
//     std_code: z.string().default("91"),
//     terms: z.literal(true, {
//         errorMap: () => ({ message: "Accept Terms & Conditions" }),
//     }),
// };

// const generalSchema = z.object({
//     ...baseSchema,
//     gender: z.string().optional(),
//     age: z.string().optional(),
//     country: z.string().optional(),
//     state: z.string().optional(),
//     city: z.string().optional(),
//     whatsapp: z.string().optional(),
//     otp: z.string().optional(),
//     newsletter: z.boolean().optional(),
//     heard: z.string().optional(),
//     interests: z.array(z.string()).optional(),
//     visitedYears: z.array(z.string()).optional(),
// });

// const seaSchema = z.object({
//     ...baseSchema,
//     gender: z.string().optional(),
//     country: z.string().min(1, "Country is required"),
//     state: z.string().min(1, "State is required"),
//     city: z.string().min(1, "City is required"),
//     whatsapp: z.string().min(10, "Valid WhatsApp number is required"),
//     otp: z.string().min(4, "OTP is required"),
//     newsletter: z.boolean().optional(),
// });

// const guestSchema = z.object({
//     ...baseSchema,
//     contact: z.string().min(10, "Contact number is required"),
//     dates: z.array(z.string()).min(1, "Select at least one date"),
//     travel: z.string().min(1, "Please select an option"),
//     lodging: z.string().min(1, "Please select an option"),
//     accom: z.string().min(1, "Please select an option"),
//     accompanied: z.string().min(1, "Please select an option"),
//     accompaniedPersons: z.string().optional(),
//     additionalRequests: z.string().optional(),
// });

// type GeneralFormData = z.infer<typeof generalSchema>;
// type SEAFormData = z.infer<typeof seaSchema>;
// type GuestFormData = z.infer<typeof guestSchema>;

// // OTP Handler
// const useOTP = () => {
//     const [isSendingOTP, setIsSendingOTP] = useState(false);
//     const [otpError, setOtpError] = useState<string | null>(null);
//     const [otpSent, setOtpSent] = useState(false);

//     const handleSendOTP = async (email: string, contact: string, std_code: string) => {
//         if (!email || !contact) {
//             setOtpError("Email and contact number are required");
//             return;
//         }

//         setIsSendingOTP(true);
//         setOtpError(null);

//         try {
//             const response = await sendOTP({ email, contact, std_code });

//             // Check if response is successful
//             if (response && response.data) {
//                 const isSuccess = response.data.success === true || response.data.status === true;
//                 if (isSuccess) {
//                     setOtpSent(true);
//                 } else {
//                     setOtpError(response.data.message || "Failed to send OTP");
//                 }
//             } else {
//                 setOtpError("Failed to send OTP: Invalid response");
//             }
//         } catch (error) {
//             if (error instanceof AxiosError) {
//                 setOtpError(error.response?.data?.message || "Failed to send OTP");
//             } else {
//                 setOtpError("An unexpected error occurred");
//             }
//         } finally {
//             setIsSendingOTP(false);
//         }
//     };

//     return { handleSendOTP, isSendingOTP, otpError, otpSent };
// };

// // General Form Component
// const GeneralForm = ({ register, formState: { errors }, watch, setValue }: any) => {
//     const [age, setAge] = useState("");

//     const { handleSendOTP, isSendingOTP, otpError, otpSent } = useOTP();

//     const email = watch("email");
//     const whatsapp = watch("whatsapp");

//     const AGE_GROUPS = ["Under 13", "13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65-70", "70+"];
//     const AGE_NOTES: Record<string, string> = {
//         "Under 13": "Age may be verified during registration at the venue. Children below 13 must be accompanied by a parent or legal guardian at all times within festival venues, and may enter using their parent's Art Pass.",
//         "13-17": "Age may be verified during registration at the venue. For visitors aged 13–17, tickets to limited-seating programmes must be purchased by a parent or legal guardian.",
//     };
//     const GENDERS = ["Man", "Woman", "Transgender", "Non-Binary/Non-Conforming", "Prefer Not To Say"];
//     const PAST_YEARS = ["2016", "2017", "2018", "2019", "2020", "2022", "2023", "2024", "2025", "First time"];
//     const INTERESTS = [
//         "Visual Arts", "Craft", "Dance", "Music", "Theatre", "Photography",
//         "Culinary Arts", "Children's Programmes", "Performance Art",
//         "Accessibility", "Public Art", "All",
//     ];
//     const HEARD = ["Newspaper", "Social Media", "Friends", "Radio", "Television", "Billboard", "Other"];

//     return (
//         <>
//             <Field label="Email ID*">
//                 <input type="email" {...register("email")} className="input" required />
//                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//             </Field>

//             <Field label="Full Name*">
//                 <input {...register("fullName")} className="input" required />
//                 {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
//             </Field>

//             <Field label="Gender">
//                 <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
//                     {GENDERS.map((g) => (
//                         <label key={g} className="flex items-center gap-2 text-sm">
//                             <input type="radio" {...register("gender")} value={g} className="accent-accent" />
//                             {g}
//                         </label>
//                     ))}
//                 </div>
//             </Field>

//             <Field label="Age Group">
//                 <input type="hidden" {...register("age")} />
//                 <div className="mt-3 flex flex-wrap gap-2">
//                     {AGE_GROUPS.map((a) => (
//                         <button
//                             type="button"
//                             key={a}
//                             onClick={() => {
//                                 setAge(a);
//                                 setValue("age", a);
//                             }}
//                             className={`headline text-xs md:text-sm border rounded-md px-4 py-2 transition-colors ${age === a ? "bg-foreground text-background border-foreground" : "border-foreground hover:bg-foreground hover:text-background"
//                                 }`}
//                         >
//                             {a}
//                         </button>
//                     ))}
//                 </div>
//                 {AGE_NOTES[age] && (
//                     <div className="mt-4 border border-accent bg-muted/30 p-4 max-w-prose">
//                         <p className="label text-accent">A quick note</p>
//                         <p className="mt-2 text-sm md:text-base leading-relaxed headline text-muted-foreground whitespace-pre-line">
//                             {AGE_NOTES[age]}
//                         </p>
//                     </div>
//                 )}
//             </Field>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 <Field label="Country">
//                     <select {...register("country")} className="input">
//                         <option value="">Select country</option>
//                         <option value="101">India</option>
//                         <option value="102">United States</option>
//                         <option value="103">United Kingdom</option>
//                     </select>
//                 </Field>
//                 <Field label="State">
//                     <select {...register("state")} className="input">
//                         <option value="">Select state</option>
//                         <option value="12">Goa</option>
//                         <option value="13">Maharashtra</option>
//                         <option value="14">Karnataka</option>
//                     </select>
//                 </Field>
//                 <Field label="City">
//                     <select {...register("city")} className="input">
//                         <option value="">Select</option>
//                         <option value="45">Panjim</option>
//                         <option value="46">Mumbai</option>
//                         <option value="47">Bengaluru</option>
//                     </select>
//                 </Field>
//             </div>

//             <Field label="Have you attended the Festival before?">
//                 <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
//                     {PAST_YEARS.map((y) => (
//                         <label key={y} className="flex items-center gap-2 text-sm">
//                             <input
//                                 type="checkbox"
//                                 value={y}
//                                 {...register("visitedYears")}
//                                 className="accent-accent"
//                             />
//                             {y}
//                         </label>
//                     ))}
//                 </div>
//             </Field>

//             <Field label="Interests">
//                 <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
//                     {INTERESTS.map((i) => (
//                         <label key={i} className="flex items-center gap-2 text-sm">
//                             <input
//                                 type="checkbox"
//                                 value={i}
//                                 {...register("interests")}
//                                 className="accent-accent"
//                             />
//                             {i}
//                         </label>
//                     ))}
//                 </div>
//             </Field>

//             <Field label="How did you hear about us">
//                 <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
//                     {HEARD.map((h) => (
//                         <label key={h} className="flex items-center gap-2 text-sm">
//                             <input type="radio" {...register("heard")} value={h} className="accent-accent" />
//                             {h}
//                         </label>
//                     ))}
//                 </div>
//             </Field>

//             <Field label="WhatsApp Number">
//                 <div className="grid grid-cols-[110px_1fr] gap-3">
//                     <select {...register("std_code")} className="input">
//                         <option value="91">+91</option>
//                         <option value="1">+1</option>
//                         <option value="44">+44</option>
//                     </select>
//                     <input
//                         inputMode="numeric"
//                         maxLength={10}
//                         placeholder="10 digit number"
//                         className="input"
//                         {...register("whatsapp")}
//                     />
//                 </div>
//             </Field>

//             <Field label="OTP">
//                 <div className="grid grid-cols-[1fr_auto] gap-3">
//                     <input
//                         inputMode="numeric"
//                         maxLength={6}
//                         className="input"
//                         {...register("otp")}
//                     />
//                     <button
//                         type="button"
//                         onClick={() => handleSendOTP(email, whatsapp, watch("std_code") || "91")}
//                         disabled={isSendingOTP}
//                         className="label border border-foreground rounded-full px-5 hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
//                     >
//                         {isSendingOTP ? "Sending..." : otpSent ? "Resend OTP" : "Get OTP"}
//                     </button>
//                 </div>
//                 {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
//                 {otpSent && <p className="text-green-500 text-sm mt-1">OTP sent successfully!</p>}
//             </Field>
//         </>
//     );
// };

// // SEA Form Component
// const SeaForm = ({ register, formState: { errors }, watch, setValue }: any) => {
//     const { handleSendOTP, isSendingOTP, otpError, otpSent } = useOTP();
//     const email = watch("email");
//     const whatsapp = watch("whatsapp");

//     const GENDERS = ["Man", "Woman", "Transgender", "Non-Binary/Non-Conforming", "Prefer Not To Say"];

//     return (
//         <>
//             <Field label="Email ID*">
//                 <input type="email" {...register("email")} className="input" required />
//                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//             </Field>

//             <Field label="Full Name*">
//                 <input {...register("fullName")} className="input" required />
//                 {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
//             </Field>

//             <Field label="Gender">
//                 <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
//                     {GENDERS.map((g) => (
//                         <label key={g} className="flex items-center gap-2 text-sm">
//                             <input type="radio" {...register("gender")} value={g} className="accent-accent" />
//                             {g}
//                         </label>
//                     ))}
//                 </div>
//             </Field>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 <Field label="Country*">
//                     <select {...register("country")} className="input" required>
//                         <option value="">Select country</option>
//                         <option value="101">India</option>
//                         <option value="102">United States</option>
//                         <option value="103">United Kingdom</option>
//                     </select>
//                     {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
//                 </Field>
//                 <Field label="State*">
//                     <select {...register("state")} className="input" required>
//                         <option value="">Select state</option>
//                         <option value="12">Goa</option>
//                         <option value="13">Maharashtra</option>
//                         <option value="14">Karnataka</option>
//                     </select>
//                     {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
//                 </Field>
//                 <Field label="City*">
//                     <select {...register("city")} className="input" required>
//                         <option value="">Select</option>
//                         <option value="45">Panjim</option>
//                         <option value="46">Mumbai</option>
//                         <option value="47">Bengaluru</option>
//                     </select>
//                     {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
//                 </Field>
//             </div>

//             <Field label="WhatsApp Number*">
//                 <div className="grid grid-cols-[110px_1fr] gap-3">
//                     <select {...register("std_code")} className="input" required>
//                         <option value="91">+91</option>
//                         <option value="1">+1</option>
//                         <option value="44">+44</option>
//                     </select>
//                     <input
//                         required
//                         inputMode="numeric"
//                         maxLength={12}
//                         placeholder="WhatsApp number"
//                         className="input"
//                         {...register("whatsapp")}
//                     />
//                 </div>
//                 {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>}
//             </Field>

//             <Field label="OTP*">
//                 <div className="grid grid-cols-[1fr_auto] gap-3">
//                     <input
//                         required
//                         inputMode="numeric"
//                         maxLength={6}
//                         className="input"
//                         {...register("otp")}
//                     />
//                     <button
//                         type="button"
//                         onClick={() => handleSendOTP(email, whatsapp, watch("std_code") || "91")}
//                         disabled={isSendingOTP}
//                         className="label border border-foreground rounded-full px-5 hover:bg-foreground hover:text-background transition-colors disabled:opacity-50"
//                     >
//                         {isSendingOTP ? "Sending..." : otpSent ? "Resend OTP" : "Get OTP"}
//                     </button>
//                 </div>
//                 {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
//                 {otpError && <p className="text-red-500 text-sm mt-1">{otpError}</p>}
//                 {otpSent && <p className="text-green-500 text-sm mt-1">OTP sent successfully!</p>}
//             </Field>

//             <div className="border border-foreground p-5 md:p-6">
//                 <p className="label">Once you're verified</p>
//                 <p className="mt-3 text-sm text-muted-foreground headline">
//                     All Festival programming becomes complimentary for SEA delegates. You'll still need to reserve individual programmes so we can hold your seat.
//                 </p>
//             </div>
//         </>
//     );
// };

// // Guest Form Component
// const GuestForm = ({ register, formState: { errors }, watch, setValue }: any) => {
//     const GUEST_DATES = ["13 December", "14 December", "15 December", "16 December", "17 December", "18 December", "19 December", "20 December"];
//     const GUEST_NOTES = [
//         "VIP Pass does not guarantee entry to the VIP Lounge. Access is subject to availability and operates on a first-come, first-served basis.",
//         "VIP Pass is non-transferable.",
//         "Each invitee may bring one accompanying guest only.",
//         "Post-registration, guests are required to book individual programmes. Attendance is subject to prior reservation of specific events.",
//         "Guests are requested to arrive 15–20 minutes prior to the start of each programme to ensure smooth entry.",
//         "For special assistance (e.g. wheelchair or mobility support), guests must inform us in advance. Support is not subject to availability — it is priority assistance extended to those who need it, which must be informed prior.",
//         "Seating for programmes is limited and subject to availability.",
//         "Your Art Pass will be available on our app closer to the festival.",
//         "Show your pass at any venue in front of our zappers to enter.",
//     ];

//     return (
//         <>
//             <Field label="Email ID*">
//                 <input type="email" {...register("email")} className="input" required />
//                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
//             </Field>

//             <Field label="Full Name*">
//                 <input {...register("fullName")} className="input" required />
//                 {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
//             </Field>

//             <Field label="Contact Number*">
//                 <div className="grid grid-cols-[140px_1fr] gap-3">
//                     <select {...register("std_code")} className="input" required>
//                         <option value="91">India (+91)</option>
//                         <option value="1">USA (+1)</option>
//                         <option value="44">UK (+44)</option>
//                     </select>
//                     <input
//                         required
//                         inputMode="numeric"
//                         maxLength={12}
//                         placeholder="Phone number"
//                         className="input"
//                         {...register("contact")}
//                     />
//                 </div>
//                 {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
//             </Field>

//             <Field label="Dates Attending*">
//                 <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
//                     {GUEST_DATES.map((d) => (
//                         <label key={d} className="flex items-center gap-2 text-sm">
//                             <input

//                                 type="checkbox"
//                                 value={d}
//                                 {...register("dates")}
//                                 className="accent-accent"
//                             />
//                             {d}
//                         </label>
//                     ))}
//                     <label className="flex items-center gap-2 text-sm">
//                         <input
//                             type="checkbox"
//                             value="All of the above"
//                             onChange={(e) => {
//                                 if (e.target.checked) {
//                                     setValue("dates", GUEST_DATES);
//                                 } else {
//                                     setValue("dates", []);
//                                 }
//                             }}
//                             className="accent-accent"
//                         />
//                         All of the above
//                     </label>
//                 </div>
//                 {errors.dates && <p className="text-red-500 text-sm mt-1">{errors.dates.message}</p>}
//             </Field>

//             <YesNo label="Travel Assistance Required*" name="travel" register={register} />
//             <YesNo label="Lodging/Boarding Assistance Required*" name="lodging" register={register} />
//             <YesNo label="Accommodation Assistance Required*" name="accom" register={register} />
//             <YesNo label="Will you be accompanied by anyone?*" name="accompanied" register={register} />

//             <Field label="If yes, please specify names of accompanying persons">
//                 <input
//                     className="input"
//                     {...register("accompaniedPersons")}
//                     placeholder="Names of accompanying persons"
//                 />
//             </Field>

//             <Field label="Additional Requests or Preferences">
//                 <textarea rows={3} className="input" {...register("additionalRequests")} />
//             </Field>

//             <div className="border border-foreground p-5 md:p-6">
//                 <p className="label">A few quick notes for a smooth experience</p>
//                 <ul className="mt-3 space-y-2 text-sm text-muted-foreground headline list-disc pl-5">
//                     {GUEST_NOTES.map((n) => <li key={n}>{n}</li>)}
//                 </ul>
//                 <p className="mt-4 text-sm headline">
//                     For any queries, kindly reach out to us at{" "}
//                     <a href="mailto:rsvp@serendipityarts.org" className="underline underline-offset-4">rsvp@serendipityarts.org</a>
//                 </p>
//             </div>
//         </>
//     );
// };

// // Main Component
// export default function RegisterPage() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const next = searchParams.get("next") || "";
//     const initialMode = (searchParams.get("mode") as "general" | "guest" | "sea") || "general";

//     const [mode, setMode] = useState<"general" | "guest" | "sea">(initialMode);
//     const [submitted, setSubmitted] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
//     const [registeredEmail, setRegisteredEmail] = useState("");

//     // Choose the appropriate schema based on mode
//     const getSchema = () => {
//         switch (mode) {
//             case "general":
//                 return generalSchema;
//             case "sea":
//                 return seaSchema;
//             case "guest":
//                 return guestSchema;
//             default:
//                 return generalSchema;
//         }
//     };

//     const {
//         register,
//         handleSubmit,
//         watch,
//         setValue,
//         reset,
//         formState: { errors },
//     } = useForm<any>({
//         resolver: zodResolver(getSchema()),
//         defaultValues: {
//             std_code: "91",
//             terms: false,
//             newsletter: false,
//             dates: [],
//             interests: [],
//             visitedYears: [],
//         },
//     });

//     const isGuest = mode === "guest";
//     const isSea = mode === "sea";

//     const handleModeChange = (newMode: "general" | "guest" | "sea") => {
//         setMode(newMode);
//         setError(null);
//         const params = new URLSearchParams(searchParams.toString());
//         params.set("mode", newMode);
//         router.replace(`/register?${params.toString()}`, { scroll: false });
//     };

//     const onSubmit = async (data: any) => {
//         setIsLoading(true);
//         setError(null);

//         try {
//             let response;

//             if (isSea) {
//                 // Transform SEA data
//                 const seaData = {
//                     role_id: ROLE_IDS.sea,
//                     name: data.fullName,
//                     email: data.email,
//                     gender: data.gender || "Prefer Not To Say",
//                     country_id: parseInt(data.country),
//                     state_id: parseInt(data.state),
//                     city_id: parseInt(data.city),
//                     std_code: data.std_code || "91",
//                     contact: data.whatsapp,
//                     otp: data.otp,
//                     referrer: "web",
//                     interest: ["SEA Delegate"],
//                     hearabout: "Website",
//                     subscribe: data.newsletter ? 1 : 0,
//                     terms: data.terms,
//                 };
//                 response = await registerSEA(seaData);
//             } else if (isGuest) {
//                 // Transform Guest/VIP data
//                 const guestData = {
//                     role_id: ROLE_IDS.guest,
//                     name: data.fullName,
//                     email: data.email,
//                     contact: data.contact,
//                     std_code: data.std_code || "91",
//                     dates: data.dates || [],
//                     travel: data.travel || "No",
//                     boarding: data.lodging || "No",
//                     accompanied_anyone: data.accompanied || "No",
//                     accompanied_persons: data.accompaniedPersons || "",
//                     additional_requests: data.additionalRequests || "",
//                     accomodation_assistance_required: data.accom || "No",
//                     is_old_user: false,
//                 };
//                 response = await registerVIP(guestData);
//             } else {
//                 // Transform General data
//                 const generalData = {
//                     role_id: ROLE_IDS.general,
//                     name: data.fullName,
//                     email: data.email,
//                     gender: data.gender || "Prefer Not To Say",
//                     country_id: parseInt(data.country) || 0,
//                     state_id: parseInt(data.state) || 0,
//                     city_id: parseInt(data.city) || 0,
//                     std_code: data.std_code || "91",
//                     contact: data.whatsapp || "",
//                     otp: data.otp || "",
//                     referrer: "web",
//                     interest: data.interests || [],
//                     hearabout: data.heard || "Other",
//                     subscribe: data.newsletter ? 1 : 0,
//                     age_group: data.age || "",
//                     visited: data.visitedYears?.length ? "Yes" : "No",
//                     visited_year: data.visitedYears || [],
//                     custom_city: "",
//                     is_old_user: 0,
//                     terms: data.terms,
//                 };
//                 console.log("Form Data:", data);
//                 console.log("Age:", data.age);
//                 response = await registerUser(generalData);
//             }

//             console.log(response.data);

//             // Check if response and response.data exist
//             if (response && response.data) {
//                 // Check for success in response
//                 const isSuccess = response.data.status === true || response.data.success === true;

//                 if (isSuccess) {
//                     setRegisteredEmail(data.email);

//                     // Clear the form
//                     reset({
//                         std_code: "91",
//                         terms: false,
//                         newsletter: false,
//                         dates: [],
//                         interests: [],
//                         visitedYears: [],
//                     });

//                     if (next) {
//                         router.push(next);
//                     } else {
//                         setSubmitted(true);
//                     }
//                 } else {
//                     // Handle error message - ensure it's a string
//                     const errorMessage = typeof response.data.message === 'string'
//                         ? response.data.message
//                         : "Registration failed";
//                     setError(errorMessage);
//                 }
//             } else {
//                 setError("Registration failed: Invalid response");
//             }
//         } catch (err) {
//             if (err instanceof AxiosError) {
//                 const errorMessage = typeof err.response?.data?.message === 'string'
//                     ? err.response.data.message
//                     : "Registration failed. Please try again.";
//                 setError(errorMessage);
//                 // Handle validation errors
//                 if (err.response) {
//                     console.log("Status:", err.response.status);
//                     console.log("Response:", err.response.data);

//                     if (err.response.data.errors) {
//                         console.table(err.response.data.errors);
//                     }
//                 }
//             } else {
//                 setError("An unexpected error occurred");
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (submitted) {
//         return (
//             <div className="container-editorial pt-16 md:pt-24 pb-40">
//                 <h1 className="display uppercase text-[14vw] md:text-[10vw] leading-[0.9]">You're in.</h1>
//                 <p className="mt-8 max-w-xl text-muted-foreground">
//                     A confirmation has been sent to{" "}
//                     <span className="font-semibold text-foreground">
//                         {registeredEmail}
//                     </span>.
//                 </p>
//                 <div className="mt-8 max-w-xl border border-foreground p-6 md:p-8">
//                     <p className="label text-accent">
//                         {isSea ? "Your SEA Delegate Pass" : isGuest ? "Your Special Guest Pass" : "Your Art Pass"}
//                     </p>
//                     <p className="mt-3 display uppercase text-2xl md:text-3xl leading-[1] tracking-[-0.02em]">
//                         Available on our app, closer to the festival.
//                     </p>
//                     <p className="mt-4 text-sm text-muted-foreground headline">
//                         {isGuest
//                             ? "We can't wait to see you in Panjim, Goa, 13–20 December."
//                             : "Each time you book a programme, it will be added to your single Art Pass, just show it at any venue in front of our zappers."}
//                     </p>
//                 </div>
//                 <Link href="/programmes" className="mt-10 inline-block label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors">
//                     Browse programmes →
//                 </Link>
//             </div>
//         );
//     }

//     return (
//         <div className="container-editorial pt-10 md:pt-16 pb-32">
//             {/* Film banner */}
//             <div className="relative overflow-hidden bg-black text-white aspect-[16/7] md:aspect-[16/5] w-full">
//                 <video src="/saf-aftermovie.mp4" autoPlay muted loop playsInline preload="auto"
//                     className="absolute inset-0 h-full w-full object-cover" />
//                 <div className="absolute inset-0 bg-black/45" aria-hidden />
//                 <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
//                     <h1 className="display uppercase text-white text-[9vw] md:text-[5.5vw] leading-[0.9] tracking-[-0.03em] text-center max-w-[16ch]">
//                         {isSea ? "SEA Registration" : isGuest ? "Special Guest Registration" : "General Visitor Registration"}
//                     </h1>
//                 </div>
//             </div>

//             {/* Mode tabs */}
//             <div className="mt-8 flex flex-wrap gap-2">
//                 {(["general", "guest", "sea"] as const).map((m) => (
//                     <button
//                         key={m}
//                         onClick={() => handleModeChange(m)}
//                         className={`headline uppercase tracking-[0.06em] text-xs md:text-sm border-2 px-4 py-2 transition-colors ${mode === m
//                             ? "bg-foreground text-background border-foreground"
//                             : "border-foreground hover:bg-foreground hover:text-background"
//                             }`}
//                     >
//                         {m === "general" ? "General Visitor" : m === "guest" ? "Special Guest" : "SEA Delegate"}
//                     </button>
//                 ))}
//             </div>

//             <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-12">
//                 {/* Left column — copy */}
//                 <aside className="md:col-span-4">
//                     {isSea ? (
//                         <>
//                             <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
//                                 Serendipity Exchange for the Arts.
//                             </p>
//                             <p className="mt-5 text-sm text-muted-foreground headline max-w-sm">
//                                 SEA is a delegate program running parallel to the Serendipity Arts Festival 2026 — a platform for artists, companies, curators, producers and arts managers to present their work, exchange ideas and foster future collaborations.
//                             </p>
//                             <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
//                                 Once your delegate registration is complete, all programming becomes complimentary for you.
//                             </p>
//                             <Link href="/sea" className="mt-6 inline-block label border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-colors">
//                                 About SEA →
//                             </Link>
//                         </>
//                     ) : isGuest ? (
//                         <>
//                             <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
//                                 A curated welcome, on the house.
//                             </p>
//                             <p className="mt-5 text-sm text-muted-foreground headline max-w-sm">
//                                 We welcome you to the exclusive VIP experience at the Serendipity Arts Festival 2026. As a valued and distinguished guest, we are dedicated to ensuring that your visit is exceptional in every way.
//                             </p>
//                             <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
//                                 Serendipity Arts Festival's VIP programme offers our esteemed guests access to onsite VIP lounges, exclusive culinary experiences and a bespoke itinerary tailored to your preferences.
//                             </p>
//                             <p className="mt-4 text-sm text-muted-foreground headline max-w-sm">
//                                 Please complete the form below, and our VIP management team will be in touch soon with a curated itinerary for your festival experience.
//                             </p>
//                         </>
//                     ) : (
//                         <>
//                             <p className="display uppercase text-2xl md:text-4xl leading-[0.95] tracking-[-0.02em]">
//                                 Your Art Pass, free.
//                             </p>
//                             <p className="mt-5 text-sm text-muted-foreground max-w-sm">
//                                 Registration is free and open to all. The Art Pass will be available to download closer to the festival on our app.
//                             </p>
//                             <p className="mt-4 text-sm text-muted-foreground max-w-sm">
//                                 Select programmes with limited seating are ticketed — you'll be able to book them once you're registered. Each booking gets added to the same Art Pass.
//                             </p>
//                         </>
//                     )}
//                     <p className="mt-8 label">
//                         Already have an account?{" "}
//                         <Link
//                             href="/login"
//                             className="text-foreground underline underline-offset-4 hover:text-accent"
//                         >
//                             Login here
//                         </Link>
//                     </p>
//                 </aside>

//                 {/* Form */}
//                 <form className="md:col-span-8 space-y-10" onSubmit={handleSubmit(onSubmit)}>
//                     {mode === "general" && <GeneralForm register={register} formState={{ errors }} watch={watch} setValue={setValue} />}
//                     {mode === "sea" && <SeaForm register={register} formState={{ errors }} watch={watch} setValue={setValue} />}
//                     {mode === "guest" && <GuestForm register={register} formState={{ errors }} watch={watch} setValue={setValue} />}

//                     {error && (
//                         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//                             {error}
//                         </div>
//                     )}

//                     <div className="space-y-3 pt-4">
//                         <label className="flex items-start gap-3 text-sm">
//                             <input type="checkbox" {...register("terms")} className="mt-1 accent-accent" />
//                             I accept and agree to all the <Link href="/terms" className="underline underline-offset-4 hover:text-accent">Terms and Conditions</Link>
//                         </label>
//                         {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}

//                         <label className="flex items-start gap-3 text-sm">
//                             <input type="checkbox" {...register("newsletter")} className="mt-1 accent-accent" />
//                             Stay updated on this year's programming and secure tickets before they sell out.
//                         </label>
//                     </div>

//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="headline font-semibold uppercase text-lg md:text-xl bg-foreground text-background rounded-full px-8 py-4 hover:bg-accent transition-colors disabled:opacity-50"
//                     >
//                         {isLoading ? "Submitting..." : isGuest || isSea ? "Complete Registration →" : "Submit form →"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// }

// // Helper components
// function Field({ label, children }: { label: string; children: React.ReactNode }) {
//     return (
//         <div>
//             <p className="label text-muted-foreground">{label}</p>
//             <div className="mt-2">{children}</div>
//         </div>
//     );
// }

// function YesNo({ label, name, register }: { label: string; name: string; register: any }) {
//     return (
//         <Field label={label}>
//             <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
//                 {["Yes", "No"].map((v) => (
//                     <label key={v} className="flex items-center gap-2 text-sm">
//                         <input type="radio" value={v} {...register(name)} className="accent-accent" />
//                         {v}
//                     </label>
//                 ))}
//             </div>
//         </Field>
//     );
// }