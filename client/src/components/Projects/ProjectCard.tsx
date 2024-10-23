import { useState, useEffect } from "react";
import { StarIcon, GitHubLogoIcon, TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Project {
    projectId: string;
    title: string;
    description: string;
    repoLink: string;
    starCount: number;
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
    const username = localStorage.getItem('devhub_username'); 

    // Fetch initial star state from server/localStorage or logic to check if user has starred
    useEffect(() => {
        const fetchStarState = async () => {
            const starredStatus = localStorage.getItem(`starred_${project.projectId}`);
            setIsStarred(!!starredStatus);
        };
        fetchStarState();
    }, [project.projectId]);

    const handleStarClick = async () => {
        if (isStarred) return; // Prevent multiple stars

        try {
            const response = await fetch(`${backendUrl}/profile/${username}/projects/${project.projectId}/star`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
                setStarCount((prevCount) => prevCount + 1);
                setIsStarred(true);
                localStorage.setItem(`starred_${project.projectId}`, "true");
            } else {
                console.error("Failed to star the project");
            }
        } catch (error) {
            console.error("Error starring the project:", error);
        }
    };

    return (
        <Card>
            <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                </div>
                <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
                    <Button
                        variant="secondary"
                        className=" shadow-none"
                        onClick={handleStarClick}
                        disabled={isStarred}
                    >
                        {isStarred ? (
                            <FilledStarIcon className="mr-2 h-4 w-4 text-yellow-400" />
                        ) : (
                            <StarIcon className="mr-2 h-4 w-4" />
                        )}
                         Star
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <GitHubLogoIcon className="mr-1" />
                        <a href={project.repoLink} target="_blank">visit</a>
                    </div>
                    <div className="flex items-center">
                        <StarIcon className="mr-1" />
                        {starCount === null ? "0" : starCount} Stars
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex items-center">
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Pencil2Icon className="mr-2 h-5 w-5" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <div className='flex'>
                                    <AlertDialogHeader className='text-2xl'>Update Project</AlertDialogHeader>
                                    <div className='flex-grow'></div>
                                    <AlertDialogCancel><Cross1Icon className='h-3 w-3' /></AlertDialogCancel>
                                </div>
                                <UpdateProject project={project} onProjectChange={onProjectChange}/>
                            </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <TrashIcon className="mr-1 h-5 w-5 text-red-600" />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <div className="flex">
                                    <AlertDialogHeader className='text-2xl'>Delete Project</AlertDialogHeader>
                                    <div className='flex-grow'></div>
                                    <AlertDialogCancel><Cross1Icon className='h-3 w-3' /></AlertDialogCancel>
                                </div>
                                <AlertDialogDescription>
                                    Are you sure?<br/>
                                    This action cannot be undone.
                                </AlertDialogDescription>
                                <DeleteProject projectId={project.projectId} onProjectChange={onProjectChange}/>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
