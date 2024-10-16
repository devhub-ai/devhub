import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Chat from '@/components/Chat/chat';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('devhub_username');

    if (!username) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <Chat />
    </div>
  );
};

export default Home;
