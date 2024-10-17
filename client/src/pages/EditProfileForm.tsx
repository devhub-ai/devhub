import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TagInput from '@/components/MultiSelect/TagInput';
import { toast } from 'sonner';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Tag {
	value: string;
	label: string;
}

interface Project {
	id?: number;
	title: string;
	description: string;
	repoLink: string;
	tags: Tag[];
}

interface ProfileData {
	name: string;
	bio: string;
	githubUsername: string;
	leetcodeUsername: string;
	projects: Project[];
}

interface EditProfileFormProps {
	onProjectAdded: (newProject: Project) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
	onProjectAdded,
}) => {
	const { username } = useParams<{ username: string }>();
	const [profileData, setProfileData] = useState<ProfileData>({
		name: '',
		bio: '',
		githubUsername: '',
		leetcodeUsername: '',
		projects: [],
	});

	const [isLoading, setIsLoading] = useState(false);
	const [selectedProject, setSelectedProject] = useState<Project | null>(null);
	const [newProjectMode, setNewProjectMode] = useState(false);
	const [newProject, setNewProject] = useState<Project>({
		title: '',
		description: '',
		repoLink: '',
		tags: [],
	});

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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setProfileData((prevData: ProfileData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (selectedProject) {
			setSelectedProject((prevProject: Project | null) => {
				if (prevProject) {
					return {
						...prevProject,
						[name]: value,
					};
				}
				return null; // or return a default Project object if you prefer
			});
		} else {
			setNewProject((prevProject: Project) => ({
				...prevProject,
				[name]: value,
			}));
		}
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await axios.put(`${backendUrl}/profile/${username}`, profileData, {
				withCredentials: true,
			});
			toast.success('Profile updated successfully');
			// alert('Profile updated successfully');
		} catch (error) {
			console.error('Failed to update profile:', error);
			toast.error('Failed to update profile', {
				description: 'Please check your details and try again.',
			});
			// alert('Failed to update profile');
		} finally {
			setIsLoading(false);
		}
	};

	const handleAddProject = async () => {
		try {
			console.log('Tags:', newProject.tags);
			const tagsArray = newProject.tags.map((tag) => ({
				value: tag,
				label: tag,
			})); // Convert Tag objects to strings

			console.log('Adding project:', tagsArray);
			const response = await axios.post(
				`${backendUrl}/profile/${username}/projects`,
				{
					title: newProject.title,
					description: newProject.description,
					repo_link: newProject.repoLink,
					tags: tagsArray, // Use the formatted tagsArray
				},
				{ withCredentials: true },
			);
			if (response.status === 200)
				// console.log("Project added successfully:", );
				toast.success('Project added successfully');
			const addedProject = response.data.project;

			if (addedProject) {
				setProfileData((prevData: ProfileData) => ({
					...prevData,
					projects: [...prevData.projects, addedProject],
				}));

				onProjectAdded(addedProject);
				setNewProject({ title: '', description: '', repoLink: '', tags: [] });
				setNewProjectMode(false);
			} else {
				console.error('Project was not added correctly:', response.data);
				toast.error('Failed to add project', {
					action: {
						label: 'Try again',
						onClick: () => console.log('Try again clicked'),
					},
				});
				// alert('Failed to add project. Please try again.');
			}
		} catch (error) {
			console.error('Failed to add project:', error);
			// alert('Failed to add project. Please try again.');
		}
	};

	const handleUpdateProject = async () => {
		try {
			if (selectedProject) {
				const updatedProject = { ...selectedProject };
				await axios.put(
					`${backendUrl}/profile/${username}/projects/${selectedProject.id}`,
					updatedProject,
					{ withCredentials: true },
				);

				setProfileData((prevData: ProfileData) => ({
					...prevData,
					projects: prevData.projects.map((p: Project) =>
						p.id === selectedProject.id ? updatedProject : p,
					),
				}));
				setSelectedProject(null);
			}
		} catch (error) {
			console.error('Failed to update project:', error);
			toast.error('Failed to update project', {
				description: 'There was a problem with your request.',
				action: {
					label: 'Try again',
					onClick: () => console.log('Try again clicked'),
				},
			});
			// alert('Failed to update project');
		}
	};

	const handleDeleteProject = async (projectTitle: string) => {
		try {
			console.log('Deleting project:', projectTitle);
			const response = await axios.delete(
				`${backendUrl}/profile/${username}/projects/${projectTitle}`,
				{ withCredentials: true },
			);
			if (response.status === 200) {
				setProfileData((prevData: ProfileData) => ({
					...prevData,
					projects: prevData.projects.filter(
						(project: Project) => project.title !== projectTitle,
					),
				}));
				// alert('Project deleted successfully');
				toast.success('Project deleted successfully');
				if (selectedProject && selectedProject.title === projectTitle) {
					setSelectedProject(null);
				}
			} else {
				console.log(response.status);
				toast.error('Failed to delete project', {
					description: 'There was a problem with your request.',
					action: {
						label: 'Try again',
						onClick: () => console.log('Try again clicked'),
					},
				});
				// alert('Failed to delete project');
			}
		} catch (error) {
			console.error('Failed to delete project:', error);
			// alert('Failed to delete project');
			toast.error('Failed to delete project', {
				description: 'There was a problem with your request.',
				action: {
					label: 'Try again',
					onClick: () => console.log('Try again clicked'),
				},
			});
		}
	};

	const openNewProjectForm = () => {
		setNewProjectMode(true);
		setSelectedProject(null);
	};

	return (
		<div className='container mx-auto p-6 space-y-8 bg-neutral-50 dark:bg-neutral-900'>
			{/* Profile Form */}
			<div className='bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-6'>
				<h2 className='text-xl font-semibold mb-4 dark:text-neutral-100'>
					Update Profile
				</h2>
				<form
					onSubmit={handleSubmit}
					className='grid gap-6'>
					<div>
						<Label
							htmlFor='name'
							className='dark:text-neutral-200'>
							Name
						</Label>
						<Input
							id='name'
							name='name'
							value={profileData.name || ''}
							onChange={handleChange}
							disabled={isLoading}
							placeholder='Your name'
							className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
						/>
					</div>
					<div>
						<Label
							htmlFor='bio'
							className='dark:text-neutral-200'>
							Bio
						</Label>
						<Input
							id='bio'
							name='bio'
							value={profileData.bio || ''}
							onChange={handleChange}
							disabled={isLoading}
							placeholder='Write something about yourself'
							className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
						/>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
						<div>
							<Label
								htmlFor='githubUsername'
								className='dark:text-neutral-200'>
								GitHub Username
							</Label>
							<Input
								id='githubUsername'
								name='githubUsername'
								value={profileData.githubUsername || ''}
								onChange={handleChange}
								disabled={isLoading}
								placeholder='GitHub username'
								className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
							/>
						</div>
						<div>
							<Label
								htmlFor='leetcodeUsername'
								className='dark:text-neutral-200'>
								Leetcode Username
							</Label>
							<Input
								id='leetcodeUsername'
								name='leetcodeUsername'
								value={profileData.leetcodeUsername || ''}
								onChange={handleChange}
								disabled={isLoading}
								placeholder='Leetcode username'
								className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
							/>
						</div>
					</div>
					<Button
						type='submit'
						disabled={isLoading}
						className='w-full mt-4'>
						{isLoading ? 'Updating...' : 'Update Profile'}
					</Button>
				</form>
			</div>

			{/* Existing Projects */}
			<div className='bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-6'>
				<h2 className='text-xl font-semibold mb-4 dark:text-neutral-100'>
					Existing Projects
				</h2>
				<ul className='space-y-4'>
					{profileData.projects?.map((project, index) =>
						project?.title ? (
							<li
								key={project.id || index}
								className='cursor-pointer hover:underline dark:text-neutral-200'
								onClick={() => setSelectedProject(project)}>
								{project.title}
							</li>
						) : null,
					)}
				</ul>
			</div>

			{/* Selected Project Form */}
			{profileData.selectedProject && (
				<div className='bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-6'>
					<h2 className='text-xl font-semibold mb-4 dark:text-neutral-100'>
						Edit Project
					</h2>
					<div className='grid gap-6'>
						<div>
							<Label
								htmlFor='projectTitle'
								className='dark:text-neutral-200'>
								Title
							</Label>
							<Input
								id='projectTitle'
								name='title'
								value={profileData.selectedProject.title || ''}
								onChange={handleProjectChange}
								disabled={isLoading}
								placeholder='Project title'
								className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
							/>
						</div>
						<div>
							<Label
								htmlFor='projectDescription'
								className='dark:text-neutral-200'>
								Description
							</Label>
							<Input
								id='projectDescription'
								name='description'
								value={profileData.selectedProject.description || ''}
								onChange={handleProjectChange}
								disabled={isLoading}
								placeholder='Project description'
								className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
							/>
						</div>
						<div>
							<Label
								htmlFor='projectRepoLink'
								className='dark:text-neutral-200'>
								Repository Link
							</Label>
							<Input
								id='projectRepoLink'
								name='repoLink'
								value={profileData.selectedProject.repoLink || ''}
								onChange={handleProjectChange}
								disabled={isLoading}
								placeholder='Repository link'
								className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
							/>
						</div>
						<div className='flex space-x-4'>
							<Button
								onClick={handleUpdateProject}
								disabled={isLoading}>
								{isLoading ? 'Updating...' : 'Update Project'}
							</Button>
							<Button
								onClick={() =>
									handleDeleteProject(profileData.selectedProject.title!)
								}
								disabled={isLoading}
								className='bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800'>
								{isLoading ? 'Deleting...' : 'Delete Project'}
							</Button>
						</div>
					</div>
				</div>
			)}

			{/* New Project Form */}
			{newProjectMode && (
				<div className='bg-white dark:bg-neutral-800 shadow-lg rounded-lg p-6'>
					<h2 className='text-xl font-semibold mb-4 dark:text-neutral-100'>
						Add New Project
					</h2>
					<div className='grid gap-6'>
						<div>
							<Label
								htmlFor='newProjectTitle'
								className='dark:text-neutral-200'>
								Title
							</Label>
							<Input
								id='newProjectTitle'
								name='title'
								value={profileData.newProject.title}
								onChange={handleProjectChange}
								disabled={isLoading}
								placeholder='Project title'
								className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
							/>
						</div>
						<div>
							<Label
								htmlFor='newProjectDescription'
								className='dark:text-neutral-200'>
								Description
							</Label>
							<Input
								id='newProjectDescription'
								name='description'
								value={profileData.newProject.description}
								onChange={handleProjectChange}
								disabled={isLoading}
								placeholder='Project description'
								className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
							/>
						</div>
						<div>
							<Label className='dark:text-neutral-200'>Project Tags</Label>
							<TagInput
								selectedTags={profileData.newProject.tags}
								onTagsChange={(tags) =>
									setNewProject({ ...profileData.newProject, tags })
								}
								className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
							/>
						</div>
						<div>
							<Label
								htmlFor='newProjectRepoLink'
								className='dark:text-neutral-200'>
								Repository Link
							</Label>
							<Input
								id='newProjectRepoLink'
								name='repoLink'
								value={profileData.newProject.repoLink}
								onChange={handleProjectChange}
								disabled={isLoading}
								placeholder='Repository link'
								className='mt-2 dark:bg-neutral-700 dark:text-neutral-100'
							/>
						</div>
						<Button
							onClick={handleAddProject}
							disabled={isLoading}
							className='w-full mt-4'>
							{isLoading ? 'Adding...' : 'Add Project'}
						</Button>
					</div>
				</div>
			)}

			{/* Add New Project Button */}
			{!newProjectMode && (
				<Button
					onClick={openNewProjectForm}
					disabled={isLoading}
					className='w-full'>
					{isLoading ? 'Loading...' : 'Add New Project'}
				</Button>
			)}
		</div>
	);
};

export default EditProfileForm;
