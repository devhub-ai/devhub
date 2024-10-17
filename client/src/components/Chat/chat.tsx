import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input'
import Sidebar from "@/components/Sidebar/Sidebar"
import MobileSidebar from "@/components/MobileSidebar/MobileSidebar"
import { Skeleton } from "@/components/ui/skeleton"
import Typewriter from 'typewriter-effect'
import ReactMarkdown from 'react-markdown';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface Message {
	query: string
	response: string
	isLoading?: boolean
	isTypingFinished?: boolean // Track typing completion per message
}

export function Chat() {
	const [messages, setMessages] = useState<Array<Message>>([])
	const scrollAreaRef = useRef<HTMLDivElement>(null)

	const placeholders = [
		'How to set up a React project with Vite?',
		'What is the difference between JavaScript and TypeScript?',
		'How to implement authentication in a Next.js app?',
		'What is a closure in JavaScript?',
		'How to optimize React app performance?',
		'Explain event delegation in JavaScript',
	]

	const scrollToBottom = () => {
		if (scrollAreaRef.current) {
			scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
		}
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const username = typeof window !== 'undefined' ? localStorage.getItem('devhub_username') : null

	useEffect(() => {
		const fetchChatHistory = async () => {
			if (!username) {
				console.error('Username not found in localStorage')
				return
			}

			try {
				const result = await axios.get(`${backendUrl}/chat_history`, {
					params: { username },
					withCredentials: true
				})

				const chatHistory =
					result.data.chat_history.length > 0
						? result.data.chat_history
						: [{ query: '', response: 'Welcome to DevHub!' }]
				setMessages(chatHistory)
			} catch (error) {
				console.error('Error fetching chat history:', error)
			}
		}

		fetchChatHistory()
	}, [username])

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const query = e.currentTarget.querySelector('input')?.value
		if (!query) return

		if (!username) {
			console.error('Username not found in localStorage')
			return
		}

		setMessages((prevMessages) => [
			...prevMessages,
			{ query, response: '', isLoading: true, isTypingFinished: false }, // Initialize isTypingFinished for each message
		])

		try {
			const result = await axios.post(`${backendUrl}/chat`, { query, username }, { withCredentials: true })

			setMessages((prevMessages) => {
				const newMessages = [...prevMessages]
				const lastMessage = newMessages[newMessages.length - 1]
				lastMessage.response = result.data.result
				lastMessage.isLoading = false
				return newMessages
			})
		} catch (error) {
			console.error('Error querying the model:', error)
			setMessages((prevMessages) => {
				const newMessages = [...prevMessages]
				const lastMessage = newMessages[newMessages.length - 1]
				lastMessage.response = 'An error occurred while processing your request.'
				lastMessage.isLoading = false
				return newMessages
			})
		}
	}

	return (
		<div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
			<Sidebar />
			<div className="flex flex-col h-screen">
				<header className="sticky top-0 z-10">
					<MobileSidebar />
				</header>
				<main className="flex flex-col flex-grow p-4 overflow-hidden">
					<div className="flex flex-col h-full w-full md:w-[80%] lg:w-[70%] xl:w-[60%] mx-auto flex-grow overflow-y-auto p-1" ref={scrollAreaRef}>
						<div className="space-y-4">
							{messages.map((message, index) => (
								<div key={index} className="last:mb-0">
									<div className="flex items-start justify-end">
										<div className="flex-grow text-right">
											<p className="text-sm">{message.query}</p>
										</div>
									</div>
									<div className="flex items-start mb-4 mt-1">
										<Avatar className="mr-4">
											<AvatarImage src="/ai-avatar.png" alt="dh" />
											<AvatarFallback>dh</AvatarFallback>
										</Avatar>
										<div className="flex-grow mt-2" style={{ maxWidth: '70%' }}> {/* Set maxWidth to 70% */}
											{message.isLoading ? (
												<>
													<Skeleton className="h-4 w-[250px]" />
													<Skeleton className="h-4 w-[290px] mt-1" />
												</>
											) : (
												index === messages.length - 1 && !message.isTypingFinished ? (
													<Typewriter
														onInit={(typewriter) => {
															typewriter.typeString(message.response)
																.callFunction(() => {
																	setMessages((prevMessages) => {
																		const newMessages = [...prevMessages]
																		const lastMessage = newMessages[newMessages.length - 1]
																		lastMessage.isTypingFinished = true
																		return newMessages
																	})
																})
																.pauseFor(500)
																.start();
														}}
														options={{
															delay: 2,
														}}
													/>
												) : (
													<ReactMarkdown className="text-sm">{message.response}</ReactMarkdown>
												)
											)}
										</div>
									</div>
								</div>

							))}
						</div>
					</div>
				</main>

				<div className="p-4">
					<PlaceholdersAndVanishInput
						placeholders={placeholders}
						onSubmit={onSubmit}
					/>
				</div>
			</div>
		</div>
	)
}
