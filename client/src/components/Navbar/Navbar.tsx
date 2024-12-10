import React from "react";
import  {Link} from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { FeedbackForm } from "@/components/Feedback/FeedbackForm"
import { useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

export type IconProps = React.HTMLAttributes<SVGElement> & React.ImgHTMLAttributes<HTMLImageElement>;

export function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('devhub_username')

  const scrollToFeatures = () => {
    const item = document.getElementById('features');
    if (item) {
      item.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProducts = () => {
    const item = document.getElementById('products');
    if (item) {
      item.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
  }, [username]);

  const handleLogout = () => {
    localStorage.removeItem('devhub_username');
    navigate('/');
  };

  const signIn = () => {
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black bg-opacity-50 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-[25px]">dh</span><span>|</span><span className="text-[25px]">DevHub</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/docs" className="text-sm text-white-800 dark:text-gray-400 hover:text-white">
                Docs
              </Link>
              <Link to="#features" onClick={scrollToFeatures} className="text-sm text-white-800 dark:text-gray-400 hover:text-white">
                Features
              </Link>
              <Link to="#products" onClick={scrollToProducts} className="text-sm text-white-800 dark:text-gray-400 hover:text-white">
                Products
              </Link>
              <Link to="/feed" className="text-sm text-white-800 dark:text-gray-400 hover:text-white">
                Feed
              </Link>
              <Link to="/directory" className="text-sm text-white-800 dark:text-gray-400 hover:text-white">
                Directory
              </Link>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="outline" className="rounded-[12px]">Feedback</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <div className='flex items-center'>
                    <AlertDialogHeader className='text-2xl'>Feedback Form</AlertDialogHeader>
                    <div className='flex-grow'></div>
                    <AlertDialogCancel className="ml-6"><Cross1Icon className='h-3 w-3' /></AlertDialogCancel>
                  </div>
                  <FeedbackForm />
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {username ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="/placeholder-avatar.jpg" alt={username} className="rounded-lg" />
                      <AvatarFallback className="rounded-lg">{username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="end" forceMount>
                  <DropdownMenuItem className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <a href={`/user/${username}`}><span>{username}</span></a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Button variant="outline" className="rounded-[12px]" onClick={signIn}>Sign in</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

