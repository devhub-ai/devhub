import {
    Inbox,
    CircleHelp,
    Settings,
    Sparkles,
    CircleUser,
    LogOut,
    MessagesSquare,
    ChartNetwork,
    SquarePlus,
    GalleryVerticalEnd,
    House,
    BookText,
    BookUser
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
    AlertDialogTrigger,
    AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import Setting from "@/components/Settings/Settings";
import Help from "../Help/Help";
import AddPosts from "../Posts/AddPosts";
import { useContext } from 'react';
import React from 'react'
import AddProject from "@/components/Projects/AddProject";
import { useState } from "react";
import {toast} from "sonner"

const username = localStorage.getItem('devhub_username');

export const PostContext = React.createContext({
    refreshPosts: () => { }
});

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
    const { refreshPosts } = useContext(PostContext);
    const [refresh, setRefresh] = useState(false);
    
    const handleRefresh = () => {
        console.log(refresh)
        setRefresh((prev) => !prev);
    };

    const handlePostCreated = () => {
        refreshPosts();
    };

    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        localStorage.removeItem('devhub_username');
        navigate('/login');
    };

    const handleTriggerClick = () => {
        if (!username) {
            toast.error('Please login to add a project');
        }
    };

    const handleAddPostClick = () => {
        if (!username) {
            toast.error('Please login to create a post');
        }
    };


    return (
        <Sidebar className="border-r-0" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuButton asChild>
                        <a href={'/'} className="flex flex-row items-center">
                            <span>dh</span>
                            <h1 className="text-2xl">DevHub</h1>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenu>
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
                        <SidebarMenuSub>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild onClick={handleTriggerClick}>
                                            <div>
                                                <SquarePlus />
                                                <span>Add Project</span>
                                            </div>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </AlertDialogTrigger>

                                {username && (
                                    <AlertDialogContent>
                                        <div className="flex items-center">
                                            <AlertDialogHeader className="text-2xl">Add New Project</AlertDialogHeader>
                                            <div className="flex-grow"></div>
                                            <AlertDialogCancel>
                                                <Cross1Icon className="h-3 w-3" />
                                            </AlertDialogCancel>
                                        </div>
                                        <AlertDialogDescription>
                                            <AddProject onProjectChange={handleRefresh} />
                                        </AlertDialogDescription>
                                    </AlertDialogContent>
                                )}
                            </AlertDialog>

                        </SidebarMenuSub>
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
                                <GalleryVerticalEnd />
                                <span>Feed</span>
                            </a>
                        </SidebarMenuButton>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                    <a href={`/posts/${username}`}>
                                        <House />
                                        <span>Your Posts</span>
                                    </a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild onClick={handleAddPostClick}>
                                            <div>
                                                <SquarePlus />
                                                <span>Add Post</span>
                                            </div>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </AlertDialogTrigger>

                                {username && (
                                    <AlertDialogContent>
                                        <div className="flex items-center">
                                            <AlertDialogHeader className="text-2xl">Create Post</AlertDialogHeader>
                                            <div className="flex-grow"></div>
                                            <AlertDialogCancel>
                                                <Cross1Icon className="h-3 w-3" />
                                            </AlertDialogCancel>
                                        </div>
                                        <AddPosts onPostCreated={handlePostCreated} />
                                    </AlertDialogContent>
                                )}
                            </AlertDialog>

                        </SidebarMenuSub>
                    </SidebarMenuItem>
                    <SidebarMenuItem >
                        <SidebarMenuButton asChild>
                            <a href="/directory">
                                <BookUser />
                                <span>Directory</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem >
                                <SidebarMenuButton asChild>
                                    <a href="/docs">
                                        <BookText />
                                        <span>Docs</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <SidebarMenuItem >
                                        <SidebarMenuButton asChild>
                                            <div>
                                                <CircleHelp />
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
                                                <Settings />
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
                                    <Setting />

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