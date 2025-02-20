"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { logout } from "@/actions";
import { Session } from "next-auth";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const UserNav = ({ session }: { session: Session | null }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session !== undefined) {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-24" /> {/* For Profile button */}
        <Skeleton className="h-10 w-24" /> {/* For Public button */}
        <Skeleton className="h-12 w-12 rounded-full" /> {/* For avatar */}
      </div>
    );
  }

  const user = session?.user;

  const NavContent = () => (
    <>
      {session ? (
        <>
          <Button className="text-olive bg-olive/10 text-sm md:text-xl rounded-sm hover:bg-olive/20 transition-colors duration-200 w-full md:w-auto">
            <Link href="/profile">Profile</Link>
          </Button>

          <Button className="text-olive bg-olive/10 text-sm md:text-xl rounded-sm hover:bg-olive/20 transition-colors duration-200 w-full md:w-auto">
            <Link href="/public">Public</Link>
          </Button>

          <Button
            className="text-sm md:text-xl w-full md:w-auto"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button className="text-olive bg-olive/10 text-sm md:text-xl rounded-sm hover:bg-olive/20 transition-colors duration-200 w-full md:w-auto">
            <Link href="/public">Public</Link>
          </Button>
          <Button className="bg-terracotta text-white rounded-sm hover:bg-terracotta/90 text-sm md:text-xl w-full md:w-auto">
            <Link href="/auth_page">Get Started</Link>
          </Button>
        </>
      )}
    </>
  );

  return (
    <div className="flex items-center gap-2">
      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            title="Navigation Menu"
            side="right"
            className="w-[240px] sm:w-[300px]"
          >
            <div className="flex flex-col gap-4 mt-4">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-2">
        <NavContent />
      </div>

      {/* User Avatar - shown on both mobile and desktop */}
      {session && (
        <Image
          src={user?.image || ""}
          alt="User Avatar"
          width={50}
          height={50}
          className="rounded-full"
        />
      )}
    </div>
  );
};

export default UserNav;
