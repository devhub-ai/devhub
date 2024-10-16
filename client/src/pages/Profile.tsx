import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditProfileForm from "./EditProfileForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../lib/store";
import { setFriends, setFriendStatus } from "../lib/userSlice";
import { FaExternalLinkAlt } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export interface Tag {
  value: string;
  label: string;
}

interface Project {
  description: string;
  repoLink: string;
  tags: Tag[];
  title: string;
  repo?: string;
  link?: string;
  language?: string;
  stars?: number;
  forks?: number;
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

interface GitHubData {
  avatar_url: string;
  name: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
}

interface Language {
  language: string;
  percentage: string;
}

// const Profile = () => {
//   const { username } = useParams<{ username: string }>();
//   return (
    
//   );
// };

interface DashboardProps {
  username: string;
}

const Profile: React.FC<DashboardProps> = ({ username }) => {
  const dispatch = useDispatch<AppDispatch>();
  const friends = useSelector((state: RootState) => state.user.friends);
  const loggedInUsername = useSelector((state: RootState) => state.auth.username);
  const [profileData, setProfileData] = useState<UserResponse>();
  const [editing, setEditing] = useState(false);
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [streakStats, setStreakStats] = useState<string | null>(null);
  const [pinnedRepos, setPinnedRepos] = useState<Project[]>([]);
  const [leetcodeSvg, setLeetcodeSvg] = useState(null);
  const [githubStreakSvg, setGithubStreakSvg] = useState(null);

  useEffect(() => {
    const fetchGithubData = async () => {
      if (profileData?.githubUsername) {
        try {
          const githubResponse = await axios.post(
            `${backendUrl}/analyze/github_data`,
            {
              "github-id": profileData.githubUsername,
            }
          );
          setGithubData(githubResponse.data);

          const languagesResponse = await axios.post(
            `${backendUrl}/analyze/top_languages`,
            {
              "github-id": profileData.githubUsername,
            }
          );
          setLanguages(languagesResponse.data);
          console.log("languagesResponse", languagesResponse);

          const streakResponse = await axios.post(
            `${backendUrl}/analyze/streak_stats`,
            {
              "github-id": profileData.githubUsername,
            }
          );
          setStreakStats(streakResponse.data);

          const pinnedReposResponse = await axios.post(
            `${backendUrl}/analyze/pinned_repos`,
            {
              "github-id": profileData.githubUsername,
            }
          );
          setPinnedRepos(pinnedReposResponse.data);

          const fetchGithubStreakChart = async () => {
            if (profileData?.githubUsername) {
              try {
                const githubResponse = await axios.post(
                  `${backendUrl}/analyze/streak_chart`,
                  {
                    "github-id": profileData.githubUsername,
                  },
                  {
                    responseType: "text", // Get the SVG as text
                  }
                );
                setGithubStreakSvg(githubResponse.data);
              } catch (error) {
                console.error("Failed to fetch GitHub streak chart:", error);
              }
            }
          };
          fetchGithubStreakChart();
        } catch (error) {
          console.error("Failed to fetch GitHub data:", error);
        }
      }
    };

    fetchGithubData();
  }, [profileData]);

  useEffect(() => {
    const fetchLeetcodeCard = async () => {
      if (profileData?.leetcodeUsername) {
        try {
          const leetcodeResponse = await axios.post(
            `${backendUrl}/analyze/leetcode_card`,
            {
              "leetcode-id": profileData.leetcodeUsername,
            },
            {
              responseType: "text", // Important to get the SVG as text
            }
          );

          setLeetcodeSvg(leetcodeResponse.data);
        } catch (error) {
          console.error("Failed to fetch LeetCode card:", error);
        }
      }
    };

    fetchLeetcodeCard();
  }, [profileData]);

  useEffect(() => {
    const fetchProfileAndFriends = async () => {
      try {
        // Fetch profile data
        const profileResponse = await axios.get(
          `${backendUrl}/profile/${username}`,
          {
            params: { logged_in_user: loggedInUsername },
          }
        );
        setProfileData(profileResponse.data);

        // Fetch friends data
        const friendsResponse = await axios.get(
          `${backendUrl}/profile/${username}/friends`
        );
        dispatch(setFriends(friendsResponse.data.friends));

        // Update friend status in Redux
        dispatch(
          setFriendStatus(
            friendsResponse.data.friends.includes(loggedInUsername)
          )
        );
      } catch (error) {
        console.error("Failed to fetch profile or friends data:", error);
      }
    };

    if (username) {
      fetchProfileAndFriends();
    }
  }, [username, loggedInUsername, dispatch]);

  const handleProjectAdded = (newProject: Project) => {
    setProfileData((prevData) =>
      prevData
        ? {
          ...prevData,
          projects: [...prevData.projects, newProject],
        }
        : prevData
    );
  };

  const handleFriendRequest = async () => {
    try {
      if (profileData?.isFriend) {
        await axios.delete(`${backendUrl}/profile/${username}/friends`, {
          data: { friend_username: loggedInUsername },
        });
        setProfileData((prev) => (prev ? { ...prev, isFriend: false } : prev));
        dispatch(setFriendStatus({ username: loggedInUsername, isFriend: false })); // Updated to pass an object
      } else {
        await axios.post(`${backendUrl}/profile/${username}/friends`, {
          friend_username: loggedInUsername,
        });
        setProfileData((prev) => (prev ? { ...prev, isFriend: true } : prev));
        dispatch(setFriendStatus({ username: loggedInUsername, isFriend: true })); // Updated to pass an object
      }
    } catch (error) {
      console.error("Failed to update friend status:", error);
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
                {githubData ? (
                  <img
                    src={githubData.avatar_url}
                    width="150"
                    height="150"
                    className="rounded-full"
                    alt="Avatar"
                  />
                ) : (
                  <img
                    src="/placeholder.svg"
                    width="150"
                    height="150"
                    className="rounded-full"
                    alt="Avatar"
                  />
                )}

                <div className="text-center">
                  <h1 className="text-xl font-bold">{profileData.name}</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{profileData.username}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Bio</p>
                <p>{profileData.bio || "This user hasn't added a bio yet."}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Top Languages</p>
                {languages.length > 0 ? (
                  languages.map((lang) => (
                    <p key={lang.language}>
                      {lang.language}: {lang.percentage}%
                    </p>
                  ))
                ) : (
                  <p>No languages data available.</p>
                )}
              </div>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">Pinned Projects</h2>
                </CardHeader>
                <CardContent>
                  {pinnedRepos.length > 0 ? (
                    pinnedRepos.map((project) => (
                      <div key={project.repoLink} className="mb-4">
                        <h3 className="text-lg font-bold">{project.title}</h3>
                        <p>{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs bg-gray-200 rounded dark:bg-neutral-700"
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                        {project.repoLink && (
                          <a
                            href={project.repoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center mt-2 text-blue-600 dark:text-blue-400"
                          >
                            GitHub Repo <FaExternalLinkAlt className="ml-1" />
                          </a>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No pinned projects available.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">GitHub Streak</h2>
                </CardHeader>
                <CardContent>
                  {githubStreakSvg ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: githubStreakSvg }}
                    />
                  ) : (
                    <p>No streak data available.</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">LeetCode Stats</h2>
                </CardHeader>
                <CardContent>
                  {leetcodeSvg ? (
                    <div dangerouslySetInnerHTML={{ __html: leetcodeSvg }} />
                  ) : (
                    <p>No LeetCode stats available.</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">Friend Status</h2>
                </CardHeader>
                <CardContent>
                  {isOwnProfile ? (
                    <p>You can't add yourself as a friend.</p>
                  ) : (
                    <Button onClick={handleFriendRequest} variant="primary">
                      {profileData.isFriend
                        ? "Remove Friend"
                        : "Add Friend"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
