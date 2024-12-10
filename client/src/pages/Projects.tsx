import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarLeft } from "@/components/Sidebar/Sidebar";
import { ProjectCard } from "@/components/Projects/ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Project {
    projectId: string;
    title: string;
    description: string;
    repoLink: string;
    starCount: number;
    imageUrl: string;
    tags: string[];
}

const Projects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false); // Refresh trigger
    const { username } = useParams<{ username: string }>();

    const navigate = useNavigate();

    useEffect(() => {
        const devhub_username = localStorage.getItem('devhub_username');

        if (!devhub_username) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        // Fetch user projects
        const fetchUserProjects = async () => {
            try {
                const response = await fetch(`${backendUrl}/profile/${username}/projects`);
                const data = await response.json();
                setProjects(data.projects);
            } catch (error) {
                console.error('Failed to fetch projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProjects();
    }, [username, refresh]);

    const handleRefresh = () => {
        setRefresh((prev) => !prev); 
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
                <main className="flex flex-col flex-grow p-4 overflow-hidden">
                    <h1 className="ml-5 text-5xl mt-2">Projects</h1>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        {!projects ? (
                            <div className="flex flex-col justify-center items-center">
                                <h1 className="text-3xl">No Projects yet.</h1>
                            </div>
                        ) : loading ? (
                            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Skeleton key={index} className="h-32 w-100" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                                {projects.map((project) => (
                                    <ProjectCard key={project.projectId} project={project} onProjectChange={handleRefresh} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Projects;
