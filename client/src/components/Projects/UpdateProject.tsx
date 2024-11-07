import React, { useState } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import TagInput from '@/components/MultiSelect/TagInput';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Textarea } from '../ui/textarea';
import { Icons } from "@/components/ui/icons";
import UploadComponent from '../UploadComponent/UploadComponent'; 

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Project {
    title: string;
    projectId: string;
    description: string;
    repoLink: string;
    tags: string[];
    imageUrl?: string;
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
        tags: project.tags,
        imageUrl: project.imageUrl || '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
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
            // Upload the image and get the URL if an image is provided
            const uploadedImageUrl = await uploadImage();

            // Prepare the data for submission, filling in empty fields with previous data
            const finalData = {
                title: updatedProject.title || project.title,
                description: updatedProject.description || project.description,
                repo_link: updatedProject.repoLink || project.repoLink,
                tags: updatedProject.tags.length > 0 ? updatedProject.tags.join(',') : project.tags.join(','),
                imageUrl: uploadedImageUrl || project.imageUrl || ''
            };

            const response = await axios.put(
                `${backendUrl}/profile/${username}/projects/${updatedProject.projectId}`,
                finalData,
                {
                    withCredentials: true,
                }
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

    const uploadImage = async () => {
        if (!imageFile) return '';  // Return empty string if no image is uploaded

        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await axios.post(`${backendUrl}/project/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.imageUrl;  // Return the image URL
        } catch (error) {
            console.error('Image upload failed:', error);
            toast.error('Failed to upload image');
            return '';
        }
    };

    return (
        <div className="grid gap-6 sm:w-80">
            <div>
                <UploadComponent onFileChange={setImageFile} />
            </div>
            <div>
                <Input
                    id="updatedProjectTitle"
                    name="title"
                    value={updatedProject.title}
                    onChange={handleProjectChange}
                    disabled={isLoading}
                    placeholder="Project title"
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
