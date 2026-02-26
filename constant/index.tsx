import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandX,
  IconLayoutDashboard,
  IconSettings,
  IconWallet,
} from "@tabler/icons-react";

export const userMenus = [
  { title: "Dashboard", url: "/dashboard", Icon: IconLayoutDashboard },
  { title: "Settings", url: "/settings", Icon: IconSettings },
  { title: "Billing", url: "/billing", Icon: IconWallet },
];

export const mainMenus = [
  { title: "Dashboard", url: "/dashboard", Icon: IconLayoutDashboard },
  { title: "Calendar", url: "/calendar", Icon: IconSettings },
  { title: "Discover", url: "/discover", Icon: IconWallet },
];

export const footerMenus = [
  { title: "Pricing", url: "/pricing" },
  { title: "Help", url: "/help" },
  { title: "Terms & Condition", url: "/terms" },
  { title: "Privacy", url: "/privacy" },
];

export const socialLinks = [
  {
    icon: IconBrandX,
    title: "x",
    url: "https://x.com/home",
  },
  {
    icon: IconBrandFacebook,
    title: "facebook",
    url: "https://facebook.com",
  },
  {
    icon: IconBrandInstagram,
    title: "instagram",
    url: "https://www.instagram.com",
  },
];
