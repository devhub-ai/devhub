import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import TagInput from '@/components/MultiSelect/TagInput';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Textarea } from '../ui/textarea';
import { Icons } from "@/components/ui/icons";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Project {
    title: string;
    projectId: string;
    description: string;
    repoLink: string;
    tags: string[];  // Now an array of strings
}

interface UpdateProjectProps {
    project: Project;
    onProjectChange: () => void;
}

const UpdateProject: React.FC<UpdateProjectProps> = ({ project, onProjectChange }) => {
    const [updatedProject, setUpdatedProject] = useState<Project>({
        title: project.title,
        projectId: project.projectId,
        description: project.description,
        repoLink: project.repoLink,
        tags: project.tags,  // Tags are passed as an array of strings
    });

    const username = localStorage.getItem('devhub_username');
    const [isLoading, setIsLoading] = useState(false);

    const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatedProject((prevProject) => ({
            ...prevProject,
            [name]: value,
        }));
    };

    const handleUpdateProject = async () => {
        setIsLoading(true);

        try {
            // Join the array of tags into a comma-separated string
            const tagsString = updatedProject.tags.join(',');

            const response = await axios.put(
                `${backendUrl}/profile/${username}/projects/${updatedProject.projectId}`,
                {
                    title: updatedProject.title,
                    description: updatedProject.description,
                    repo_link: updatedProject.repoLink,
                    tags: tagsString,  // Send tags as a comma-separated string
                },
                { withCredentials: true },
            );

            if (response.status === 200) {
                toast.success('Project updated successfully');
                onProjectChange();
            } else {
                toast.error('Failed to update project');
            }
        } catch (error) {
            console.error('Failed to update project:', error);
            toast.error('An error occurred while updating the project');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid gap-6 sm:w-80">
            <div>
                <Input
                    id="updatedProjectTitle"
                    name="title"
                    value={updatedProject.title}
                    onChange={handleProjectChange}
                    disabled={isLoading}
                    placeholder="Project title"
                    className=""
                />
            </div>
            <div>
                <Textarea
                    id="updatedProjectDescription"
                    name="description"
                    value={updatedProject.description}
                    onChange={handleProjectChange}
                    disabled={isLoading}
                    placeholder="Project description"
                    className=""
                />
            </div>
            <div>
                <TagInput
                    selectedTags={updatedProject.tags.map(tag => ({ label: tag, value: tag }))}
                    onTagsChange={(tags) => setUpdatedProject({ ...updatedProject, tags: tags.map(tag => tag.value) })}
                />
            </div>
            <div>
                <Input
                    id="updatedProjectRepoLink"
                    name="repoLink"
                    value={updatedProject.repoLink}
                    onChange={handleProjectChange}
                    disabled={isLoading}
                    placeholder="Repository link"
                    className=""
                />
            </div>
            <Button onClick={handleUpdateProject} disabled={isLoading} className="w-full mt-4">
                {isLoading ? (
                    <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                    </>
                ) : (
                    'Update Project'
                )}
            </Button>
        </div>
    );
};

export default UpdateProject;
