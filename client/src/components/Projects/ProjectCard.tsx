import { useState, useEffect } from "react";
import { CircleIcon, StarIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FaStar as FilledStarIcon } from "react-icons/fa";

interface ProjectProps {
    project: {
        projectId: string;
        title: string;
        description: string;
        repoLink: string;
        starCount: number;
        tags: string[];
    };
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function ProjectCard({ project }: ProjectProps) {
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
                        <CircleIcon className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                        {project.tags.join(", ") || "No Tags"}
                    </div>
                    <div className="flex items-center">
                        <FilledStarIcon className="mr-1 h-3 w-3 text-yellow-400" />
                        {starCount} Stars
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
