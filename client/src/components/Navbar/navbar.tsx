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
import { ModeToggle } from "../Theme/mode-toggle";

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
      icon: <img src="../../../public/logo.png" width={20} height={20} alt="DevHub" />,
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



  const handleGithubClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.open("https://github.com/devhub-ai/devhub", "_blank");
  }

  return (
    <div className="flex items-center justify-center mt-16 w-full">
      <a href="/"><img src="../../../public/logo.png" className="size-10 mx-5" /></a>
      <div className="hidden md:block">
        <FloatingDock
          items={links.map(link => ({
            ...link,
            onClick: (event: React.MouseEvent<HTMLAnchorElement>) => handleClick(event, link),
          }))}
        />
      </div>
      <div className="flex gap-4 md:hidden">
        <button onClick={(e) => {
          e.preventDefault();
          const targetElement = document.querySelector("#features");
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        }}>
          <IconTerminal2 className="size-10" />
        </button>
        <button onClick={handleGithubClick}>
          <IconBrandGithub className="size-10" />
        </button>
      </div>


      <div className="px-4">
        <ModeToggle />
      </div>
    </div>
  );
}
