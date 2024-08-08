import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditProfileForm from './EditProfileForm';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import HomeSidebar from '@/components/Sidebar/HomeSidebar';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ProfileProps {
    onLogout: () => void;
    username: string;
}
interface Project {
    description: string;
    repoLink: string;
    tags: string;
    title: string;
}
interface UserResponse {
    bio: string;
    email: string;
    githubUsername: string;
    isFriend: boolean;
    leetcodeUsername: string;
    name: string | null;
    projects: Project[];
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
            <Dashboard loggedInUsername={username} />
        </div>
    );
};

interface DashboardProps {
    loggedInUsername: string;
}

const Dashboard: React.FC<DashboardProps> = ({ loggedInUsername }) => {
    const { username } = useParams<{ username: string }>();
    const [profileData, setProfileData] = useState<UserResponse>();
    const [friends, setFriends] = useState<string[]>([]);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        const fetchProfileAndFriends = async () => {
            try {
                // Fetch profile data
                const profileResponse = await axios.get(`${backendUrl}/profile/${username}`, {
                    params: { logged_in_user: loggedInUsername }
                });
                setProfileData(profileResponse.data);

                // Fetch friends data
                const friendsResponse = await axios.get(`${backendUrl}/profile/${username}/friends`);
                setFriends(friendsResponse.data.friends);
            } catch (error) {
                console.error('Failed to fetch profile or friends data:', error);
            }
        };

        if (username) {
            fetchProfileAndFriends();
        }
    }, [username]);

    const handleProjectAdded = (newProject: Project) => {
        setProfileData(prevData => prevData ? {
            ...prevData,
            projects: [...prevData.projects, newProject],
        } : prevData);
    };

    const handleFriendRequest = async () => {
        try {
            if (profileData?.isFriend) {
                await axios.delete(`${backendUrl}/profile/${username}/friends`, {
                    data: { friend_username: loggedInUsername }
                });
                setProfileData(prev => prev ? { ...prev, isFriend: false } : prev);
            } else {
                await axios.post(`${backendUrl}/profile/${username}/friends`, {
                    friend_username: loggedInUsername
                });
                setProfileData(prev => prev ? { ...prev, isFriend: true } : prev);
            }

            // Re-fetch friends to update the list
            const friendsResponse = await axios.get<{ friends: string[] }>(`${backendUrl}/profile/${username}/friends`);
            setFriends(friendsResponse.data.friends);
        } catch (error) {
            console.error('Failed to update friend status:', error);
        }
    };

    if (!username) {
        return <div>Error: No username provided</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    const isOwnProfile = loggedInUsername === username;

    return (
        <div className="flex flex-1">
            <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                {editing ? (
                    <EditProfileForm onProjectAdded={handleProjectAdded} />
                ) : (
                    <div className="grid max-w-7xl min-h-screen gap-6 px-4 mx-auto lg:grid-cols-[250px_1fr_300px] lg:px-6 xl:gap-10">
                        <div className="py-10 space-y-4 lg:block">
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
                            <div className="space-y-2">
                                <p className="font-semibold">Leetcode</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {profileData.leetcodeUsername}
                                </p>
                            </div>

                            {!isOwnProfile && (
                                <Button className="w-full" onClick={handleFriendRequest}>
                                    {profileData.isFriend ? 'Disconnect' : 'Connect'}
                                </Button>
                            )}

                            {isOwnProfile && (
                                <Button className="w-full" onClick={() => setEditing(true)}>Update Profile</Button>
                            )}
                        </div>

                        <div className="space-y-6 lg:space-y-10">
                            <div className="flex flex-col space-y-2 lg:space-y-4">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-xl font-bold">Projects</h2>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {profileData.projects.map((project: Project) => (
                                    <Card key={project.title}>
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

                        <div className="space-y-6 lg:space-y-10">
                            <div className="flex flex-col space-y-2 lg:space-y-4">
                                <h2 className="text-xl font-bold">Friends</h2>
                                {friends.length > 0 ? (
                                    friends.map((friend: string) => (
                                        <div key={friend} className="flex items-center space-x-2">
                                            <img src="/placeholder.svg" width="30" height="30" className="rounded-full" alt="Friend Avatar" />
                                            <p className="text-sm font-semibold">{friend}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No friends yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
