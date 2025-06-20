"use client";

import { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { googleProvider } from "@/firebase/client";
import { Button } from "@/components/ui/button";

export default function PrivatePage() {
  const provider = googleProvider();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.replace("/auth/login");
      } else {
        setUser(user);
        user.getIdTokenResult().then((idTokenResult) => {
          const role = idTokenResult.claims.role;
          console.log(role);
          user.role = role;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return null;
  }

  function handleSignout() {
    const provider = googleProvider();
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        router.push("/auth/login");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-xl font-bold bg-muted">
      <p className="mx-4">
        Hello {user.displayName}, Email: {user.email}. Your UserId: {user.uid},
        Role {user.role}
      </p>
      <Button onClick={handleSignout}>Signout</Button>
    </div>
  );
}
