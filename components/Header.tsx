import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="w-full rounded-lg mx-auto bg-white/90 backdrop-blur-xl sm:px-9 border-b shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="no-underline hover:bg-gray-100 rounded-md p-2 transition-colors"
          >
            <span className="text-base xs:text-2xl sm:text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600">
              Chef Mind
            </span>
          </Link>
          <Badge variant="secondary" className="text-xs">
            Beta
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* When user is signed out */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="default" size="lg">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>

          {/* When user is Signed in */}
          <SignedIn>
            <UserButton />
            <Link href="/profile">
              <Button variant="outline" size="lg">
                Profile
              </Button>
            </Link>
          </SignedIn>
          <Button variant="outline" size="lg">
            <Link
              href="https://github.com/Sajjadalgburi/Chef_Mind_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 h-[30px] sm:h-[40px] text-xs sm:text-sm"
            >
              <FaGithub className="h-4 w-4" />
              GitHub Repo
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
