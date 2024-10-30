import { useEffect, useState } from "react";
import {
    Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { TooltipProvider } from "@/components/ui/tooltip";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface User {
    username: string;
}

interface ChatMessage {
    sender_username: string;
    message: string;
}

export function Message() {
    const [currentUserId, setCurrentUserId] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [message, setMessage] = useState<string>("");
    const [chattedUsers, setChattedUsers] = useState<User[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    // Fetch current user from local storage on component load
    useEffect(() => {
        const username = localStorage.getItem('devhub_username') || "";
        setCurrentUserId(username);
        if (username) {
            fetchChattedUsers();  // Fetch chatted users on initial load
        }
    }, [currentUserId]);

    // Function to fetch chatted users from backend
    const fetchChattedUsers = async () => {
        try {
            const response = await axios.get(`${backendUrl}/chatted_users/${currentUserId}`);
            setChattedUsers(response.data);  // Update chatted users list
        } catch (error) {
            console.error("Error fetching chatted users:", error);
        }
    };

    // Function to search users based on input
    const handleSearch = async (term: string) => {
        if (term) {
            try {
                const response = await axios.get(`${backendUrl}/search_users?username=${term}`);
                setUsers(response.data);
            } catch (error) {
                console.error("Error searching users:", error);
            }
        } else {
            setUsers([]); // Clear users if search term is empty
        }
    };

    // Function to send a message and refresh chat & chatted users
    const handleSendMessage = async () => {
        if (selectedUser && message.trim() !== "") {
            try {
                await axios.post(`${backendUrl}/send`, {
                    sender_username: currentUserId,
                    receiver_username: selectedUser.username,
                    message: message
                });
                setMessage("");
                fetchChatMessages(selectedUser);  // Refresh chat messages after sending
                fetchChattedUsers();  // Refresh chatted users from the backend
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    // Function to fetch chat messages between the current user and the selected user
    const fetchChatMessages = async (user: User) => {
        try {
            const response = await axios.get(`${backendUrl}/chat_history/${currentUserId}/${user.username}`);
            setChatMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Call handleSearch whenever searchTerm changes
    useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm]);

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);  // Update selected user state
        setUsers([]);  // Clear the search results
        fetchChatMessages(user);  // Pass the user directly to fetch chat messages
    };

    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes: number[]) => {
                    document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(sizes)}`;
                }}
                className="h-full items-stretch"
            >
                <ResizablePanel minSize={30} className="flex flex-col">
                    <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchTerm); }}>
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users"
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        handleSearch(e.target.value); // Search as user types
                                    }}
                                />
                            </div>
                        </form>
                        <ul className="mt-2">
                            {users.map(user => (
                                <li key={user.username} onClick={() => handleUserSelect(user)}>
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-grow overflow-auto">
                        <h3>Chatted Users</h3>
                        <ul>
                            {chattedUsers.map(user => (
                                <li key={user.username} onClick={() => handleUserSelect(user)}>
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel minSize={30} className="flex flex-col">
                    <div className="flex-grow overflow-auto">
                        {selectedUser ? (
                            <div>
                                <h3>Chat with {selectedUser.username}</h3>
                                <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
                                    {chatMessages.map((msg, index) => (
                                        <div key={index}>
                                            <strong>{msg.sender_username === currentUserId ? "You" : selectedUser.username}:</strong> {msg.message}
                                        </div>
                                    ))}
                                </div>
                                <Separator className="mt-auto" />
                                <div className="p-4">
                                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                                        <div className="grid gap-4">
                                            <Textarea
                                                className="p-4"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Type a message"
                                            />
                                            <div className="flex items-center">
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    className="ml-auto"
                                                >
                                                    Send
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center text-muted-foreground">
                                No message selected
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    );
}
