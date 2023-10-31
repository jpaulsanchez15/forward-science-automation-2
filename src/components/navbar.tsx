import Link from "next/link";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "./themeToggle";

export const Navbar = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  return (
    <nav
      className={cn(
        "mx-auto mb-6 mt-6 flex items-center justify-center space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Home
      </Link>
      <Link
        href="/faq"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        FAQ
      </Link>
      {/* TODO: Change back to Link once it is fixed */}
      <div
        // href="/shopify"
        className="text-sm font-medium text-muted-foreground line-through transition-colors hover:cursor-not-allowed hover:text-primary"
      >
        Shopify
      </div>
      <Link
        href="/aspen"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Aspen
      </Link>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
};
