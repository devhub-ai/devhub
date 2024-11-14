import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import UploadComponent from '@/components/UploadComponent/UploadComponent'; 
import { Icons } from "@/components/ui/icons";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CreatePost = ({ onPostCreated }: { onPostCreated: () => void }) => {
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authorUsername = localStorage.getItem('devhub_username');

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value.split(',').map(tag => tag.trim()));
  };

  const handleFileChange = (file: File) => {
    setImageFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!authorUsername) {
      toast.error('Author username not found. Please log in.');
      return;
    }

    if (!description) {
      toast.error('Description is required.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append('author_username', authorUsername);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags)); // Send tags as a JSON string

    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await axios.post(`${backendUrl}/posts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Post created successfully!');
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 sm:w-80">
        <div>
          <label htmlFor="image" className="dark:text-neutral-200">Upload Image</label>
          <div className='mt-2'>
            <UploadComponent onFileChange={handleFileChange} />
          </div> 
        </div>
        <div>
          <label htmlFor="description" className="dark:text-neutral-200">Description</label>
          <Textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            disabled={isLoading}
            placeholder="Write a description..."
            className="mt-2"
          />
        </div>
        <div>
          <label htmlFor="tags" className="dark:text-neutral-200">Tags (comma-separated)</label>
          <Input
            id="tags"
            value={tags.join(', ')}
            onChange={handleTagsChange}
            disabled={isLoading}
            placeholder="e.g., react, node, javascript"
            className="mt-2"
          />
        </div>
        <Button type='submit' disabled={isLoading} className='w-full mt-4'>
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> 'Posting...'
            </>
          ) : 'Create Post'}
        </Button>
      </form>
  );
};

export default CreatePost;
