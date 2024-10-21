import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Projects from "./Projects";
import GitHubStats from "./GitHubStats";
import PinnedRepositories from "./PinnedRepositories";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../lib/store";
import { setFriendStatus } from "../lib/userSlice";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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

const Dashboard = () => {
  const { username } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const loggedInUsername = localStorage.getItem("devhub_username");
  const [profileData, setProfileData] = useState<UserResponse | null>(null);
  const [isFriend, setIsFriend] = useState<boolean>(false);

  useEffect(() => {
    if (username) {
      const fetchProfile = async () => {
        try {
          const profileResponse = await axios.get(`${backendUrl}/profile/${username}`);
          setProfileData(profileResponse.data);

          const loggedInFriendsResponse = await axios.get(`${backendUrl}/profile/${loggedInUsername}/friends`);
          const isFriendOfProfileUser = loggedInFriendsResponse.data.friends.includes(username);
          setIsFriend(isFriendOfProfileUser);
          dispatch(setFriendStatus({ username, isFriend: isFriendOfProfileUser }));
        } catch (error) {
          console.error("Failed to fetch profile data:", error);
        }
      };
      fetchProfile();
    }
  }, [username, loggedInUsername, dispatch]);

  if (!username) {
    return <div>Error: No username provided in the URL.</div>;
  }

  const isOwnProfile = loggedInUsername === username;

  return (
    <div className="grid gap-6 min-h-screen grid-cols-1 lg:grid-cols-[350px_1fr_300px] lg:px-6 xl:gap-10 w-full">
      <Sidebar profileData={profileData} isFriend={isFriend} isOwnProfile={isOwnProfile} />
      <div className="col-span-2 space-y-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-zinc-900 p-4">
        <Projects projects={profileData?.projects || []} username={username} />
        <GitHubStats githubUsername={profileData?.githubUsername || ""} />
        <PinnedRepositories githubUsername={profileData?.githubUsername || ""} />
      </div>
    </div>
  );
};

export default Dashboard;
