'use client';

import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
	query: string;
	response: string;
	isLoading?: boolean;
}

export function PlaceholdersAndVanishInputDemo() {
	const [messages, setMessages] = useState<Array<Message>>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const backendUrl =
		import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

	const placeholders = [
		'How to set up a React project with Vite?',
		'What is the difference between JavaScript and TypeScript?',
		'How to implement authentication in a Next.js app?',
		'What is a closure in JavaScript?',
		'How to optimize React app performance?',
		'Explain event delegation in JavaScript',
	];

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleChange = () => {
		// Additional logic can be added here
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const query = e.currentTarget.querySelector('input')?.value;
		if (!query) return;

		setMessages((prevMessages) => [
			...prevMessages,
			{ query, response: '', isLoading: true },
		]);

		try {
			const result = await axios.post(`${backendUrl}/chat`, { query });
			setMessages((prevMessages) => {
				const newMessages = [...prevMessages];
				const lastMessage = newMessages[newMessages.length - 1];
				lastMessage.response = result.data.result;
				lastMessage.isLoading = false;
				return newMessages;
			});
		} catch (error) {
			console.error('Error querying the model:', error);
			setMessages((prevMessages) => {
				const newMessages = [...prevMessages];
				const lastMessage = newMessages[newMessages.length - 1];
				lastMessage.response =
					'An error occurred while processing your request.';
				lastMessage.isLoading = false;
				return newMessages;
			});
		}
	};

	return (
		<div className='h-screen md:w-[60%] w-full mx-auto justify-center flex flex-col'>
			<h2 className='mb-4 text-xl text-center sm:text-5xl dark:text-white text-black mt-5'>
				Start Collaborating
			</h2>
			<div className='flex-grow overflow-y-auto px-4'>
				{messages.map((message, index) => (
					<div
						key={index}
						className='mb-4'>
						<div className='flex justify-end mb-2'>
							<div className='bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg max-w-[80%]'>
								<p className='font-bold'>You:</p>
								<p>{message.query}</p>
							</div>
						</div>
						<div className='flex justify-start'>
							<div className='bg-zinc-200 dark:bg-zinc-700 p-3 rounded-lg max-w-[80%]'>
								<p className='font-bold'>AI:</p>
								{message.isLoading ? (
									<p>Loading...</p>
								) : (
									<p>{message.response}</p>
								)}
							</div>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>
			<div className='p-4 mb-auto'>
				<PlaceholdersAndVanishInput
					placeholders={placeholders}
					onChange={handleChange}
					onSubmit={onSubmit}
				/>
			</div>
		</div>
	);
}
