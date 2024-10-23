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
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useNavigate } from 'react-router-dom';

const username = typeof window !== 'undefined' ? localStorage.getItem('devhub_username') : null;

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
                url: username ? `/projects/${username}` : "#",
                icon: Inbox,
            },
            {
                title: "KGs",
                url: `/relations/${username}`,
                icon: ChartNetwork,
            }
        ],
        navSecondary: [
            
            {
                title: "Help",
                url: "#",
                icon: MessageCircleQuestion,
            },
            {
                title: "Settings",
                url: "/settings",
                icon: Settings2,
            },
            {
                title: username ? `${username}` : "profile",
                url: username ? `/user/${username}` : "#",
                icon: CircleUser,
            },
            {
                title: "Logout",
                url: "#",
                icon: LogOut,
                onClick: handleLogout, 
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
                <NavSecondary
                    items={sidebarLeftData.navSecondary}
                    className="mt-auto"
                />
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

function NavSecondary({
    items,
    ...props
}: {
    items: {
        title: string
        url: string
        icon: LucideIcon
        badge?: React.ReactNode
        onClick?: React.MouseEventHandler<HTMLAnchorElement> 
    }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <a href={item.url} onClick={item.onClick}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                            {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
