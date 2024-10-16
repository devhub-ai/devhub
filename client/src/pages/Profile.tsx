import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditProfileForm from './EditProfileForm';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import HomeSidebar from '@/components/Sidebar/HomeSidebar';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../lib/store';
import { setFriends, setFriendStatus } from '../lib/userSlice';
import { FaExternalLinkAlt, FaStar, FaCodeBranch } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ProfileProps {
	onLogout: () => void;
	username: string;
}

export interface Tag {
	value: string;
	label: string;
}

// interface Project {
// 	description: string;
// 	repoLink: string;
// 	tags: Tag[];
// 	title: string;
// 	repo?: string;
// 	link?: string;
// 	language?: string;
// 	stars?: number;
// 	forks?: number;
// }

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
	title?: string; // Add this if you still need it
	tags?: Tag[]; // Add this if you still need it
	repoLink?: string; // Add this if you still need it
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
				'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
			)}>
			<HomeSidebar
				onLogout={onLogout}
				username={username}
			/>
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
	// const [streakStats, setStreakStats] = useState<string | null>(null);
	const [streakStat, setStreakStat] = useState<string | null>(null);
	const [pinnedRepos, setPinnedRepos] = useState<Project[]>([]);
	const [leetcodeSvg, setLeetcodeSvg] = useState(null);
	const [githubStreakSvg, setGithubStreakSvg] = useState(null);
	const [githubContributionsSvg, setGithubContributionsSvg] = useState<
		string | null
	>(null);

	useEffect(() => {
		const fetchGithubData = async () => {
			if (profileData?.githubUsername) {
				try {
					const githubResponse = await axios.post(
						`${backendUrl}/analyze/github_data`,
						{
							'github-id': profileData.githubUsername,
						},
					);
					setGithubData(githubResponse.data);

					const languagesResponse = await axios.post(
						`${backendUrl}/analyze/top_languages`,
						{
							'github-id': profileData.githubUsername,
						},
					);
					setLanguages(languagesResponse.data);

					const pinnedReposResponse = await axios.post(
						`${backendUrl}/analyze/pinned_repos`,
						{
							'github-id': profileData.githubUsername,
						},
					);
					setPinnedRepos(pinnedReposResponse.data);

					const streakResponse = await axios.post(
						`${backendUrl}/analyze/streak_chart`,
						{
							'github-id': profileData.githubUsername,
						},
						{ responseType: 'text' },
					);
					setGithubStreakSvg(streakResponse.data);

					const streakStats = await axios.post(
						`${backendUrl}/analyze/streak_stats`,
						{
							'github-id': profileData.githubUsername,
						},
					);
					setStreakStat(streakStats.data);

					const contributionsResponse = await axios.post(
						`${backendUrl}/analyze/contributions_chart`,
						{
							'github-id': profileData.githubUsername,
						},
						{ responseType: 'text' },
					);
					setGithubContributionsSvg(contributionsResponse.data);
				} catch (error) {
					console.error('Failed to fetch GitHub data:', error);
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
							'leetcode-id': profileData.leetcodeUsername,
						},
						{
							responseType: 'text', // Important to get the SVG as text
						},
					);

					setLeetcodeSvg(leetcodeResponse.data);
				} catch (error) {
					console.error('Failed to fetch LeetCode card:', error);
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
					},
				);
				setProfileData(profileResponse.data);

				// Fetch friends data
				const friendsResponse = await axios.get(
					`${backendUrl}/profile/${username}/friends`,
				);
				dispatch(setFriends(friendsResponse.data.friends));

				// Update friend status in Redux
				dispatch(
					setFriendStatus(
						friendsResponse.data.friends.includes(loggedInUsername),
					),
				);
			} catch (error) {
				console.error('Failed to fetch profile or friends data:', error);
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
				: prevData,
		);
	};

	const handleFriendRequest = async () => {
		try {
			if (profileData?.isFriend) {
				await axios.delete(`${backendUrl}/profile/${username}/friends`, {
					data: { friend_username: loggedInUsername },
				});
				setProfileData((prev) => (prev ? { ...prev, isFriend: false } : prev));
				dispatch(
					setFriendStatus({ username: loggedInUsername, isFriend: false }),
				); // Updated to pass an object
			} else {
				await axios.post(`${backendUrl}/profile/${username}/friends`, {
					friend_username: loggedInUsername,
				});
				setProfileData((prev) => (prev ? { ...prev, isFriend: true } : prev));
				dispatch(
					setFriendStatus({ username: loggedInUsername, isFriend: true }),
				); // Updated to pass an object
			}
		} catch (error) {
			console.error('Failed to update friend status:', error);
		}
	};

	if (!username) {
		return <div>Error: No username provided</div>;
	}

	const isOwnProfile = loggedInUsername === username;
	return (
		<div className='flex flex-col w-full h-screen bg-neutral-50 dark:bg-neutral-900 overflow-y-auto'>
			<div className='p-4 md:p-8 flex-grow rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'>
				{editing ? (
					<EditProfileForm onProjectAdded={handleProjectAdded} />
				) : (
					<div className='grid max-w-7xl gap-6 min-h-screen grid-cols-1 lg:grid-cols-[250px_1fr_300px] px-4 lg:px-6 xl:gap-10'>
						{/* Sidebar */}
						<div className='space-y-6 py-6'>
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
							{/* Profile Info Section */}
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
							{/* GitHub and LeetCode Links */}
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
										<a
											href={`https://leetcode.com/${profileData.leetcodeUsername}`}
											target='_blank'
											rel='noopener noreferrer'
											className='text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors'>
											<FaExternalLinkAlt className='inline text-orange-500' />{' '}
											LeetCode
										</a>
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
							{/* Connect Button */}
							<Button
								className='w-full mt-4'
								onClick={
									isOwnProfile ? () => setEditing(true) : handleFriendRequest
								}>
								{isOwnProfile
									? 'Update Profile'
									: profileData?.isFriend
									? 'Disconnect'
									: 'Connect'}
							</Button>
						</div>

						{/* Main Content Section */}
						<div className='space-y-6 col-span-2'>
							{/* Friends Section */}
							<div className='space-y-6'>
								<h2 className='text-xl font-bold'>Friends</h2>
								{friends.length > 0 ? (
									friends.map((friend, index) => (
										<div key={index}>
											<a
												href={`${backendUrl}/u/${friend}`}
												className='font-semibold'>
												{friend}
											</a>
										</div>
									))
								) : (
									<>No friends</>
								)}
							</div>
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

								<h2 className='text-xl font-bold'>LeetCode Stats</h2>
								{leetcodeSvg ? (
									<div
										className='overflow-x-auto'
										dangerouslySetInnerHTML={{ __html: leetcodeSvg }}
									/>
								) : (
									<Skeleton className='h-48 w-full' />
								)}
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
				)}
			</div>
		</div>
	);
};

export default Profile;
