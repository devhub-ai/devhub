import {
    Inbox,
    MessageCircleQuestion,
    Settings2,
    Sparkles,
    CircleUser,
    LogOut,
    MessagesSquare,
    ChartNetwork,
    SquarePlus,
    Rss,
    House
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
} from "@/components/ui/sidebar"
import { useNavigate } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import Settings from "@/components/Settings/Settings";
import Help from "../Help/Help";
import AddPosts from "../Posts/AddPosts";

const username = localStorage.getItem('devhub_username');

export default function DevhubSidebar() {
    return (
        <SidebarProvider>
            <SidebarLeft />
            <SidebarInset>
                <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
                    <div className="mx-auto h-[100vh] w-full max-w-3xl rounded-xl bg-muted/50" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export function SidebarLeft({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        localStorage.removeItem('devhub_username');
        navigate('/login');
    };

    return (
        <Sidebar className="border-r-0" {...props}>
            <SidebarHeader>
                <h1 className="ml-2 text-4xl mt-4">DevHub</h1>
            </SidebarHeader>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href={'/home'}>
                                <Sparkles />
                                <span>Ask dh</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href={'/message'}>
                                <MessagesSquare />
                                <span>Message</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href={`/projects/${username}`}>
                                <Inbox />
                                <span>Projects</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href={`/relations/${username}`}>
                                <ChartNetwork />
                                <span>Visualize</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <a href={'/feed'}>
                                <Rss />
                                <span>Feed</span>
                            </a>
                        </SidebarMenuButton>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                    <a href={''}>
                                        <House />
                                        <span> Your Posts</span>
                                    </a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <div>
                                                <SquarePlus />
                                                <span> Add Post</span>
                                            </div>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <div className="flex">
                                        <AlertDialogHeader className="text-2xl mt-1.5">
                                            Add Post
                                        </AlertDialogHeader>
                                        <div className="flex-grow"></div>
                                        <AlertDialogCancel>
                                            <Cross1Icon className="h-3 w-3" />
                                        </AlertDialogCancel>
                                    </div>
                                    <AddPosts />
                                </AlertDialogContent>
                            </AlertDialog>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <SidebarMenuItem >
                                        <SidebarMenuButton asChild>
                                            <div>
                                                <MessageCircleQuestion />
                                                <span>Help</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <div className="flex">
                                        <AlertDialogHeader className="text-2xl mt-1.5">
                                            Help
                                        </AlertDialogHeader>
                                        <div className="flex-grow"></div>
                                        <AlertDialogCancel>
                                            <Cross1Icon className="h-3 w-3" />
                                        </AlertDialogCancel>
                                    </div>
                                    <Help />
                                </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <SidebarMenuItem >
                                        <SidebarMenuButton asChild>
                                            <div>
                                                <Settings2 />
                                                <span>Settings</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <div className="flex">
                                        <AlertDialogHeader className="text-2xl mt-1.5">
                                            Settings
                                        </AlertDialogHeader>
                                        <div className="flex-grow"></div>
                                        <AlertDialogCancel>
                                            <Cross1Icon className="h-3 w-3" />
                                        </AlertDialogCancel>
                                    </div>
                                    <Settings />

                                </AlertDialogContent>
                            </AlertDialog>
                            <SidebarMenuItem >
                                <SidebarMenuButton asChild>
                                    <a href={username ? `/user/${username}` : "/login"}>
                                        <CircleUser />
                                        <span>{username ? `${username}` : "profile"}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem >
                                <SidebarMenuButton asChild>
                                    <a onClick={handleLogout} href="#">
                                        <LogOut />
                                        <span>Logout</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    )
}