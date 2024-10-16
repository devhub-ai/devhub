import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandDiscord,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import React from "react";

interface Link {
  title: string;
  icon: React.ReactNode;
  to: string;
}

export function Navbar() {
  const links: Link[] = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "#top",
    },
    {
      title: "Features",
      icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "#features",
    },
    {
      title: "FAQs",
      icon: <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "#help",
    },
    {
      title: "DevHub",
      icon: <img src="https://i.ibb.co/xLbC5K7/logo.png" width={20} height={20} alt="DevHub" />,
      to: "#",
    },
    {
      title: "DevMap",
      icon: <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "#",
    },
    {
      title: "Discord",
      icon: <IconBrandDiscord className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "https://discord.gg/he8QHEC8WP",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "https://github.com/devhub-ai/devhub",
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, link: Link) => {
    if (link.to.startsWith("#")) {
      event.preventDefault();
      const targetElement = document.querySelector(link.to);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="flex items-center justify-center mt-16 w-full">
      <div className="hidden md:block">
        <FloatingDock
          items={links.map(link => ({
            ...link,
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) => handleClick(event, link),
          }))}
        />
      </div>
      <div className="px-4">
      </div>
    </div>
  );
}
