import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandDiscord,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
  IconSun
} from "@tabler/icons-react";
import { ModeToggle } from "../Theme/mode-toggle";

export function Navbar() {
  const links = [
    {
      title: "Home",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "#top", // Scroll to top
    },
    {
      title: "Features",
      icon: <IconTerminal2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "#features", // Scroll to features section
    },
    {
      title: "FAQs",
      icon: <IconNewSection className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "#help", // Scroll to help section
    },
    {
      title: "DevHub",
      icon: <img src="../../../public/logo.png" width={20} height={20} alt="DevHub" />,
      to: "#", // No scrolling
    },
    {
      title: "DevMap",
      icon: <IconExchange className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "#", // No scrolling
    },
    {
      title: "Discord",
      icon: <IconBrandDiscord className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "https://discord.gg/he8QHEC8WP", // Discord link
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
      to: "https://github.com/devhub-ai/devhub", // GitHub link
    },
  ];

  const handleClick = (event, link) => {
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
      <img src="../../../public/logo.png" className="size-10 mx-5" />
      <div className="hidden md:block">
        <FloatingDock
          items={links.map(link => ({
            ...link,
            onClick: (event) => handleClick(event, link),
          }))}
        />
      </div>
      <div className="flex gap-4 md:hidden">
        <button onClick={(e) => handleClick(e, { to: "#features" })}><IconTerminal2 className="size-10" /></button>
        <a href="https://github.com/devhub-ai/devhub" target="_blank"><IconBrandGithub className="size-10" /></a>
      </div>
      <button className="px-5"><ModeToggle /></button>
    </div>
  );
}
