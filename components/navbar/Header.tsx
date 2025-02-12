import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import UserNav from "./UserNav";
import { auth } from "@/app/auth";

export default async function Header() {
  const session = await auth();

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
          <UserNav session={session} />
        </div>
      </div>
    </header>
  );
}
