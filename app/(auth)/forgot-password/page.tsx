import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import ForgotPasswordForm from "../_components/forgot-password-form";

const ForgotPasswordPage = () => {
  return (
    <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-16 md:px-6">
      <Card className="w-full md:max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Forgot Password</CardTitle>
          <CardDescription className="text-sm">
            Enter your email to receive reset password email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter className="grid gap-3 border-none">
          <div className="w-full text-center text-sm">
            Remember Password ?{" "}
            <Link href={"/signin"} className="hover:underline">
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
