import React from 'react';
import { Link } from 'react-router-dom';
import { ModeToggle } from "@/components/mode-toggle.tsx"

const Landing: React.FC = () => {
  return (
    <div >
      <ModeToggle />
      <h1>Welcome to the Landing Page</h1>
      <Link to="/signup">Sign Up</Link>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Landing;
