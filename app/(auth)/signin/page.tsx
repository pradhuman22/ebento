import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import SocialLoginButton from "../_components/social-login-button";
import SignInForm from "../_components/signin-form";

const SignInPage = () => {
  return (
    <div className="mx-auto flex max-w-4xl items-center justify-center px-4 py-16 md:px-6">
      <Card className="w-full md:max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-medium">Welcome back!</CardTitle>
          <CardDescription className="text-sm">
            Please sign in or sign up below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter className="grid gap-3 border-none">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>
          {/* social login buttons */}
          <SocialLoginButton />
          <div className="w-full text-center text-sm">
            Don't have an account yet ?{" "}
            <Link href={"/signup"} className="hover:underline">
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
