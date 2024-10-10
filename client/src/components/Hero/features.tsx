import { cn } from "@/lib/utils";
import { IconLock, IconStar, IconShare, IconUsers, IconUserPlus, IconBulb, IconBuilding, IconMap } from "@tabler/icons-react";


export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Secure Your Access",
      description:
        "Protect your account with industry-standard OTP authentication, ensuring only you can log in.",
      icon: <IconLock />,
    },
    {
      title: "Showcase Your Skills",
      description:
        "Link your coding profiles from GitHub, LeetCode, and more to demonstrate your expertise and achievements.",
      icon: <IconStar />,
    },
    {
      title: "Share Your Journey",
      description:
        "Create a profile that reflects your passion and work, and easily share it with others to grow your network.",
      icon: <IconShare />,
    },
    {
      title: "Find Your Community",
      description: "Search and connect with like-minded developers and engineers from across the globe based on skills and interests.",
      icon: <IconUsers />,
    },
    {
      title: "Collaborate Instantly",
      description: "Start conversations, discuss projects, and brainstorm ideas with fellow developers through instant chat.",
      icon: <IconUserPlus />,
    },
    {
      title: "Share Your Innovations",
      description:
        "Post your latest projects, get feedback, and showcase your creativity to the developer community.",
      icon: <IconBulb />,
    },
    {
      title: "Build Together",
      description:
        "Form groups to collaborate, work on projects, or simply discuss ideas with others who share your vision.",
      icon: <IconBuilding />,
    },
    {
      title: "Plan Your Path",
      description: "Follow a customized roadmap to guide your learning, hone your skills, and reach your career goals as a developer.",
      icon: <IconMap />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800 ml-5",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
