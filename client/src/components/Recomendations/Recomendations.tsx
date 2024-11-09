import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Marquee from "@/components/ui/marquee";


const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Recomendations: React.FC = () => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            const currentUser = localStorage.getItem('devhub_username');

            if (!currentUser) {
                setError('Username not found in local storage');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${backendUrl}/suggestions/${currentUser}`);

                setSuggestions(response.data.suggestions);
            } catch (err) {
                setError('Error fetching suggestions');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSuggestions();
    }, []);

    return (
        <div>
            {error && <p>{error}</p>}
            {loading &&
                <>
                    <ul className='flex items-center justify-center'>
                        <Marquee pauseOnHover vertical className="[--duration:20s]">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="flex items-center border border-gray-300 rounded-lg">
                                    <div className="p-4 flex items-center space-x-4">
                                        <div className="h-8 w-8 rounded-full bg-gray-300 animate-pulse"></div>
                                        <div className="w-24 h-6 bg-gray-300 animate-pulse rounded-lg"></div>
                                    </div>
                                </div>
                            ))}
                        </Marquee>
                    </ul>
                </>}
            {suggestions.length > 0 && (
                <ul className='flex items-center justify-center'>
                    <Marquee pauseOnHover vertical className="[--duration:20s]">
                        {suggestions.map((suggestion, index) => (
                            <div className="flex items-center border border-gray-300 rounded-lg">
                                <div className="p-4 flex items-center space-x-4">
                                    <div className='h-8 w-8 rounded-full overflow-hidden'>
                                        <img src={`https://api.dicebear.com/6.x/initials/svg?seed=${suggestion}`} alt="user avatar" />
                                    </div>
                                    <a href={`/user/${suggestion}`}>
                                        <li key={index} className="list-none">@{suggestion}</li>
                                    </a>

                                </div>
                            </div>
                        ))}
                    </Marquee>
                </ul>
            )}
            {suggestions.length === 0 && !loading &&
                <>
                    <p>No suggestion Available</p>
                </>}
        </div>
    );
};

export default Recomendations;
