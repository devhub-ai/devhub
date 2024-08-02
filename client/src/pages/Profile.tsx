import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditProfileForm from './EditProfileForm';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import HomeSidebar from '@/components/Sidebar/HomeSidebar';
import { Card, CardHeader, CardContent } from "@/components/ui/card"

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ProfileProps {
    onLogout: () => void;
    username: string;
}

const Profile: React.FC<ProfileProps> = ({ onLogout, username }) => {
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
                {editing ? (
                    <EditProfileForm onProjectAdded={handleProjectAdded} />
                ) : (
                    <div className="grid max-w-7xl min-h-screen gap-6 px-4 mx-auto lg:grid-cols-[250px_1fr_300px] lg:px-6 xl:gap-10">
                        <div className="py-10 space-y-4  lg:block">
                            <div className="flex flex-col items-center space-y-2">
                                <img src="/placeholder.svg" width="150" height="150" className="rounded-full" alt="Avatar" />
                                <div className="text-center">
                                    <h1 className="text-xl font-bold">{profileData.name}</h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">@{profileData.username}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold">Bio</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {profileData.bio}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold">Email</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {profileData.email}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold">Github</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {profileData.githubUsername}
                                </p>
                            </div>

                            <Button className="w-full" onClick={() => setEditing(true)}>Update Profile</Button>
                        </div>

                        <div className="space-y-6 lg:space-y-10">
                            <div className="flex flex-col space-y-2 lg:space-y-4">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-xl font-bold">Projects</h2>

                                </div>
                            </div>
                            <div className="space-y-4">
                                {profileData.projects.map((project: any) => (
                                    <Card key={project.id}>
                                        <CardHeader className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm">
                                                    <div className="font-semibold">{project.title}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">@{profileData.username}</div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{project.description}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>


    );
};

export default Profile;
