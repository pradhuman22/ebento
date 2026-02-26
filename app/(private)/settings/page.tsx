import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileUpdateForm from "./_components/profile-update-form";
import UpdateContactForm from "./_components/update-contact-form";
import { Separator } from "@/components/ui/separator";
import ChangePasswordForm from "./_components/change-password-form";
import DeleteAccount from "./_components/delete-account";
import SessionManagement from "./_components/session-management";

const SettingsPage = async () => {
  const headerList = await headers();
  const data = await auth.api.getSession({
    headers: headerList,
  });
  if (!data?.session) redirect("/login");
  const sessionsList = await auth.api.listSessions({
    headers: headerList,
  });
  const currentSession = sessionsList.find(
    (session) => session.token == data.session.token
  );
  return (
    <div className="mx-auto w-full max-w-4xl px-4">
      <div className="grid gap-8 py-8">
        <div>
          <h1 className="text-xl font-medium">Your Profile</h1>
          <p className="text-muted-foreground text-sm">
            Choose how you want to be displayed.
          </p>
        </div>
        <ProfileUpdateForm user={data?.user} />
        <Separator />
        <div>
          <h1 className="text-xl font-medium">Phone number</h1>
          <p className="text-muted-foreground text-sm">
            Manage the phone number you use to sign in to meetz and receive sms
            updates.
          </p>
        </div>
        <UpdateContactForm contact={data?.user?.contact} />
        <Separator />
        <div>
          <h1 className="text-xl font-medium">Password & Security</h1>
          <p className="text-muted-foreground text-sm">
            Secure your account with password and two-factor authentication.
          </p>
        </div>
        <ChangePasswordForm />
        <Separator />
        <div>
          <h1 className="text-xl font-medium">Active Device</h1>
          <p className="text-muted-foreground text-sm">
            See the list of devices you are currently signed into meetz from.
          </p>
        </div>
        <SessionManagement session={currentSession} />
        <Separator />
        <div>
          <h1 className="text-xl font-medium">Delete Account</h1>
          <p className="text-muted-foreground text-sm">
            If you no longer wish to use meetz, you can permanently delete your
            account.
          </p>
        </div>
        <DeleteAccount />
      </div>
    </div>
  );
};

export default SettingsPage;
