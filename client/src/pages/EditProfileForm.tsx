import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface EditProfileFormProps {
    onProjectAdded: (newProject: any) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onProjectAdded }) => {
    const { username } = useParams<{ username: string }>();
    const [profileData, setProfileData] = useState<any>({
        bio: '',
        githubUsername: '',
        projects: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [newProjectMode, setNewProjectMode] = useState(false);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        repoLink: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${backendUrl}/profile/${username}`);
                setProfileData(response.data);
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (selectedProject) {
            setSelectedProject(prevProject => ({
                ...prevProject,
                [name]: value,
            }));
        } else {
            setNewProject(prevProject => ({
                ...prevProject,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.put(`${backendUrl}/profile/${username}`, profileData, { withCredentials: true });
            alert('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProject = async () => {
        try {
            const response = await axios.post(`${backendUrl}/profile/${username}/projects`, {
                title: newProject.title,
                description: newProject.description,
                repo_link: newProject.repoLink,
            }, { withCredentials: true });

            const addedProject = response.data.project;

            if (addedProject) {
                setProfileData(prevData => ({
                    ...prevData,
                    projects: [...prevData.projects, addedProject],
                }));

                onProjectAdded(addedProject);
                setNewProject({ title: '', description: '', repoLink: '' });
                setNewProjectMode(false);
            } else {
                console.error('Project was not added correctly:', response.data);
                alert('Failed to add project. Please try again.');
            }
        } catch (error) {
            console.error('Failed to add project:', error);
            alert('Failed to add project. Please try again.');
        }
    };

    const handleUpdateProject = async () => {
        try {
            if (selectedProject) {
                const updatedProject = { ...selectedProject };
                await axios.put(`${backendUrl}/profile/${username}/projects/${selectedProject.id}`, updatedProject, { withCredentials: true });

                setProfileData(prevData => ({
                    ...prevData,
                    projects: prevData.projects.map((p: any) => p.id === selectedProject.id ? updatedProject : p),
                }));
                setSelectedProject(null);
            }
        } catch (error) {
            console.error('Failed to update project:', error);
            alert('Failed to update project');
        }
    };

    const handleDeleteProject = async (projectId: number) => {
        try {
            const response = await axios.delete(`${backendUrl}/profile/${username}/projects/${projectId}`, { withCredentials: true });
            if (response.status === 200) {
                setProfileData(prevData => ({
                    ...prevData,
                    projects: prevData.projects.filter((project: any) => project.id !== projectId),
                }));
                alert('Project deleted successfully');
                if (selectedProject && selectedProject.id === projectId) {
                    setSelectedProject(null);
                }
            } else {
                alert('Failed to delete project');
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('Failed to delete project');
        }
    };

    const openNewProjectForm = () => {
        setNewProjectMode(true);
        setSelectedProject(null);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                            id="bio"
                            name="bio"
                            value={profileData.bio || ''}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="Write something about yourself"
                        />
                    </div>
                    <div>
                        <Label htmlFor="githubUsername">GitHub Username</Label>
                        <Input
                            id="githubUsername"
                            name="githubUsername"
                            value={profileData.githubUsername || ''}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="GitHub username"
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </Button>
                </div>
            </form>

            <h2>Existing Projects</h2>
            <ul>
                {profileData.projects && profileData.projects.map((project, index) => (
                    project && project.title ? (
                        <li key={project.id || index}>
                            <h3 onClick={() => setSelectedProject(project)}>{project.title}</h3>
                        </li>
                    ) : null
                ))}
            </ul>

            {selectedProject && (
                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="projectTitle">Title</Label>
                        <Input
                            id="projectTitle"
                            name="title"
                            value={selectedProject.title || ''}
                            onChange={handleProjectChange}
                            disabled={isLoading}
                            placeholder="Project title"
                        />
                    </div>
                    <div>
                        <Label htmlFor="projectDescription">Description</Label>
                        <Input
                            id="projectDescription"
                            name="description"
                            value={selectedProject.description || ''}
                            onChange={handleProjectChange}
                            disabled={isLoading}
                            placeholder="Project description"
                        />
                    </div>
                    <div>
                        <Label htmlFor="projectRepoLink">Repository Link</Label>
                        <Input
                            id="projectRepoLink"
                            name="repoLink"
                            value={selectedProject.repoLink || ''}
                            onChange={handleProjectChange}
                            disabled={isLoading}
                            placeholder="Repository link"
                        />
                    </div>
                    <Button onClick={handleUpdateProject} disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Project'}
                    </Button>
                    <Button onClick={() => handleDeleteProject(selectedProject.id)} disabled={isLoading}>
                        {isLoading ? 'Deleting...' : 'Delete Project'}
                    </Button>
                </div>
            )}

            {newProjectMode && (
                <div className="grid gap-4">
                    <div>
                        <Label htmlFor="newProjectTitle">Title</Label>
                        <Input
                            id="newProjectTitle"
                            name="title"
                            value={newProject.title}
                            onChange={handleProjectChange}
                            disabled={isLoading}
                            placeholder="Project title"
                        />
                    </div>
                    <div>
                        <Label htmlFor="newProjectDescription">Description</Label>
                        <Input
                            id="newProjectDescription"
                            name="description"
                            value={newProject.description}
                            onChange={handleProjectChange}
                            disabled={isLoading}
                            placeholder="Project description"
                        />
                    </div>
                    <div>
                        <Label htmlFor="newProjectRepoLink">Repository Link</Label>
                        <Input
                            id="newProjectRepoLink"
                            name="repoLink"
                            value={newProject.repoLink}
                            onChange={handleProjectChange}
                            disabled={isLoading}
                            placeholder="Repository link"
                        />
                    </div>
                    <Button onClick={handleAddProject} disabled={isLoading}>
                        {isLoading ? 'Adding...' : 'Add Project'}
                    </Button>
                </div>
            )}

            {!newProjectMode && (
                <Button onClick={openNewProjectForm} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Add New Project'}
                </Button>
            )}
        </div>
    );
};

export default EditProfileForm;
