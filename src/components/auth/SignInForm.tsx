import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="grid place-content-center">
      <Card className="flex flex-col gap-4">
        <CardHeader>
          <CardDescription>Log in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              formData.set("flow", flow);
              void signIn("password", formData).catch((error) => {
                setError(error.message);
              });
            }}
          >
            <Input type="email" name="email" placeholder="Email" />
            <Input type="password" name="password" placeholder="Password" />
            <Button type="submit" variant="secondary">
              {flow === "signIn" ? "Sign in" : "Sign up"}
            </Button>
            <div className="flex flex-row gap-2">
              <span>
                {flow === "signIn"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </span>
              <span
                className="text-dark dark:text-light underline hover:no-underline cursor-pointer"
                onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              >
                {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
              </span>
            </div>
            {error && (
              <Badge variant="destructive" className="p-2 text-xs font-mono">
                Error signing in: {error}
              </Badge>
            )}
          </form>
          <div className="flex items-center justify-center my-3">
            <hr className="my-4 grow" />
            <span className="mx-4 text-muted-foreground">or</span>
            <hr className="my-4 grow" />
          </div>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => void signIn("anonymous")}
          >
            Sign in anonymously
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
