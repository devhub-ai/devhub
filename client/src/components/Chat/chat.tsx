import Sidebar from "../Sidebar/Sidebar";
import MobileSidebar from "../MobileSidebar/MobileSidebar";
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Message {
	query: string;
	response: string;
	isLoading?: boolean;
}

export default function Chat() {
	const [messages, setMessages] = useState<Array<Message>>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);



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

	const username = localStorage.getItem('devhub_username');

	useEffect(() => {
		const fetchChatHistory = async () => {
			if (!username) {
				console.error('Username not found in localStorage');
				return;
			}

			try {
				const result = await axios.get(`${backendUrl}/chat_history`, {
					params: { username },
					withCredentials: true
				});

				const chatHistory =
					result.data.chat_history.length > 0
						? result.data.chat_history
						: [{ query: 'Hi', response: 'Welcome to DevHub!' }];
				setMessages(chatHistory);
			} catch (error) {
				console.error('Error fetching chat history:', error);
			}
		};

		fetchChatHistory();
	}, [username]);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const query = e.currentTarget.querySelector('input')?.value;
		if (!query) return;

		if (!username) {
			console.error('Username not found in localStorage');
			return;
		}

		setMessages((prevMessages) => [
			...prevMessages,
			{ query, response: '', isLoading: true },
		]);

		try {
			const result = await axios.post(`${backendUrl}/chat`, { query, username }, { withCredentials: true });

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
				lastMessage.response = 'An error occurred while processing your request.';
				lastMessage.isLoading = false;
				return newMessages;
			});
		}
	};
	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<Sidebar />
			<div className="flex flex-col h-screen">
				<header className="sticky top-0 z-10 bg-background border-b">
					<MobileSidebar />
				</header>
				<div className='h-screen md:w-[60%] w-full mx-auto justify-center flex flex-col'>
					<div className='flex-grow overflow-y-auto px-4'>
						{messages.map((message, index) => (
							<div key={index} className='mb-4'>

								<p className='font-bold'>You:</p>
								<p>{message.query}</p>


								<p className='font-bold'>AI:</p>
								{message.isLoading ? (
									<p>Loading...</p>
								) : (
									<p>{message.response}</p>
								)}

							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
					<div className='p-4 mb-auto'>
						<PlaceholdersAndVanishInput
							placeholders={placeholders}
							onSubmit={onSubmit}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
