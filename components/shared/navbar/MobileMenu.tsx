import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import NavList from "./Nav";
import { UserAvatar } from "@clerk/nextjs";
import AuthButtons from "../AuthButtons";

export function MobileMenu({
  isAuthenticated,
  userEmail,
}: {
  isAuthenticated: boolean;
  userEmail?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon className="cursor-pointer" />
      </SheetTrigger>

      <SheetContent dir="rtl" side="right">
        <SheetHeader>
          <SheetTitle className="border-b pb-4">
            <span className="text-2xl lg:text-3xl font-extrabold text-gray-600">
              Nano Image
            </span>
          </SheetTitle>

          <div className="h-[89dvh] flex flex-col justify-between">
            <NavList isDesktop={false} />

            {/* Auth */}
            <div className="w-full flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center border p-2 gap-2">
                    <UserAvatar />
                    <span>{userEmail}</span>
                  </div>

                  <AuthButtons isAuthenticated={true} mobile />
                </>
              ) : (
                <AuthButtons isAuthenticated={false} mobile />
              )}
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
