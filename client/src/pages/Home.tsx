import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chat } from '@/components/Chat/Chat';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SidebarLeft } from '@/components/Sidebar/Sidebar'
import { SidebarRight } from '@/components/Recomendations/RecomendationSidebar';

const Home = () => {
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
        <Chat />
      </SidebarInset>
      <SidebarRight />
    </SidebarProvider>
  );
};

export default Home;
