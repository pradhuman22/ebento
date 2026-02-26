import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-6">
      <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:py-16">
        {/* content section */}
        <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
          <h1 className="text-2xl font-bold md:text-6xl md:leading-tight">
            Find Best Events Here !
          </h1>
          <p className="text-muted-foreground mb-4 md:mb-6 md:text-xl md:leading-normal">
            Seamlessly create events, send invitations, and manage ticket
            bookings—all in one place. Simplifying every aspect of event
            hosting.
          </p>
          <Button asChild>
            <Link href={"/create"}>Create Your First Event</Link>
          </Button>
        </div>
        {/* image section */}
        <div className="relative aspect-square w-auto md:h-[480px]">
          <Image
            src={"/hero.png"}
            alt="hero"
            fill
            priority
            sizes="(min-width: 780px) 500px, calc(100vw - 24px)"
          />
        </div>
      </section>
    </div>
  );
}
