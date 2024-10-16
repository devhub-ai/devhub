"use client"

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onLoginSuccess?: (username: string) => void;
}

export function UserAuthForm({ className, onLoginSuccess, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/login`, { username, password }, { withCredentials: true });
      if (response.status === 200) {
        if (onLoginSuccess) {
          onLoginSuccess(username); // Pass the username to the callback
        }
        navigate('/home');
      }
    } catch (err:any) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message, {
          description: "Please check your details and try again.",
          action: {
            label: "Try again",
            onClick: () => console.log("Try again clicked"),
          },
        });
      } else {
        toast.error("Login failed", {
          description: "There was a problem with your request.",
          action: {
            label: "Try again",
            onClick: () => console.log("Try again clicked"),
          },
        });
      }
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}