"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const Page = () => {

  const loggedOut = () => {
    signOut(auth);
  };
  
  return (
    <ProtectedRoute>
      <div>
        <Button onClick={() => loggedOut()}>Sign out</Button>
      </div>
    </ProtectedRoute>
  );
}

export default Page
