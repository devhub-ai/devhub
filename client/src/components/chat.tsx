"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useState, useEffect } from "react";
import axios from "axios";

export function PlaceholdersAndVanishInputDemo() {
    const [messages, setMessages] = useState<Array<{ query: string; response: string }>>([]);
    const [isLoading, setIsLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';


    const placeholders = [
        "What's the first rule of Fight Club?",
        "Who is Tyler Durden?",
        "Where is Andrew Laeddis Hiding?",
        "Write a Javascript method to reverse a string",
        "How to assemble your own PC?",
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // You can add any additional logic here if needed
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = e.currentTarget.querySelector('input')?.value;
        if (!query) return;

        setIsLoading(true);
        try {
            const result = await axios.post(`${backendUrl}/chat`, { query });
            setMessages(prevMessages => [...prevMessages, { query, response: result.data.result }]);
        } catch (error) {
            console.error('Error querying the model:', error);
            setMessages(prevMessages => [...prevMessages, { query, response: "An error occurred while processing your request." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[50rem] flex flex-col">
            <h2 className="mb-4 text-xl text-center sm:text-5xl dark:text-white text-black">
                Start Collaborating
            </h2>
            <div className="flex-grow overflow-y-auto px-4 flex flex-col items-center">
                {messages.map((message, index) => (
                    <div key={index} className="mb-4 w-full max-w-[80%]">
                        <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-lg mb-2">
                            <p className="font-bold">You:</p>
                            <p>{message.query}</p>
                        </div>
                        <div className="bg-zinc-200 dark:bg-zinc-700 p-2 rounded-lg">
                            <p className="font-bold">AI:</p>
                            <p>{message.response}</p>
                        </div>
                    </div>
                ))}
            </div>
            {isLoading && (
                <div className="flex justify-center items-center p-4">
                    <p>Loading...</p>
                </div>
            )}
            <div className="p-4 mt-4">
                <PlaceholdersAndVanishInput
                    placeholders={placeholders}

                    onChange={handleChange}
                    onSubmit={onSubmit}
                />
            </div>
        </div>
    );
}
