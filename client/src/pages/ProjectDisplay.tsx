import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarLeft } from "@/components/Sidebar/Sidebar";
import { StarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { FaStar as FilledStarIcon } from "react-icons/fa";
import { Button } from "@/components/ui/button"; // Import the Button component
import { toast } from "sonner"; // Assuming you use this for notifications

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface Project {
  projectId: string;
  title: string;
  description: string;
  repoLink: string;
  starCount: number;
  imageUrl: string;
  tags: string[];
}

const ProjectDisplay = () => {
  const { username, projectId } = useParams<{ username: string; projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(0); // Initialize as 0
  const [isStarRequestInProgress, setIsStarRequestInProgress] = useState(false); // To disable button during request
  const loggedInUsername = localStorage.getItem("devhub_username");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${backendUrl}/profile/${username}/projects/${projectId}`);
        if (response.status === 200) {
          const projectData = response.data;
          setProject(projectData);
          setStarCount(projectData.starCount); // Set star count when project data is fetched
        } else {
          console.error("Failed to fetch project details");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [username, projectId]);

  useEffect(() => {
    if (project?.projectId) {
      const starredStatus = localStorage.getItem(`starred_${project.projectId}`);
      setIsStarred(!!starredStatus);
    }
  }, [project?.projectId]);

  const handleStarClick = async () => {
    if (isStarred || isStarRequestInProgress || !project) return; // Prevent multiple stars or if request is in progress

    setIsStarRequestInProgress(true); // Disable the button while the request is in progress

    try {
      const response = await fetch(`${backendUrl}/profile/${loggedInUsername}/projects/${project.projectId}/star`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setStarCount((prevCount) => prevCount + 1);
        setIsStarred(true);
        localStorage.setItem(`starred_${project.projectId}`, "true");
        toast.success("Project starred!");
      } else {
        console.error("Failed to star the project");
        toast.error("Failed to star the project");
      }
    } catch (error) {
      console.error("Error starring the project:", error);
      toast.error("Error starring the project");
    } finally {
      setIsStarRequestInProgress(false); // Re-enable the button after request finishes
    }
  };

  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
          </div>
        </header>
        <main className="flex flex-col flex-grow overflow-hidden">
          <div className="flex flex-1 flex-col gap-4">
            {loading ? (
              <Skeleton className="h-40 w-full" />
            ) : project ? (
              <div className="space-y-4">
                {project.imageUrl && (
                  <div className="md:h-[440px] sm:h-auto overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="w-full p-6">
                  <div className="flex items-center">
                    <h1 className="text-4xl font-bold">{project.title}</h1>
                    <div className="flex-grow"></div>
                    <div className="p-2 flex items-center">
                      <Button
                        variant="secondary"
                        className="shadow-none"
                        onClick={handleStarClick}
                        disabled={isStarred || isStarRequestInProgress} // Disable during request
                      >
                        {isStarred ? (
                          <FilledStarIcon className="mr-2 h-4 w-4 text-yellow-400" />
                        ) : (
                          <StarIcon className="mr-2 h-4 w-4" />
                        )}
                        {starCount}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <h2 className="text-lg font-medium mr-2">Tags:</h2>
                    <div className="flex gap-2">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 dark:bg-gray-200 rounded-full text-sm dark:text-black"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-lg text-gray-500 mt-2">
                    <a
                      href={project.repoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      Github Repository
                    </a>
                  </p>
                  <h1 className="text-4xl font-bold mt-5">Project Description:</h1>
                  <ReactMarkdown className="mt-4">{project.description}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <p>Project not found</p>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ProjectDisplay;
