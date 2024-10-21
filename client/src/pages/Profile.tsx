import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../lib/store';
import { setFriendStatus } from '../lib/userSlice';
import { FaExternalLinkAlt, FaStar, FaCodeBranch } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarLeft } from '@/components/Sidebar/Sidebar'

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
	const [isFriend, setIsFriend] = useState<boolean>(false);  // State for friend status
	const [friends, setFriendsList] = useState<string[]>([]);

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
		<div className='flex flex-col w-full h-screen bg-neutral-50 p-4 overflow-y-auto bg-white dark:bg-zinc-950'>
			<div className='grid gap-6 min-h-screen grid-cols-1 lg:grid-cols-[350px_1fr_300px] lg:px-6 xl:gap-10 w-full'>
				<div className='space-y-6 py-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-zinc-900 px-2 '>
					<div className='flex flex-col items-center space-y-3'>
						{githubData ? (
							<img
								src={githubData.avatar_url}
								width='150'
								height='150'
								className='rounded-full shadow-md hover:shadow-lg transition-shadow'
								alt='Avatar'
							/>
						) : (
							<Skeleton className='w-[150px] h-[150px] rounded-full' />
						)}
						<div className='text-center'>
							<h1 className='text-xl font-bold'>
								{profileData ? (
									profileData.name
								) : (
									<Skeleton className='h-6 w-24' />
								)}
							</h1>
							<p className='text-sm text-gray-500 dark:text-gray-400'>
								{profileData ? (
									`@${profileData.username}`
								) : (
									<Skeleton className='h-4 w-20' />
								)}
							</p>
						</div>
					</div>
					<div className='space-y-4'>
						<div className='space-y-2'>
							<p className='font-semibold'>Bio</p>
							{profileData ? (
								<p className='text-sm text-gray-500 dark:text-gray-400'>
									{profileData.bio}
								</p>
							) : (
								<Skeleton className='h-16 w-full' />
							)}
						</div>

						<div className='space-y-2'>
							<p className='font-semibold'>Email</p>
							{profileData ? (
								<p className='text-sm text-gray-500 dark:text-gray-400'>
									{profileData.email}
								</p>
							) : (
								<Skeleton className='h-4 w-40' />
							)}
						</div>
					</div>
					<div className='flex space-x-4'>
						{profileData ? (
							<>
								<a
									href={`https://github.com/${profileData.githubUsername}`}
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors'>
									<FaExternalLinkAlt className='inline text-blue-500' />{' '}
									GitHub
								</a>
								{/* <a
									href={`https://leetcode.com/${profileData.leetcodeUsername}`}
									target='_blank'
									rel='noopener noreferrer'
									className='text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors'>
									<FaExternalLinkAlt className='inline text-orange-500' />{' '}
									LeetCode
								</a> */}
							</>
						) : (
							<>
								<Skeleton className='h-6 w-20' />
								<Skeleton className='h-6 w-20' />
							</>
						)}
					</div>

					<div className='space-y-4'>
						<h2 className='text-sm font-bold'>Top Languages</h2>
						{languages.length > 0 ? (
							<div className='flex flex-wrap gap-2'>
								{languages.map((lang, index) => (
									<span
										key={index}
										className='bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium'>
										{lang.language}: {lang.percentage}
									</span>
								))}
							</div>
						) : (
							<div className='flex flex-wrap gap-2'>
								{[1, 2, 3].map((i) => (
									<Skeleton
										key={i}
										className='h-6 w-20 rounded-full'
									/>
								))}
							</div>
						)}
					</div>

					{!isOwnProfile && (
						<button onClick={handleFriendRequest} className="bg-blue-500 text-white rounded py-2 px-4">
							{isFriend ? 'Disconnect' : 'Connect'}
						</button>
					)}

					<div>
						<h2 className='text-xl font-bold'>Friends</h2>
						{friends.length > 0 ? (
							friends.map((friend, index) => (
								<div key={index}>{friend}</div>
							))
						) : (
							<p>No friends</p>
						)}
					</div>
				</div>

				<div className='space-y-6 col-span-2 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-zinc-900 p-4'>
					<h2 className='text-xl font-bold'>Projects</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						{profileData ? (
							profileData.projects.map((project, index) => (
								<Card
									key={index}
									className='p-4 rounded-lg shadow transition-transform hover:translate-y-[-2px]'>
									<CardHeader className='mb-2'>
										<h3 className='font-semibold'>{project.title}</h3>
										<p className='text-xs text-gray-500'>
											@{profileData.username}
										</p>
									</CardHeader>
									<CardContent>
										<p>{project.description}</p>
									</CardContent>
								</Card>
							))
						) : (
							<>
								<Skeleton className='h-32 w-full' />
								<Skeleton className='h-32 w-full' />
							</>
						)}
					</div>

					{/* GitHub Stats */}
					<div className='space-y-8'>
						<h2 className='text-xl font-bold'>GitHub Streak Stats</h2>
						{streakStat ? (
							<div
								className='overflow-x-auto'
								dangerouslySetInnerHTML={{ __html: streakStat }}
							/>
						) : (
							<Skeleton className='h-48 w-full' />
						)}

						<h2 className='text-xl font-bold'>GitHub Streak</h2>
						{githubStreakSvg ? (
							<div
								className='overflow-x-auto'
								dangerouslySetInnerHTML={{ __html: githubStreakSvg }}
							/>
						) : (
							<Skeleton className='h-48 w-full' />
						)}

						{/* <h2 className='text-xl font-bold'>LeetCode Stats</h2>
							{leetcodeSvg ? (
								<div
									className='overflow-x-auto'
									dangerouslySetInnerHTML={{ __html: leetcodeSvg }}
								/>
							) : (
								<Skeleton className='h-48 w-full' />
							)} */}
					</div>

					<div className='space-y-4'>
						<h2 className='text-sm font-bold'>Pinned Repositories</h2>
						{pinnedRepos.length > 0 ? (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								{pinnedRepos.map((repo, index) => (
									<Card
										key={index}
										className='hover:shadow-lg transition-shadow overflow-hidden'>
										{/* <div
													className='h-32 bg-cover bg-center'
													style={{ backgroundImage: `url(${repo.image})` }}
												/> */}
										<CardHeader>
											<h3 className='text-lg font-semibold truncate'>
												{repo.repo.trim()}
											</h3>
											<p className='text-sm text-gray-500 dark:text-gray-400'>
												{repo.owner}
											</p>
										</CardHeader>
										<CardContent>
											<p className='text-sm text-gray-600 dark:text-gray-300 mb-2 h-12 overflow-hidden'>
												{repo.description}
											</p>
											<div className='flex items-center space-x-4 text-sm mb-2'>
												{repo.language && (
													<span className='flex items-center'>
														<span
															className='w-3 h-3 rounded-full mr-1'
															style={{
																backgroundColor: repo.languageColor,
															}}
														/>
														{repo.language}
													</span>
												)}
												<span className='flex items-center'>
													<FaStar className='mr-1' /> {repo.stars}
												</span>
												<span className='flex items-center'>
													<FaCodeBranch className='mr-1' /> {repo.forks}
												</span>
											</div>
											<div className='flex justify-between items-center'>
												<a
													href={repo.link}
													target='_blank'
													rel='noopener noreferrer'
													className='text-blue-500 hover:underline inline-flex items-center'>
													View Repository{' '}
													<FaExternalLinkAlt className='ml-1' />
												</a>
												{repo.website && repo.website.length > 0 && (
													<a
														href={repo.website[0]}
														target='_blank'
														rel='noopener noreferrer'
														className='text-green-500 hover:underline inline-flex items-center'>
														Live Demo <FaExternalLinkAlt className='ml-1' />
													</a>
												)}
											</div>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<Skeleton className='h-32 w-full' />
						)}
					</div>
				</div>
			</div>

		</div>
	);
}
export default Profile;