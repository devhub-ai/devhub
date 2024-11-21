import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../lib/store';
import { setFriendStatus } from '../lib/userSlice';
import { Skeleton } from '@/components/ui/skeleton';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { SidebarLeft } from '@/components/Sidebar/Sidebar'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Copy, Check,Github, Code, Mail, Eye, MessageSquare, PenLine, Plus, Search, Verified } from 'lucide-react'
import BannerUpdate from '@/components/Settings/BannerUpdate';
import { FaExternalLinkAlt, FaStar, FaCodeBranch } from 'react-icons/fa';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export interface Tag {
	value: string;
	label: string;
}
interface Project {
	owner: string;
	repo: string;
	link: string;
	description: string;
	image: string;
	website: string[];
	language: string;
	languageColor: string;
	stars: number;
	forks: number;
	title?: string;
	tags?: Tag[];
	repoLink?: string;
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
	profileImage: string;
	profileBanner: string;
	location : string;
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

const Profile = () => {

	return (
		<SidebarProvider>
			<SidebarLeft />
			<SidebarInset>
				<header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
					<div className="flex flex-1 items-center gap-2 px-3">
						<SidebarTrigger />
					</div>
				</header>
				<main className="flex flex-col flex-grow p-4 overflow-hidden">
					<Dashboard />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);

};

const Dashboard = () => {
	const { username } = useParams();
	const dispatch = useDispatch<AppDispatch>();
	const loggedInUsername = localStorage.getItem('devhub_username');
	const [profileData, setProfileData] = useState<UserResponse | null>(null);
	const [githubData, setGithubData] = useState<GitHubData | null>(null);
	const [languages, setLanguages] = useState<Language[]>([]);
	const [streakStat, setStreakStat] = useState<string | null>(null);
	const [pinnedRepos, setPinnedRepos] = useState<Project[]>([]);
	const [githubStreakSvg, setGithubStreakSvg] = useState<string | null>(null);
	const [isFriend, setIsFriend] = useState<boolean>(false);  
	const [friends, setFriendsList] = useState<string[]>([]);
	const [copied, setCopied] = useState(false)

	useEffect(() => {
		if (username) {
			const fetchProfileAndFriends = async () => {
				try {
					const profileResponse = await axios.get(`${backendUrl}/profile/${username}`);
					setProfileData(profileResponse.data);

					const friendsResponse = await axios.get(`${backendUrl}/profile/${username}/friends`);
					setFriendsList(friendsResponse.data.friends);

					const loggedInFriendsResponse = await axios.get(`${backendUrl}/profile/${loggedInUsername}/friends`);
					const isFriendOfProfileUser = loggedInFriendsResponse.data.friends.includes(username);
					setIsFriend(isFriendOfProfileUser);
					dispatch(setFriendStatus({ username, isFriend: isFriendOfProfileUser }));
				} catch (error) {
					console.error('Failed to fetch profile or friends data:', error);
				}
			};

			fetchProfileAndFriends();
		}
	}, [username, loggedInUsername, dispatch]);

	useEffect(() => {
		if (profileData?.githubUsername) {
			const fetchGithubData = async () => {
				try {
					const githubResponse = await axios.post(`${backendUrl}/analyze/github_data`, { 'github-id': profileData.githubUsername });
					setGithubData(githubResponse.data);

					const languagesResponse = await axios.post(`${backendUrl}/analyze/top_languages`, { 'github-id': profileData.githubUsername });
					setLanguages(languagesResponse.data);

					const pinnedReposResponse = await axios.post(`${backendUrl}/analyze/pinned_repos`, { 'github-id': profileData.githubUsername });
					setPinnedRepos(pinnedReposResponse.data);

					const streakResponse = await axios.post(`${backendUrl}/analyze/streak_chart`, { 'github-id': profileData.githubUsername }, { responseType: 'text' });
					setGithubStreakSvg(streakResponse.data);

					const streakStats = await axios.post(`${backendUrl}/analyze/streak_stats`, { 'github-id': profileData.githubUsername });
					setStreakStat(streakStats.data);
				} catch (error) {
					console.error('Failed to fetch GitHub data:', error);
				}
			};

			fetchGithubData();
		}
	}, [profileData]);

	const copyToClipboard = async () => {
		try {
			if (profileData?.username) {
				await navigator.clipboard.writeText(`https://www.devhub.page/user/${profileData.username}`);
			}
			setCopied(true)
			setTimeout(() => setCopied(false), 2000) 
		} catch (err) {
			console.error('Failed to copy text: ', err)
		}
	}

	const handleFriendRequest = async () => {
		try {
			if (isFriend) {
				await axios.delete(`${backendUrl}/profile/${profileData?.username}/friends`, { data: { friend_username: loggedInUsername } });
				setIsFriend(false);
				if (username) {
					dispatch(setFriendStatus({ username, isFriend: false }));
				}
			} else {
				await axios.post(`${backendUrl}/profile/${profileData?.username}/friends`, { friend_username: loggedInUsername });
				setIsFriend(true);
				if (username) {
					dispatch(setFriendStatus({ username, isFriend: true }));
				}
			}

			const friendsResponse = await axios.get(`${backendUrl}/profile/${username}/friends`);
			setFriendsList(friendsResponse.data.friends);
		} catch (error) {
			console.error('Failed to update friend status:', error);
		}
	};

	if (!username) {
		return <div>Error: No username provided in the URL.</div>;
	}

	const isOwnProfile = loggedInUsername === username;

	return (
		<div className="bg-background">
			<div className="grid gap-6 p-4 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_400px] max-w-7xl mx-auto">
				<div className="space-y-6">

					<Card>
						<div className="relative">
							<div>
								{profileData?.profileBanner ? (
									<img
										src={profileData.profileBanner}
										alt="profile_banner"
										className='h-48 rounded-t-lg w-full object-cover'
									/>
								) : (
									<div className="h-48 bg-gradient-to-r from-gray-700 to-gray-900 rounded-t-lg" />
								)}
							</div>
							<div className="absolute -bottom-12 left-4">
								<div className="relative">
									{profileData?.profileImage ? (
										<Avatar className="w-32 h-32 border-4 border-background">
											<AvatarImage alt="Profile picture" src={profileData.profileImage} />
											<AvatarFallback>{profileData.name}</AvatarFallback>
										</Avatar>

									) : (
										<Avatar className="w-32 h-32 border-4 border-background">

											<AvatarFallback>{profileData?.username}</AvatarFallback>
										</Avatar>
									)}
									<Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
										<Plus className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<AlertDialog>
								<AlertDialogTrigger className="w-[120px] ml-5 ">
									<Button size="icon" variant="ghost" className="absolute top-4 right-4">
										<PenLine className="h-4 w-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<div className='flex items-center'>
										<AlertDialogHeader className='text-2xl'>Add Banner</AlertDialogHeader>
										<div className='flex-grow'></div>
										<AlertDialogCancel><Cross1Icon className='h-3 w-3' /></AlertDialogCancel>
									</div>
									<AlertDialogDescription>
										<BannerUpdate />
									</AlertDialogDescription>
								</AlertDialogContent>
							</AlertDialog>

						</div>
						<div className="pt-16 space-y-4 p-4">
							<div className="flex items-center gap-2">
								<span className="text-sm text-muted-foreground">
									{profileData ? `@${profileData.username}` : <Skeleton className="h-4 w-24" />}
								</span>
								<Button variant="outline" size="sm" className="gap-1">
									<Verified className="h-4 w-4" />
									Add verification badge
								</Button>
								<div className='flex-grow'>
								</div>
								{!isOwnProfile && (
									<Button onClick={handleFriendRequest}>
										{isFriend ? 'Disconnect' : 'Connect'}
									</Button>
								)}
							</div>
							<h1 className="text-2xl font-bold">
								{profileData ? profileData.name : <Skeleton className="h-8 w-48" />}
							</h1>
							<p className="text-sm text-muted-foreground">
								{profileData ? profileData.bio : <Skeleton className="h-16 w-full" />}
							</p>
							<div className="flex flex-wrap gap-2">
								{profileData ? (
									<>
										<Button variant="outline">
											<Mail className="mr-2 h-4 w-4" />
											{profileData.email}
										</Button>
										{profileData.location ? (
											<Button
												variant="outline"
											>
												<MapPin className="mr-2 h-4 w-4" />
												{profileData.location}
											</Button>
										) : (
											<></>
										)}
										{profileData.githubUsername ? (
											<Button
												variant="outline"
												onClick={() => window.open(`https://github.com/${profileData.githubUsername}`, '_blank')}
											>
												<Github className="mr-2 h-4 w-4" />
												GitHub
											</Button>
										) : (
											<></>
										)}
										{profileData.leetcodeUsername ? (
											<Button
												variant="outline"
												onClick={() => window.open(`https://leetcode.com/${profileData.leetcodeUsername}`, '_blank')}
											>
												<Code className="mr-2 h-4 w-4" />
												LeetCode
											</Button>
										) : (
											<></>
										)}
										
									</>
								) : (
									<>
										<Skeleton className="h-10 w-[200px]" />
										<Skeleton className="h-10 w-[100px]" />
										<Skeleton className="h-10 w-[100px]" />
									</>
								)}
							</div>
						</div>
					</Card>

					{/* Analytics */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Analytics</CardTitle>

						</CardHeader>
						<CardContent className="grid gap-6 sm:grid-cols-3">
							<div className="flex gap-4">
								<Eye className="h-6 w-6 text-muted-foreground" />
								<div>
									<div className="font-semibold">97 profile views</div>
									<p className="text-sm text-muted-foreground">Discover who&apos;s viewed your profile</p>
								</div>
							</div>
							<div className="flex gap-4">
								<MessageSquare className="h-6 w-6 text-muted-foreground" />
								<div>
									<div className="font-semibold">90 post impressions</div>
									<p className="text-sm text-muted-foreground">Check out who&apos;s engaging with your posts</p>
								</div>
							</div>
							<div className="flex gap-4">
								<Search className="h-6 w-6 text-muted-foreground" />
								<div>
									<div className="font-semibold">13 search appearances</div>
									<p className="text-sm text-muted-foreground">See how often you appear in search results</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{
						githubData ? (
							<>
								{/* Top Languages */}
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Top Languages</CardTitle>
									</CardHeader>
									<CardContent>
										{languages.length > 0 ? (
											<div className="flex flex-wrap gap-2">
												{languages.map((lang, index) => (
													<Badge key={index} variant="secondary">
														{lang.language}: {lang.percentage}
													</Badge>
												))}
											</div>
										) : (
											<div className="flex flex-wrap gap-2">
												{[1, 2, 3].map((i) => (
													<Skeleton key={i} className="h-6 w-20 rounded-full" />
												))}
											</div>
										)}
									</CardContent>
								</Card>
								{/* GitHub Stats */}
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">GitHub Stats</CardTitle>
									</CardHeader>
									<CardContent className="space-y-8">
										<div>
											<h3 className="font-semibold mb-2">GitHub Streak Stats</h3>
											{streakStat ? (
													<div
														dangerouslySetInnerHTML={{ __html: streakStat }}
														className="overflow-x-auto"
													/>
											) : (
												<></>
											)}
										</div>
										<div>
											<h3 className="font-semibold mb-2">GitHub Streak</h3>
											{githubStreakSvg ? (
													<div
														dangerouslySetInnerHTML={{ __html: githubStreakSvg }}
														className="overflow-x-auto"
													/>
											) : (
												<></>
											)}
										</div>
									</CardContent>
								</Card>

								{/* Pinned Repositories */}
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Pinned Repositories</CardTitle>
									</CardHeader>
									<CardContent>
										{pinnedRepos.length > 0 ? (
											<div className="grid gap-4 sm:grid-cols-2">
												{pinnedRepos.map((repo, index) => (
													<Card key={index} className="overflow-hidden">
														<CardHeader>
															<CardTitle className="text-base">{repo.repo.trim()}</CardTitle>
															<p className="text-sm text-muted-foreground">{repo.owner}</p>
														</CardHeader>
														<CardContent>
															<p className="text-sm text-muted-foreground mb-2 h-12 overflow-hidden">
																{repo.description}
															</p>
															<div className="flex items-center space-x-4 text-sm mb-2">
																{repo.language && (
																	<span className="flex items-center">
																		<span
																			className="w-3 h-3 rounded-full mr-1"
																			style={{ backgroundColor: repo.languageColor }}
																		/>
																		{repo.language}
																	</span>
																)}
																<span className="flex items-center">
																	<FaStar className="mr-1" /> {repo.stars}
																</span>
																<span className="flex items-center">
																	<FaCodeBranch className="mr-1" /> {repo.forks}
																</span>
															</div>
															<div className="flex justify-between items-center">
																<Button variant="link" asChild>
																	<a href={repo.link} target="_blank" rel="noopener noreferrer">
																		View Repository <FaExternalLinkAlt className="ml-1" />
																	</a>
																</Button>
																{repo.website && repo.website.length > 0 && (
																	<Button variant="link" asChild>
																		<a href={repo.website[0]} target="_blank" rel="noopener noreferrer">
																			Live Demo <FaExternalLinkAlt className="ml-1" />
																		</a>
																	</Button>
																)}
															</div>
														</CardContent>
													</Card>
												))}
											</div>
										) : (
											<Skeleton className="h-32 w-full" />
										)}
									</CardContent>
								</Card>
							</>
						) : (<></>)
					}


					
				</div>

				{/* Right Sidebar */}
				<div className="space-y-6">
					{/* <Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="text-lg">Profile language</CardTitle>
							<Button size="icon" variant="ghost">
								<PenLine className="h-4 w-4" />
							</Button>
						</CardHeader>
						<CardContent>
							<p>English</p>
						</CardContent>
					</Card> */}

					<Card>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="text-lg">Public profile & URL</CardTitle>
							<Button size="icon" variant="ghost" onClick={copyToClipboard}>
								{copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
							</Button>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground break-all">
								{`https://www.devhub.page/user/${profileData?.username}`}
							</p>
						</CardContent>
					</Card>


					{/* Friends */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Friends</CardTitle>
						</CardHeader>
						<CardContent>
							{friends.length > 0 ? (
								friends.map((friend, index) => (
									<div key={index} className="flex items-center gap-2 mb-2">
										<Avatar>
											<AvatarImage alt={friend} src="/placeholder.svg" />
											<AvatarFallback>{friend[0]}</AvatarFallback>
										</Avatar>
										<a href={`https://www.devhub.page/user/${friend}`}><span>{friend}</span></a>
									</div>
								))
							) : (
								<p className="text-muted-foreground">No friends yet</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div >
	);
}
export default Profile;


