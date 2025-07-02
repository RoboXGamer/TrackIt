import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Button } from "../ui/button";
import { useProject } from "@/components/providers/ProjectProvider";

export default function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const { setSelectedProjectId } = useProject();

  const handleSignOut = async () => {
    await signOut();
    setSelectedProjectId(null);
  };

  return (
    <>
      {isAuthenticated && (
        <Button variant="secondary" onClick={handleSignOut}>
          Sign out
        </Button>
      )}
    </>
  );
}
