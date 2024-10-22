import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarLeft } from '@/components/Sidebar/Sidebar'
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/Projects/ProjectCard";
import { useParams } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Project {
    projectId: string;
    title: string;
    description: string;
    repoLink: string;
    starCount: number;
    tags: string[];
}

const Projects = () => {
  return (
      <SidebarProvider>
          <SidebarLeft />
          <SidebarInset>
              <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
                  <div className="flex flex-1 items-center gap-2 px-3">
                      <SidebarTrigger />
                  </div>
              </header>
              <main className="flex flex-col flex-grow p-4 overflow-hidden">
                  <Dashboard />
              </main>
          </SidebarInset>
      </SidebarProvider>
  )
}

const fetchUserProjects = async (username: string) => {
    const response = await fetch(`${backendUrl}/profile/${username}/projects`);
    if (!response.ok) {
        throw new Error("Failed to fetch projects");
    }
    return response.json();
};

const Dashboard = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { username } = useParams<{ username: string }>();

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchUserProjects(username || "");
                setProjects(data.projects || []);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            loadProjects();
        }
    }, [username]);

    if (loading) {
        return <div>Loading projects...</div>;
    }

    if (!projects.length) {
        return <div>No projects found.</div>;
    }
    return(
        <>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard key={project.projectId} project={project} />
                    ))}
                </div>
            </div>
           
        </>
    )
}

export default Projects