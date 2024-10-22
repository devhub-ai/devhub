import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Icons } from "@/components/ui/icons";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface DeleteProjectProps {
    projectId: string;
    onProjectChange: () => void;
}

const DeleteProject: React.FC<DeleteProjectProps> = ({ projectId, onProjectChange }) => {
    const username = localStorage.getItem('devhub_username');
    const [isLoading, setIsLoading] = useState(false);

    const handleDeleteProject = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(
                `${backendUrl}/profile/${username}/projects/${projectId}`,
                { withCredentials: true }
            );

            if (response.status === 200) {
                toast.success('Project deleted successfully');
                onProjectChange();
            } else {
                toast.error('Failed to delete project');
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
            toast.error('An error occurred while deleting the project');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid gap-6 sm:w-80">
            <Button onClick={handleDeleteProject} disabled={isLoading} className="w-full mt-4" variant="destructive">
            {isLoading ? (
                <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                </>
            ) : (
                'Delete Project'
            )}
        </Button>
        </div>
        
    );
};

export default DeleteProject;
