import {
    Inbox,
    MessageCircleQuestion,
    Settings2,
    Sparkles,
    CircleUser,
    Trash2,
    LogOut,
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

    // Handle logout logic
    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();  // Prevent the default anchor behavior
        localStorage.removeItem('devhub_username');
        navigate('/login');  // Redirect to the login page
    };

    const sidebarLeftData = {
        navMain: [
            {
                title: "Ask dh",
                url: "/home",
                icon: Sparkles,
            },
            {
                title: "Inbox",
                url: "#",
                icon: Inbox,
                badge: "10",
            },
        ],
        navSecondary: [
            {
                title: "Trash",
                url: "#",
                icon: Trash2,
            },
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
                url: username ? `/u/${username}` : "#",
                icon: CircleUser,
            },
            {
                title: "Logout",
                url: "#",  // Keep the url as # for now
                icon: LogOut,
                onClick: handleLogout,  // Call the logout function on click
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
        onClick?: React.MouseEventHandler<HTMLAnchorElement>  // Add onClick type
    }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
    return (
        <SidebarGroup {...props}>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                {/* Handle click if provided */}
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
