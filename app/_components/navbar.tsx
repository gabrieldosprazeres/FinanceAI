"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Button } from "./ui/button";
import { menuItems } from "../_constants/navbar";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="border-b border-solid py-2">
      <div className="mx-auto flex flex-row items-center justify-between p-4 sm:gap-10">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Finance AI" width={200} height={40} />
        </Link>

        <div className="hidden items-center space-x-4 max-sm:flex">
          <UserButton />

          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="sm"
                className="group inline-flex items-center justify-center rounded bg-primary-foreground hover:bg-primary-foreground md:hidden"
              >
                <Image
                  src="/hamburger.svg"
                  alt="Hamburger Menu"
                  width={28}
                  height={28}
                />
              </Button>
            </SheetTrigger>

            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-bold uppercase text-foreground">
                  menu
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col space-y-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.label !== "Assinatura" ? item.href : "#"}
                    className={`text-lg ${
                      pathname === item.href
                        ? "font-bold text-primary"
                        : "text-muted-foreground"
                    } ${item.label === "Assinatura" ? "opacity-25" : ""}`}
                  >
                    {item.label === "Assinatura"
                      ? `${item.label} (Em breve)`
                      : item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden w-full justify-between sm:flex">
          <ul className="flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  key={item.href}
                  href={item.label !== "Assinatura" ? item.href : "#"}
                  className={`text-lg ${
                    pathname === item.href
                      ? "font-bold text-primary"
                      : "text-muted-foreground"
                  } ${item.label === "Assinatura" ? "opacity-25" : ""}`}
                >
                  {item.label === "Assinatura"
                    ? `${item.label} (Em breve)`
                    : item.label}
                </Link>
              </li>
            ))}
          </ul>

          <UserButton showName />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
