import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  onLogout: () => void;
  username: string;  // Add username prop
}

const Home: React.FC<HomeProps> = ({ onLogout, username }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const goToProfile = () => {
    navigate(`/u/${username}`);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={goToProfile}>Go to Profile</button>
    </div>
  );
};

export default Home;
