"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconCubeSpark, IconLoader2, IconLogout } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mainMenus, userMenus } from "@/constant";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const Header = () => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { data, isPending } = authClient.useSession();
  const handleSignOut = () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("You’ve logged out. See you soon!");
            router.push("/signin");
            router.refresh();
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
        },
      });
    });
  };
  return (
    <header className="bg-background sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
        {/* logo section */}
        <Link href={"/"}>
          <IconCubeSpark className="-mt-0.5 size-5 md:size-6" />
          <span className="sr-only">ebnto</span>
        </Link>
        <nav className="flex w-full max-w-[calc(50vw+410px)] items-center justify-between">
          {/* right section */}
          <div>
            {!isPending && data?.session && (
              <div className="flex items-center gap-3 md:gap-6">
                {mainMenus.map((menu, idx) => (
                  <Link
                    href={menu.url}
                    key={idx}
                    className="flex items-center gap-1"
                  >
                    <menu.Icon className="size-6 md:size-4" />
                    <span className="sr-only md:not-sr-only">{menu.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* left section */}
          <div className="flex items-center">
            {isPending ? (
              <>
                <IconLoader2 className="animate-spin" />
                <span>loading..</span>
              </>
            ) : data?.session ? (
              <>
                <Link href={"/create"} className="mr-6 flex items-center">
                  Create Event
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                    <Avatar>
                      {data?.user.image ? (
                        <AvatarImage
                          src={data?.user.image}
                          alt={data?.user.name}
                        />
                      ) : (
                        <AvatarFallback>
                          {data?.user.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel className="py-4">
                      <h2 className="text-foreground">{data?.user.name}</h2>
                      <p>{data?.user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userMenus.map((menu, idx) => (
                      <DropdownMenuItem
                        asChild
                        key={idx}
                        className="cursor-pointer"
                      >
                        <Link href={menu.url}>
                          <menu.Icon />
                          <span>{menu.title}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    {userMenus.length > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={handleSignOut}
                      disabled={pending}
                    >
                      <IconLogout />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link
                  href={"/discover"}
                  className="mr-6 flex items-center font-medium"
                >
                  Explore Events
                </Link>
                <Button
                  asChild
                  className="bg-secondary text-secondary-foreground hover:bg-foreground hover:text-background border-0 text-base font-medium"
                >
                  <Link href={"/signin"}>Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
