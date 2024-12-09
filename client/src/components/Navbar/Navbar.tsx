import React from "react";
import {Link} from 'react-router-dom';
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

export type IconProps = React.HTMLAttributes<SVGElement> & React.ImgHTMLAttributes<HTMLImageElement>;

export function Navbar() {
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
              <Link to="#features" className="text-sm text-white-800 dark:text-gray-400 hover:text-white">
                Features
              </Link>
              <Link to="#products" className="text-sm text-white-800 dark:text-gray-400 hover:text-white">
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
            <Button variant="outline" className="rounded-[12px]">Sign in</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
