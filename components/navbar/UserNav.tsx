"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "@/lib/actions";
import { Session } from "next-auth";
import Image from "next/image";

const UserNav = ({ session }: { session: Session | null }) => {
  const user = session?.user;

  return (
    <>
      {session ? (
        <div className="flex items-center gap-2">
          <Button
            asChild
            className="text-olive bg-olive/10 text-sm md:text-xl rounded-sm hover:bg-olive/20 transition-colors duration-200"
          >
            <Link href="/profile">Profile</Link>
          </Button>

          <Button className="text-sm md:text-xl" onClick={() => logout()}>
            Logout
          </Button>
          <Image
            src={user?.image || ""}
            alt="User Avatar"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button className="bg-terracotta text-white rounded-sm hover:bg-terracotta/90 text-sm md:text-xl">
            <Link href="/auth_page">Get Started</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default UserNav;
