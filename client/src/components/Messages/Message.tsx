import { useEffect,useState } from "react"
import {
    Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { TooltipProvider } from "@/components/ui/tooltip"
import axios from "axios"

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

    useEffect(() => {
        const username = localStorage.getItem('devhub_username') || "";
        setCurrentUserId(username);
    }, []);

    const handleSearch = async () => {
        if (searchTerm) {
            try {
                const response = await axios.get(`${backendUrl}/search_users?username=${searchTerm}`);
                setUsers(response.data);
            } catch (error) {
                console.error("Error searching users:", error);
            }
        } else {
            setUsers([]); // Clear users if search term is empty
        }
    }

    const handleSendMessage = async () => {
        if (selectedUser && message.trim() !== "") {
            try {
                await axios.post(`${backendUrl}/send_message`, {
                    sender_username: currentUserId,
                    receiver_username: selectedUser.username,
                    message: message
                });
                setMessage("");
                fetchChatMessages();

                if (!chattedUsers.some(user => user.username === selectedUser.username)) {
                    setChattedUsers([...chattedUsers, selectedUser]);
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    }

    const fetchChatMessages = async () => {
        if (selectedUser) {
            try {
                const response = await axios.get(`${backendUrl}/get_messages/${selectedUser.username}`);
                setChatMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }
    }

    useEffect(() => {
        handleSearch(); 
    }, [searchTerm]);

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setUsers([]);
        setChatMessages([]); 
        fetchChatMessages();
    }

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
                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
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
                        {selectedUser && (
                            <div>
                                <h3>Chat with {selectedUser.username}</h3>
                                <div>
                                    {chatMessages.map((msg, index) => (
                                        <div key={index}>
                                            <strong>{msg.sender_username === currentUserId ? "You" : selectedUser.username}:</strong> {msg.message}
                                        </div>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message"
                                />
                                <button onClick={handleSendMessage}>Send</button>
                            </div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    )
}
