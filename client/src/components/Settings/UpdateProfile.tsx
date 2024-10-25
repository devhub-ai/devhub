import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Textarea } from '../ui/textarea';
import { Icons } from "@/components/ui/icons";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ProfileData {
  name: string;
  bio: string;
  githubUsername: string;
  leetcodeUsername: string;
}

const UpdateProfile = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    bio: '',
    githubUsername: '',
    leetcodeUsername: ''
  });
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const storedUsername = localStorage.getItem('devhub_username');
    setUsername(storedUsername);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (username) {
        try {
          const response = await axios.get(`${backendUrl}/profile/${username}`);
          setProfileData(response.data);
        } catch (error) {
          console.error('Failed to fetch profile data:', error);
        }
      }
    };

    fetchProfile();
  }, [username]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prevData: ProfileData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!username) return;
    setIsLoading(true);

    try {
      await axios.put(`${backendUrl}/profile/${username}`, profileData, {
        withCredentials: true,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile', {
        description: 'Please check your details and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className='p-2 mt-4 h-full overflow-auto'>
          <h2 className='text-xl font-semibold mb-4 dark:text-neutral-100'>
            Update Profile
          </h2>
          <form onSubmit={handleSubmit} className='grid gap-4'>
            <div>
              <Label htmlFor='name' className='dark:text-neutral-200'>
                Name
              </Label>
              <Input
                id='name'
                name='name'
                value={profileData.name || ''}
                onChange={handleChange}
                disabled={isLoading}
                placeholder='Your name'
                className='mt-2'
              />
            </div>
            <div>
              <Label htmlFor='bio' className='dark:text-neutral-200'>
                Bio
              </Label>
          <Textarea
                id='bio'
                name='bio'
                value={profileData.bio || ''}
                onChange={handleChange}
                disabled={isLoading}
                placeholder='Write something about yourself'
                className='mt-2'
              />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <div>
                <Label htmlFor='githubUsername' className='dark:text-neutral-200'>
                  GitHub Username
                </Label>
                <Input
                  id='githubUsername'
                  name='githubUsername'
                  value={profileData.githubUsername || ''}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder='GitHub username'
                  className='mt-2'
                />
              </div>
              <div>
                <Label htmlFor='leetcodeUsername' className='dark:text-neutral-200'>
                  Leetcode Username
                </Label>
                <Input
                  id='leetcodeUsername'
                  name='leetcodeUsername'
                  value={profileData.leetcodeUsername || ''}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder='Leetcode username'
                  className='mt-2 '
                />
              </div>
            </div>
            <Button type='submit' disabled={isLoading} className='w-full mt-4'>
          {isLoading ? (<><Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> 'Updating...'
          </>) : 'Update Profile'}
            </Button>
          </form>
      </div>
  );
};

export default UpdateProfile;