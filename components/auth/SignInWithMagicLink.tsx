import { onSignInWithLink } from "@/actions/auth-actions";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const SignInWithMagicLink = () => {
  return (
    <form action={onSignInWithLink}>
      <div className="grid gap-2 mb-4">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Sign In with Email
      </Button>
    </form>
  );
};

export default SignInWithMagicLink;
