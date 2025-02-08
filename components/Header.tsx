import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <header className="w-full bg-white/80 backdrop-blur-xl border-b border-olive/10 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl md:text-3xl font-bold text-olive">
            Chef Mind
          </span>
          <Badge variant="secondary" className="bg-sage/10 text-sage">
            Beta
          </Badge>
        </Link>

        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-olive hover:bg-olive/5">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                variant="default"
                className="bg-terracotta hover:bg-terracotta/90"
              >
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
