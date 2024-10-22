import React, { useState } from 'react';
import axios from 'axios';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from '@/components/ui/input';
import TagInput from '@/components/MultiSelect/TagInput';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Textarea } from '../ui/textarea';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Project {
    title: string;
    description: string;
    repoLink: string;
    tags: Tag[];
}

interface Tag {
    value: string;
    label: string;
}

const AddProject: React.FC<{ onProjectChange: () => void }> = ({ onProjectChange }) => {
    const [newProject, setNewProject] = useState<Project>({
        title: '',
        description: '',
        repoLink: '',
        tags: [],
    });

    const username = localStorage.getItem('devhub_username');
    const [isLoading, setIsLoading] = useState(false);

    const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewProject((prevProject) => ({
            ...prevProject,
            [name]: value,
        }));
    };

    const handleAddProject = async () => {
        if (!username) {
            toast.error('Username not found');
            return;
        }

        setIsLoading(true); 

        try {
            // Convert tags array to a comma-separated string
            const tagsString = newProject.tags.map((tag) => tag.value).join(',');

            const response = await axios.post(
                `${backendUrl}/profile/${username}/projects`,
                {
                    title: newProject.title,
                    description: newProject.description,
                    repo_link: newProject.repoLink,
                    tags: tagsString,  // Send as comma-separated string
                },
                { withCredentials: true },
            );

            if (response.status === 200 || response.status === 201) {
                toast.success('Project added successfully');
                setNewProject({ title: '', description: '', repoLink: '', tags: [] });  // Reset form
                onProjectChange();
            } else {
                toast.error('Failed to add project');
            }
        } catch (error) {
            console.error('Failed to add project:', error);
            toast.error('An error occurred while adding the project');
        } finally {
            setIsLoading(false);  // Reset loading state
        }
    };




    return (
        <AlertDialog>
            <AlertDialogTrigger className="w-[120px] ml-5 mt-5 mb-3">
                <Button variant="outline" className="h-[50px]">Add Project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <div className='flex'>
                    <AlertDialogHeader className='text-2xl'>Add New Project</AlertDialogHeader>
                    <div className='flex-grow'></div>
                    <AlertDialogCancel><Cross1Icon className='h-3 w-3'/></AlertDialogCancel>
                </div>
                    <AlertDialogDescription>
                        <AlertDialogTitle></AlertDialogTitle>
                            <div className="grid gap-6 sm:w-80">
                                <div>
                                    <Input
                                        id="newProjectTitle"
                                        name="title"
                                        value={newProject.title}
                                        onChange={handleProjectChange}
                                        disabled={isLoading}
                                        placeholder="Project title"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Textarea
                                        id="newProjectDescription"
                                        name="description"
                                        value={newProject.description}
                                        onChange={handleProjectChange}
                                        disabled={isLoading}
                                        placeholder="# Project description"
                                        className=""
                                    />
                                </div>
                                <div>
                                    <TagInput
                                        selectedTags={newProject.tags}
                                        onTagsChange={(tags) => setNewProject({ ...newProject, tags })}
                                    />
                                </div>
                                <div>
                                    
                                    <Input
                                        id="newProjectRepoLink"
                                        name="repoLink"
                                        value={newProject.repoLink}
                                        onChange={handleProjectChange}
                                        disabled={isLoading}
                                        placeholder="Repository link"
                                        className=""
                                    />
                                </div>
                                <Button onClick={handleAddProject} disabled={isLoading} className="w-full mt-4">
                                    {isLoading ? (
                                        <>
                                            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        'Add Project'
                                    )}
                                </Button>
                            </div>
                        
                    </AlertDialogDescription>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AddProject;