import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarLeft } from '@/components/Sidebar/Sidebar'
import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/Projects/ProjectCard";
import { useParams } from "react-router-dom";
import AddProject from "./AddProject";

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
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false); // Refresh trigger
    const { username } = useParams<{ username: string }>();

    // Fetch user projects
    const fetchUserProjects = async () => {
        try {
            const response = await fetch(`${backendUrl}/profile/${username}/projects`);
            if (!response.ok) {
                throw new Error("Failed to fetch projects");
            }
            const data = await response.json();
            setProjects(data.projects || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (username) {
            fetchUserProjects();
        }
    }, [username, refresh]); // Re-fetch projects on refresh trigger

    // Callback to trigger refresh
    const handleRefresh = () => {
        setRefresh(!refresh); // Toggle refresh state to re-trigger useEffect
    };

    if (loading) {
        return <div>Loading projects...</div>;
    }

    if (!projects.length) {
        return <div>No projects found.</div>;
    }

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
                    <h1 className="ml-5 text-5xl mt-2">Projects</h1>
                    <AddProject onProjectChange={handleRefresh} /> {/* Pass the callback */}
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard key={project.projectId} project={project} onProjectChange={handleRefresh} />
                            ))}
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Projects;
