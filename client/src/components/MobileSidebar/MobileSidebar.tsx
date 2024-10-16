import {
    CircleUser,
    Home,
    LineChart,
    Menu,
    Fullscreen,
    Shrink
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/Theme/mode-toggle"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const MobileSidebar = () => {
    const [userImage, setUserImage] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(() => {
        // Parse the value from localStorage as a boolean
        return localStorage.getItem('isFullscreen') === 'true';
    });
    const navigate = useNavigate();

    const handleFullscreenToggle = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
        // Store the fullscreen state as a string ("true"/"false")
        localStorage.setItem('isFullscreen', String(!isFullscreen));
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreen = document.fullscreenElement !== null;
            setIsFullscreen(fullscreen);
            localStorage.setItem('isFullscreen', String(fullscreen));
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const username = localStorage.getItem('username');
                if (!username) {
                    throw new Error('Username not found in localStorage');
                }

                const response = await fetch(`${BACKEND_URL}/profile/${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const responseData = await response.json();
                setUserImage(responseData.user.image || null);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                        <a href="#" className="flex items-center gap-2 text-lg font-semibold">
                            <span>Quantica</span>
                        </a>
                        <a
                            href="/home"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <Home className="h-5 w-5" />
                            Home
                        </a>
                        <a
                            href="/plot"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            <LineChart className="h-5 w-5" />
                            f(x) Plotter
                        </a>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1"></div>
            <DropdownMenu>
                {isFullscreen ? (
                    <Shrink onClick={handleFullscreenToggle} />
                ) : (
                    <Fullscreen onClick={handleFullscreenToggle} />
                )}
                <ModeToggle />
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        {userImage ? (
                            <img src={userImage} alt="User Profile" className="h-5 w-5 rounded-full" />
                        ) : (
                            <CircleUser className="h-5 w-5" />
                        )}
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            const username = localStorage.getItem('username');
                            if (username) {
                                navigate(`/profile/${username}`);
                            } else {
                                console.error('Username not found in localStorage');
                            }
                        }}
                    >
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
};

export default MobileSidebar;
