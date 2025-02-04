import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full rounded-lg mx-auto bg-white/90 backdrop-blur-xl px-9 border-b shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Link
            href="/"
            className="no-underline hover:bg-gray-100 rounded-md p-2 transition-colors"
          >
            <span className="text-xl xs:text-2xl sm:text-2xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-600">
              Snap Cook
            </span>
          </Link>
          <Badge variant="secondary" className="text-xs">
            Beta
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-xs sm:text-sm font-bolder flex items-center rounded-md p-3 bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <Github className="h-4 w-4" />
          GitHub Repo
        </Button>
      </div>
    </header>
  );
}
