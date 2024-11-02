'use client'

import { useEffect, useState, useRef } from "react"
import { Search, Send, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface User {
    username: string
    last_interaction?: string
}

interface ChatMessage {
    sender_username: string
    message: string
    timestamp: string
}

export function Message() {
    const [currentUserId, setCurrentUserId] = useState<string>("")
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [message, setMessage] = useState<string>("")
    const [chattedUsers, setChattedUsers] = useState<User[]>([])
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
    const chatEndRef = useRef<HTMLDivElement>(null)
    const [isMobileView, setIsMobileView] = useState(false)
    const [showMessages, setShowMessages] = useState(false)
    const messageInputRef = useRef<HTMLTextAreaElement>(null)

    const username = localStorage.getItem('devhub_username') || "";

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        const username = localStorage.getItem('devhub_username') || ""
        setCurrentUserId(username)
        if (username) {
            fetchChattedUsers()
        }
    }, [])

    useEffect(() => {
        handleSearch(searchTerm)
    }, [searchTerm])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [chatMessages])

    const fetchChattedUsers = async () => {
        try {
            const response = await fetch(`${backendUrl}/chatted_users/${username}`)
            const data = await response.json()
            setChattedUsers(data)
        } catch (error) {
            console.error("Error fetching chatted users:", error)
        }
    }

    const handleSearch = async (term: string) => {
        if (term) {
            try {
                const response = await fetch(`${backendUrl}/search_users?username=${term}`)
                const data = await response.json()
                setUsers(data)
            } catch (error) {
                console.error("Error searching users:", error)
            }
        } else {
            setUsers([])
        }
    }

    const handleSendMessage = async () => {
        if (selectedUser && message.trim() !== "") {
            try {
                await fetch(`${backendUrl}/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sender_username: currentUserId,
                        receiver_username: selectedUser.username,
                        message: message
                    }),
                })
                setMessage("")
                fetchChatMessages(selectedUser)
                fetchChattedUsers()
                messageInputRef.current?.focus()
            } catch (error) {
                console.error("Error sending message:", error)
            }
        }
    }

    const fetchChatMessages = async (user: User) => {
        try {
            const response = await fetch(`${backendUrl}/chat_history/${currentUserId}/${user.username}`)
            const data = await response.json()
            setChatMessages(data)
        } catch (error) {
            console.error("Error fetching messages:", error)
        }
    }

    const handleUserSelect = (user: User) => {
        setSelectedUser(user)
        setUsers([])
        fetchChatMessages(user)
        if (isMobileView) {
            setShowMessages(true)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const UsersList = () => (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchTerm); }}>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users"
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </form>
            </div>
            <ScrollArea className="flex-1">
                {users.length > 0 && (
                    <div className="p-4 space-y-2 border-b">
                        <h3 className="font-semibold">Search Results</h3>
                        {users.map(user => (
                            <Button
                                key={user.username}
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => handleUserSelect(user)}
                            >
                                {user.username}
                            </Button>
                        ))}
                    </div>
                )}
                <div className="p-4 space-y-4">
                    <h3 className="font-semibold">Chatted Users</h3>
                    {chattedUsers.map(user => (
                        <Card key={user.username} className="cursor-pointer" onClick={() => handleUserSelect(user)}>
                            <CardContent className="p-4 flex items-center space-x-4">
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`} />
                                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <h4 className="font-medium">{user.username}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {user.last_interaction ? new Date(user.last_interaction).toLocaleString() : "No interaction yet"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )

    const MessageSection = () => (
        <div className="flex flex-col h-full">
            {selectedUser && (
                <>
                    <div className="bg-background/95 p-4 border-b flex items-center space-x-4">
                        {isMobileView && (
                            <Button variant="ghost" size="icon" onClick={() => setShowMessages(false)} className="mr-2">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back to users</span>
                            </Button>
                        )}
                        <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedUser.username}`} />
                            <AvatarFallback>{selectedUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold">{selectedUser.username}</h3>
                    </div>
                    <ScrollArea className="h-96">
                        <div className="p-4 space-y-4">
                            {chatMessages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender_username === currentUserId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-lg ${msg.sender_username === currentUserId
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                            }`}
                                    >
                                        <p>{msg.message}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative">
                            <textarea
                                ref={messageInputRef}
                                className="w-full p-3 pr-12 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a message"
                                rows={2}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="absolute right-2 bottom-4 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </div>
                </>
            )}
        </div>
    )

    return (
        <TooltipProvider delayDuration={0}>
            <div className="">
                {isMobileView ? (
                    showMessages ? (
                        <MessageSection />
                    ) : (
                        <UsersList />
                    )
                ) : (
                    <ResizablePanelGroup direction="horizontal" className="h-full">
                        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
                            <UsersList />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={70} minSize={30}>
                            <MessageSection />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                )}
            </div>
        </TooltipProvider>
    )
}