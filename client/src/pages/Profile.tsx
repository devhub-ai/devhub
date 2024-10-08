import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EditProfileForm from "./EditProfileForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import HomeSidebar from "@/components/Sidebar/HomeSidebar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../lib/store";
import { setFriends, setFriendStatus } from "../lib/userSlice";
import { FaExternalLinkAlt } from "react-icons/fa";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface ProfileProps {
  onLogout: () => void;
  username: string;
}

interface Project {
  description: string;
  repoLink: string;
  tags: string[];
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

// interface LeetCodeData {
//   totalSolved: number;
//   totalSubmissions: number;
//   totalQuestions: number;
//   easySolved: number;
//   totalEasy: number;
//   mediumSolved: number;
//   totalMedium: number;
//   hardSolved: number;
//   totalHard: number;
//   ranking: number;
//   contributionPoint: number;
//   reputation: number;
//   submissionCalendar: string;
//   recentSubmissions: {
//     title: string;
//     titleSlug: string;
//     timestamp: string;
//     statusDisplay: string;
//     lang: string;
//   }[];
// }

const Profile: React.FC<ProfileProps> = ({ onLogout, username }) => {
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden"
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
  const dispatch = useDispatch<AppDispatch>();
  const friends = useSelector((state: RootState) => state.user.friends);
  // const friendStatus = useSelector(
  //   (state: RootState) => state.user.friendStatus
  // );
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
              {/* <div className="space-y-2">
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
                            </div> */}

              <div className="flex space-x-6">
                <a
                  href={`https://github.com/${profileData.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200"
                >
                  <FaExternalLinkAlt className="text-blue-500" />
                  <span className="font-semibold">GitHub</span>
                </a>
                <a
                  href={`https://leetcode.com/${profileData.leetcodeUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1 hover:text-orange-500 transition-colors duration-200"
                >
                  <FaExternalLinkAlt className="text-orange-500" />
                  <span className="font-semibold">LeetCode</span>
                </a>
              </div>
              <div className="space-y-2 lg:space-y-4">
                <h2 className="text-sl font-bold">Top Languages</h2>
                {languages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {lang.language}: {lang.percentage}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p>Loading languages...</p>
                )}
              </div>

              <div className="space-y-2 lg:space-y-4">
                {streakStats ? (
                  <div dangerouslySetInnerHTML={{ __html: streakStats }} />
                ) : (
                  <p>Loading streak stats...</p>
                )}
              </div>

              {!isOwnProfile && (
                <Button className="w-full" onClick={handleFriendRequest}>
                  {profileData.isFriend ? "Disconnect" : "Connect"}
                </Button>
              )}

              {isOwnProfile && (
                <Button className="w-full" onClick={() => setEditing(true)}>
                  Update Profile
                </Button>
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
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            @{profileData.username}
                          </div>
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
                        <a
                          href={`${backendUrl}/u/${friend}`}
                          className="text-sm font-semibold"
                        >
                          {friend}
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No friends yet
                    </p>
                  )}
                </div>

              <div className="space-y-6 lg:space-y-10">
                {leetcodeSvg ? (
                  <div dangerouslySetInnerHTML={{ __html: leetcodeSvg }} />
                ) : (
                  <p>Loading LeetCode data...</p>
                )}
              </div>

              {githubData ? (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">GitHub Profile Summary</h2>

                  <div className="flex items-center space-x-6">
                    <div className="flex-1 text-center">
                      <p className="font-semibold">{githubData.public_repos}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Repositories
                      </p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-semibold">{githubData.followers}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Followers
                      </p>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="font-semibold">{githubData.following}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Following
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Loading GitHub data...</p>
              )}
              {githubStreakSvg ? (
                <div dangerouslySetInnerHTML={{ __html: githubStreakSvg }} />
              ) : (
                <p>Loading GitHub streak chart...</p>
              )}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold">Pinned Repositories:</h2>
          {pinnedRepos.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {pinnedRepos.map((repo, index) => (
                <a
                  key={index}
                  href={repo.repoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-card p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-transform transform hover:translate-y-[-2px]"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <h6 className="text-gray-700 dark:text-gray-300">
                        {repo.repo}
                      </h6>
                    </div>
                    <a
                      href={repo.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <img
                        src="../../src/assets/open.svg"
                        alt="Open in new tab"
                        className="w-5 h-5 cursor-pointer"
                      />
                    </a>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {repo.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {repo.description}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center space-x-2">
                      <span className="dot" />
                      <h6 className="text-sm text-gray-700 dark:text-gray-300">
                        {repo.language}
                      </h6>

                      {repo.stars && (
                        <div className="flex items-center space-x-1">
                          <img
                            src="../../src/assets/star.svg"
                            alt="Star"
                            className="w-4 h-4"
                          />
                          <h6 className="text-sm text-gray-700 dark:text-gray-300">
                            {repo.stars}
                          </h6>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-4">
                      {repo.forks != null && repo.forks > 0 && (
                        <div className="flex items-center space-x-1">
                          <img
                            src="../../src/assets/fork.svg"
                            alt="Fork"
                            className="w-4 h-4"
                          />
                          <h6 className="text-sm text-gray-700 dark:text-gray-300">
                            {repo.forks}
                          </h6>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p>No pinned repositories found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
