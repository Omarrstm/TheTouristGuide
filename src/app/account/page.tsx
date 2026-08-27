import { getUser } from "@/lib/dal";
import AccountProfileForm from "@/components/AccountProfileForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import DeleteAccountButton from "@/components/DeleteAccountButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getUser();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 pt-8 pb-20">
      <div className="fade-slide-up">
        <p className="font-display text-[13px] tracking-[0.12em] text-accent uppercase">
          Account
        </p>
        <h1 className="font-display text-[32px] leading-none tracking-wide text-text uppercase">
          Settings
        </h1>
        <p className="mt-2 text-[13.5px] text-muted">{user.email}</p>
      </div>

      <div className="card-shine fade-slide-up delay-1 flex flex-col gap-4 rounded-2xl p-6">
        <h2 className="text-[13px] font-bold tracking-wide text-text uppercase">Profile</h2>
        <AccountProfileForm initialName={user.name ?? ""} initialHomeCountry={user.homeCountry ?? ""} />
      </div>

      <div className="card-shine fade-slide-up delay-2 flex flex-col gap-4 rounded-2xl p-6">
        <h2 className="text-[13px] font-bold tracking-wide text-text uppercase">Password</h2>
        <ChangePasswordForm />
      </div>

      <div className="fade-slide-up delay-3 flex flex-col gap-4 rounded-2xl border border-red-600/30 p-6">
        <h2 className="text-[13px] font-bold tracking-wide text-red-600 uppercase">Danger Zone</h2>
        <DeleteAccountButton />
      </div>
    </main>
  );
}
