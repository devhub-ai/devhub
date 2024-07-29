import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditProfileForm from './EditProfileForm';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import HomeSidebar from '@/components/Sidebar/HomeSidebar';
import { ProfileForm } from './EditForm';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ProfileProps {
    onLogout: () => void;
    username: string;
}

const Profile: React.FC<ProfileProps> = ({ onLogout , username }) => {
    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-screen"
            )} 
        >
            <HomeSidebar onLogout={onLogout} username={username} />
            <Dashboard />
        </div>
    );
};

const Dashboard = () => {
    const { username } = useParams<{ username: string }>();
    const [profileData, setProfileData] = useState<any>(null);
    const [editing, setEditing] = useState(false);

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

    const handleProjectAdded = (newProject: any) => {
        setProfileData((prevData: any) => ({
            ...prevData,
            projects: [...prevData.projects, newProject],
        }));
    };

    if (!username) {
        return <div>Error: No username provided</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }
    return (
        <div className="flex flex-1">
            <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                <h1>{profileData.username}'s Profile</h1>
                {editing ? (
                    <EditProfileForm onProjectAdded={handleProjectAdded} />
                ) : (
                    <>
                        <p>Bio: {profileData.bio}</p>
                        <p>GitHub: <a href={`https://github.com/${profileData.githubUsername}`}>{profileData.githubUsername}</a></p>
                        <h2>Projects</h2>
                        <ul>
                            {profileData.projects.map((project: any) => (
                                <li key={project.title}>
                                    <a href={project.repoLink} target="_blank" rel="noopener noreferrer">{project.title}</a>
                                    <p>{project.description}</p>
                                    <p>Tags: {project.tags.join(', ')}</p>
                                </li>
                            ))}
                        </ul>
                        <Button onClick={() => setEditing(true)}>Edit Profile</Button>
                    </>
                )}
                {/* <ProfileForm /> */}
            </div>
        </div>
    );
};

export default Profile;