import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarLeft } from '@/components/Sidebar/Sidebar'
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

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

const ProjectDisplay = () => {
  const { username, projectId } = useParams<{ username: string; projectId: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${backendUrl}/profile/${username}/projects/${projectId}`);
        if (response.status === 200) {
          setProject(response.data);
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
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="w-full p-6">
                  <div className='flex'>
                    <h1 className="text-4xl font-bold">{project.title}</h1>
                    <div className='flex-grow'></div>
                      <div className="p-2 flex items-center">
                        <p className="text-lg text-gray-500">Stars: {project.starCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    <h2 className="text-lg font-medium mr-2">Tags:</h2>
                    <div className="flex gap-2">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 dark:bg-gray-200 rounded-full text-sm dark:text-black">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                    <p className="text-lg text-gray-500 mt-2">Repo: <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600">{project.repoLink}</a></p>
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
