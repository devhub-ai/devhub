import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarLeft } from '@/components/Sidebar/Sidebar'
import { Message } from "../components/Messages/Message";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const MessagePage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const username = localStorage.getItem('devhub_username');

        if (!username) {
            navigate('/login');
        }
    }, [navigate]);
    return (
        <SidebarProvider>
            <SidebarLeft />
            <SidebarInset>
                <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                    </div>
                </header>
                <main className="flex flex-col flex-grow p-4 overflow-hidden">
                    <div className="flex flex-col h-full">
                        <Message />
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
