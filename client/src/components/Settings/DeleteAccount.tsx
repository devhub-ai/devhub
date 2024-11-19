import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { toast } from 'sonner';
import { Icons } from "@/components/ui/icons";

const username = localStorage.getItem('devhub_username');
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const DeleteAccount = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${backendUrl}/profile/delete/${username}`);
            if (response.status === 200) {
                toast.success('Account deleted successfully.');
                localStorage.removeItem('devhub_username');
                navigate('/');
            } else {
                toast.error('Failed to delete account.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('An error occurred while deleting the account.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='sm:w-80 grid gap-6'>
            <p className='text-sm'>Once you delete an account, there is no going back. Please be certain.</p>
            <Button
                variant="destructive"
                className='w-full mt-2'
                onClick={handleDelete}
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> 'Deleting...'
                    </>
                ) : 'Delete Account'}
            </Button>
        </div>
    );
};

export default DeleteAccount;
