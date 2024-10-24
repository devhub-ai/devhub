import { useState, useEffect } from "react";
import { StarIcon, GitHubLogoIcon, TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaStar as FilledStarIcon } from "react-icons/fa";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogDescription
} from "@/components/ui/alert-dialog";
import UpdateProject from "./UpdateProject";
import DeleteProject from "./DeleteProject";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Skeleton } from "../ui/skeleton";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { toast } from "sonner";

interface Project {
    projectId: string;
    title: string;
    description: string;
    repoLink: string;
    starCount: number;
    imageUrl: string;
    tags: string[];
}

interface ProjectProps {
    project: Project;
    onProjectChange: () => void;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function ProjectCard({ project, onProjectChange }: ProjectProps) {
    const [isStarred, setIsStarred] = useState(false);
    const [starCount, setStarCount] = useState(project.starCount);
    const [isStarRequestInProgress, setIsStarRequestInProgress] = useState(false); // State to handle star request
    const username = localStorage.getItem('devhub_username'); // Logged-in user
    const { username: paramsUsername } = useParams<{ username: string }>(); // Extract username from URL

    const isProjectOwner = username === paramsUsername; // Check if the logged-in user is the project owner

    const navigate = useNavigate();

    const projectDetails = () => {
        navigate(`/projects/${paramsUsername}/${project.projectId}`);
    };

    // Fetch initial star state from server/localStorage or logic to check if user has starred
    useEffect(() => {
        const fetchStarState = async () => {
            const starredStatus = localStorage.getItem(`starred_${project.projectId}`);
            setIsStarred(!!starredStatus);
        };
        fetchStarState();
    }, [project.projectId]);

    const handleStarClick = async () => {
        if (isStarred || isStarRequestInProgress) return; // Prevent multiple stars and requests

        setIsStarRequestInProgress(true); // Start request

        try {
            const response = await fetch(`${backendUrl}/profile/${username}/projects/${project.projectId}/star`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                setStarCount((prevCount) => prevCount + 1);
                setIsStarred(true);
                localStorage.setItem(`starred_${project.projectId}`, "true");

                // Show success toast
                toast.success("Project starred!");
            } else {
                console.error("Failed to star the project");
                toast.error("Failed to star the project");
            }
        } catch (error) {
            console.error("Error starring the project:", error);
            toast.error("Failed to star the project");
        } finally {
            setIsStarRequestInProgress(false); // End request
        }
    };

    return (
        <Card>
            {project.imageUrl ? (
                <div
                    className="h-40 w-full bg-primary rounded-tl-md rounded-tr-md"
                    style={{ backgroundImage: `url(${project.imageUrl})` }}
                ></div>
            ) : (
                <Skeleton className="h-40 w-full rounded-tl-md rounded-tr-md" />
            )}
            <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle
                        onClick={projectDetails}
                        className="hover:underline cursor-pointer"
                    >
                        {project.title}
                    </CardTitle>
                    <ReactMarkdown>
                        {project.description.split(' ').slice(0, 5).join(' ') + (project.description.split(' ').length > 5 ? '...' : '')}
                    </ReactMarkdown>
                </div>
                <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
                    <Button
                        variant="secondary"
                        className="shadow-none"
                        onClick={handleStarClick}
                        disabled={isStarred || isStarRequestInProgress} // Disable during star request
                    >
                        {isStarred ? (
                            <FilledStarIcon className="mr-2 h-4 w-4 text-yellow-400" />
                        ) : (
                            <StarIcon className="mr-2 h-4 w-4" />
                        )}
                        {isStarRequestInProgress ? "Starring..." : "Star"} {/* Show loading text */}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <GitHubLogoIcon className="mr-1" />
                        <a href={project.repoLink} target="_blank" rel="noopener noreferrer">
                            visit
                        </a>
                    </div>
                    <div className="flex items-center">
                        <StarIcon className="mr-1" />
                        {starCount} Stars
                    </div>
                    <div className="flex-grow"></div>

                    {/* Only show edit and delete options if the logged-in user is the project owner */}
                    {isProjectOwner && (
                        <div className="flex items-center">
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <Pencil2Icon className="mr-2 h-5 w-5" />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <div className="flex">
                                        <AlertDialogHeader className="text-2xl">
                                            Update Project
                                        </AlertDialogHeader>
                                        <div className="flex-grow"></div>
                                        <AlertDialogCancel>
                                            <Cross1Icon className="h-3 w-3" />
                                        </AlertDialogCancel>
                                    </div>
                                    <UpdateProject project={project} onProjectChange={onProjectChange} />
                                </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <TrashIcon className="mr-1 h-5 w-5 text-red-600" />
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <div className="flex">
                                        <AlertDialogHeader className="text-2xl">
                                            Delete Project
                                        </AlertDialogHeader>
                                        <div className="flex-grow"></div>
                                        <AlertDialogCancel>
                                            <Cross1Icon className="h-3 w-3" />
                                        </AlertDialogCancel>
                                    </div>
                                    <AlertDialogDescription>
                                        Are you sure? This action cannot be undone.
                                    </AlertDialogDescription>
                                    <DeleteProject projectId={project.projectId} onProjectChange={onProjectChange} />
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
