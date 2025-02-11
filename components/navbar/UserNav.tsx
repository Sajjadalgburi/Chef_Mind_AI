"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "@/hooks";
import { Loader2 } from "lucide-react";
import { signOutAction } from "@/actions/actions";
import { useEffect, useState } from "react";

const UserNav = () => {
  const { user, loading } = useUser();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    setIsPageLoading(false);
  }, []);

  return isPageLoading ? (
    <div className="flex items-center justify-center h-full gap-2">
      <Loader2 className="md:w-12 md:h-12 w-8 h-8 text-olive animate-spin" />
    </div>
  ) : (
    <>
      {user !== null ? (
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
              <Button
                asChild
                className="text-olive bg-olive/10 text-sm md:text-xl rounded-sm hover:bg-olive/20 transition-colors duration-200"
              >
                <Link href="/profile">Profile</Link>
              </Button>

              <Button className="text-sm md:text-xl" onClick={signOutAction}>
                Logout
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            asChild
            className="text-olive rounded-sm bg-olive/10 hover:bg-olive/20 text-sm md:text-xl"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>

          <Button
            asChild
            className="bg-terracotta text-white rounded-sm hover:bg-terracotta/90 text-sm md:text-xl"
          >
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default UserNav;
