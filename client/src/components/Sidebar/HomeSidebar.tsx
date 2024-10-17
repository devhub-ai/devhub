import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { IconArrowLeft, IconBrandTabler } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface HomeProps {
	onLogout: () => void;
	username: string;
}

const HomeSidebar: React.FC<HomeProps> = ({ onLogout, username }) => {
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

	const goToHome = () => {
		navigate('/home');
	};


	const [open, setOpen] = useState(false);

return()
};

export default HomeSidebar;
