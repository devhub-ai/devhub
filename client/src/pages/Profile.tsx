import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditProfileForm from './EditProfileForm'; 
import { Button } from "@/components/ui/button";


const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Profile: React.FC = () => {
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

    if (!username) {
        return <div>Error: No username provided</div>;
    }

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{profileData.username}'s Profile</h1>
            {editing ? (
                <EditProfileForm /> // Render the EditProfileForm when in editing mode
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
        </div>
    );
};

export default Profile;
