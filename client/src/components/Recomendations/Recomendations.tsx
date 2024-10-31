import React, { useEffect, useState } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Recomendations: React.FC = () => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSuggestions = async () => {
            const username = localStorage.getItem('devhub_username');

            if (!username) {
                setError('Username not found in local storage');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${backendUrl}/suggestions/${username}`);
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
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                    ))}
                </ul>
            )}
            {suggestions.length === 0 && !loading && <p>No suggestions available.</p>}
        </div>
    );
};

export default Recomendations;
