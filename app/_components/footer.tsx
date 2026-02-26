import Link from "next/link";
import { footerMenus, socialLinks } from "@/constant";

const Footer = () => {
  return (
    <footer>
      <nav className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-4 border-t px-4 py-5 md:flex-row md:justify-between">
        <div className="flex items-center gap-6 text-sm md:text-base">
          {footerMenus.map((menu, idx) => (
            <Link href={menu.url} key={idx}>
              {menu.title}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {socialLinks.map((link, idx) => (
            <Link
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
            >
              <link.icon className="size-4 md:size-5" />
              <span className="sr-only">{link.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
