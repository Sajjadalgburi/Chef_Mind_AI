"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/hooks";
import { Loader2 } from "lucide-react";

const UserNav = () => {
  const { user, loading } = useUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="text-olive hover:bg-olive/5">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button
          variant="default"
          className="bg-terracotta hover:bg-terracotta/90"
        >
          <Link href="/sign-up">Get Started</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <div>
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {/* <Image
            src={user.imageUrl}
            alt={user.username}
            width={32}
            height={32}
          /> */}
          <Link href="/profile">Profile</Link>
        </div>
      )}
    </div>
  );
};

export default UserNav;
