import ProfileEditForm from "@/components/profile/ProfileEditForm";

export default function ProfilePage() {
  return (
    <main className="container-editorial pt-16 md:pt-24 pb-32">
      <div className="max-w-3xl">
        <p className="label text-muted-foreground">Account</p>

        <h1 className="mt-2 display uppercase text-[12vw] md:text-[7vw] leading-[0.9]">
          Edit Profile
        </h1>

        <p className="mt-6 max-w-2xl headline text-muted-foreground">
          Update your personal information and festival preferences.
        </p>

        <div className="mt-12">
          <ProfileEditForm />
        </div>
      </div>
    </main>
  );
}
