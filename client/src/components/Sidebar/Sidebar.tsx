import {
    Inbox,
    MessageCircleQuestion,
    Settings2,
    Sparkles,
    CircleUser,
    LogOut,
    MessagesSquare,
    ChartNetwork,
    type LucideIcon,
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

    const sidebarLeftData = {
        navMain: [
            {
                title: "Ask dh",
                url: "/home",
                icon: Sparkles,
            },
            {
                title: "Message",
                url: "/message",
                icon: MessagesSquare,
            },
            {
                title: "Projects",
                url: `/projects/${username}`,
                icon: Inbox,
            },
            {
                title: "KGs",
                url: `/relations/${username}`,
                icon: ChartNetwork,
            }
        ]
    };

    return (
        <Sidebar className="border-r-0" {...props}>
            <SidebarHeader>
                <h1 className="ml-2 text-4xl mt-4">DevHub</h1>
            </SidebarHeader>
            <SidebarHeader>
                <NavMain items={sidebarLeftData.navMain} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem >
                                <SidebarMenuButton asChild>
                                    <a href="#">
                                        <MessageCircleQuestion />
                                        <span>Help</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
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

function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
        isActive?: boolean
    }[]
}) {
    return (
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                        <a href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    )
}

