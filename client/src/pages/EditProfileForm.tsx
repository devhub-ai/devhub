import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TagInput from "@/components/MultiSelect/TagInput";
import { toast } from "sonner";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Tag {
    value: string;
    label: string;
}

interface Project {
    id?: number;
    title: string;
    description: string;
    repoLink: string;
    tags: Tag[];
}


interface ProfileData {
    name: string;
    bio: string;
    githubUsername: string;
    leetcodeUsername: string;
    projects: Project[];
}

interface EditProfileFormProps {
    onProjectAdded: (newProject: Project) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onProjectAdded }) => {
    const { username } = useParams<{ username: string }>();
    const [profileData, setProfileData] = useState<ProfileData>({
        name: '',
        bio: '',
        githubUsername: '',
        leetcodeUsername: '',
        projects: [],
    });
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [newProjectMode, setNewProjectMode] = useState(false);
    const [newProject, setNewProject] = useState<Project>({
        title: '',
        description: '',
        repoLink: '',
        tags: [],
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
        setProfileData((prevData: ProfileData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (selectedProject) {
            setSelectedProject((prevProject: Project | null) => {
                if (prevProject) {
                    return {
                        ...prevProject,
                        [name]: value,
                    };
                }
                return null; // or return a default Project object if you prefer
            });
        } else {
            setNewProject((prevProject: Project) => ({
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
            toast.success("Profile updated successfully");
            // alert('Profile updated successfully');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error("Failed to update profile", {
                description: "Please check your details and try again.",
            });
            // alert('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddProject = async () => {
        try {
            console.log("Tags:", newProject.tags);
            const tagsArray = newProject.tags.map(tag => ({ value: tag, label: tag }));  // Convert Tag objects to strings

            console.log("Adding project:", tagsArray);
            const response = await axios.post(`${backendUrl}/profile/${username}/projects`, {
                title: newProject.title,
                description: newProject.description,
                repo_link: newProject.repoLink,
                tags: tagsArray, // Use the formatted tagsArray
            }, { withCredentials: true });
            if(response.status === 200)
                // console.log("Project added successfully:", );
                toast.success("Project added successfully");
            const addedProject = response.data.project;
    
            if (addedProject) {
                setProfileData((prevData: ProfileData) => ({
                    ...prevData,
                    projects: [...prevData.projects, addedProject],
                }));
    
                onProjectAdded(addedProject);
                setNewProject({ title: '', description: '', repoLink: '', tags: [] });
                setNewProjectMode(false);
            } else {
                console.error('Project was not added correctly:', response.data);
                toast.error("Failed to add project", {
                    action: {
                        label: "Try again",
                        onClick: () => console.log("Try again clicked"),
                    },
                });
                // alert('Failed to add project. Please try again.');
            }
        } catch (error) {
            console.error('Failed to add project:', error);
            // alert('Failed to add project. Please try again.');
        }
    };
    

    const handleUpdateProject = async () => {
        try {
            if (selectedProject) {
                const updatedProject = { ...selectedProject };
                await axios.put(`${backendUrl}/profile/${username}/projects/${selectedProject.id}`, updatedProject, { withCredentials: true });
    
                setProfileData((prevData: ProfileData) => ({
                    ...prevData,
                    projects: prevData.projects.map((p: Project) => p.id === selectedProject.id ? updatedProject : p),
                }));
                setSelectedProject(null);
            }
        } catch (error) {
            console.error('Failed to update project:', error);
            toast.error("Failed to update project", {
                description: "There was a problem with your request.",
                action: {
                    label: "Try again",
                    onClick: () => console.log("Try again clicked"),
                },
            });
            // alert('Failed to update project');
        }
    };
    

    const handleDeleteProject = async (projectTitle: string) => {
        try {
            console.log("Deleting project:", projectTitle);
            const response = await axios.delete(`${backendUrl}/profile/${username}/projects/${projectTitle}`, { withCredentials: true });
            if (response.status === 200) {
                setProfileData((prevData: ProfileData) => ({
                    ...prevData,
                    projects: prevData.projects.filter((project: Project) => project.title !== projectTitle),
                }));
                // alert('Project deleted successfully');
                toast.success("Project deleted successfully");
                if (selectedProject && selectedProject.title === projectTitle) {
                    setSelectedProject(null);
                }
            } else {
                console.log(response.status);
                toast.error("Failed to delete project", {
                    description: "There was a problem with your request.",
                    action: {
                        label: "Try again",
                        onClick: () => console.log("Try again clicked"),
                    },
                });
                // alert('Failed to delete project');
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
            // alert('Failed to delete project');
            toast.error("Failed to delete project", {
                description: "There was a problem with your request.",
                action: {
                    label: "Try again",
                    onClick: () => console.log("Try again clicked"),
                },
            });
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
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={profileData.name || ''}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="Your name"
                        />
                    </div>
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
                    <div>
                        <Label htmlFor="leetcodeUsername">Leetcode Username</Label>
                        <Input
                            id="leetcodeUsername"
                            name="leetcodeUsername"
                            value={profileData.leetcodeUsername || ''}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="Leetcode username"
                        />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </Button>
                </div>
            </form>

            <h2>Existing Projects</h2>
            <ul>
                {profileData.projects && profileData.projects.map((project: Project, index: number) => (
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
                    <Button onClick={() => handleDeleteProject(selectedProject.title!)} disabled={isLoading}>
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
                        <Label>Project Tags</Label>
                        <TagInput
                            selectedTags={newProject.tags} // This should be an array of Tag objects
                            onTagsChange={(tags: Tag[]) => setNewProject({ ...newProject, tags })} // Ensure tags are of type Tag[]
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