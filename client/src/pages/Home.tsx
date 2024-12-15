import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chat } from '@/components/Chat/Chat';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { SidebarLeft } from '@/components/Sidebar/Sidebar'

const Home = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('devhub_username');

  useEffect(() => {
    if (!username) {
      navigate('/login');
    }
  }, [navigate, username]);

  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <Chat />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Home;
