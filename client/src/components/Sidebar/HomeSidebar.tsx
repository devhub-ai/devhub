import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
    IconSettings,
    IconUserBolt,
} from "@tabler/icons-react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

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

    const links = [
        {
            label: "Dashboard",
            href: "#",
            icon: (
                <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
            onClick: goToHome,
        }
    ];

    const [open, setOpen] = useState(false);

    return (

        <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    {open ? <Logo /> : <LogoIcon />}
                    <div className="mt-8 flex flex-col gap-2">
                        {links.map((link, idx) => (
                            <SidebarLink key={idx} link={link} />
                        ))}
                    </div>
                </div>
                <div>
                    <SidebarLink
                        link={{
                            label: username,
                            href: "#",
                            icon: (
                                <img
                                    src="https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?size=338&ext=jpg&ga=GA1.1.1700460183.1712707200&semt=ais"
                                    className="h-7 w-7 flex-shrink-0 rounded-full"
                                    width={50}
                                    height={50}
                                    alt="Avatar"
                                />
                            ),
                            onClick: goToProfile
                        }}

                    />
                    <SidebarLink
                        link={{
                            label: "Logout",
                            href: "#",
                            icon: (
                                <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                            ),
                            onClick: handleLogout,
                        }}
                    />

                </div>
            </SidebarBody>
        </Sidebar>

    );
};

export const Logo = () => {
    return (
        <Link
            to="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            {/* <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" /> */}
            <h1 style={{ fontSize: "1.3rem", fontWeight: "bold" }} className="font-medium text-black dark:text-white whitespace-pre"
            >dh</h1>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                Devhub
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            to="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <h1 style={{ fontSize: "1.3rem", fontWeight: "bold" }} className="font-medium text-black dark:text-white whitespace-pre"
            >dh</h1>
        </Link>
    );
};

export default HomeSidebar;