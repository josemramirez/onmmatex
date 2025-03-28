"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { adminSidebarLinks, userSidebarLinks } from "@/config/menu-config";

type MobileSideBarProps = {
  isAdminMode?: boolean;
};

const MobileSidebar = ({ isAdminMode }: MobileSideBarProps) => {
  const pathName = usePathname();
  const links = isAdminMode ? adminSidebarLinks : userSidebarLinks;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          {links.map(({ label, icon, url }, i) => {
            const Icon = icon;
            return (
              <Link
                key={i}
                href={url}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathName === url ? "bg-muted" : null
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
