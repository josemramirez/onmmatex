import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import Logo from "@/components/blocks/Logo";
import SignInWithGithub from "@/components/auth/SignInWithGithub";
import SignInWithMagicLink from "@/components/auth/SignInWithMagicLink";

const LoginForm = async () => {
  return (
    <div className="themes-wrapper bg-background w-ful h-screen flex flex-col items-center justify-center px-4">
      <div className="flex justify-center mb-8">
        <Logo />
      </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <SignInWithMagicLink />

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <SignInWithGithub />
          </div>

          <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
