import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
  const { signIn, isLoaded } = useSignIn();
  if (!isLoaded) {
    return null;
  }

  const signInWithGoogle = async () => {
    signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/auth-callback",
    });
  };
  return (
    <Button
      className="w-full text-white border-zinc-700 h-11 bg-slate-600"
      onClick={signInWithGoogle}
      variant={"secondary"}
    >
      Continue with Google
    </Button>
  );
};

export default SignInOAuthButtons;
