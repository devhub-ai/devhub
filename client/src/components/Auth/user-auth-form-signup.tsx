"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
interface PasswordRules {
  minLength: boolean;
  containsUpper: boolean;
  containsLower: boolean;
  containsNumber: boolean;
  containsSpecial: boolean;
  noWhitespace: boolean;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordRules, setPasswordRules] = useState<PasswordRules | null>(
    null
  );
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (username) {
        try {
          if (username.match(/^[a-zA-Z0-9]+$/) === null) {
            setUsernameError("Username must be alphanumeric");
            setIsUsernameAvailable(null);
            return;
          } else if (username.length <= 7) {
            setUsernameError("Username must be greater than 7 characters");
            setIsUsernameAvailable(null);
            return;
          } else if (username.length >= 12) {
            setUsernameError("Username must be less than 12 characters");
            setIsUsernameAvailable(null);
            return;
          }
          setUsernameError("");
          const response = await axios.get(`${backendUrl}/check_username`, {
            params: { username },
          });
          setIsUsernameAvailable(response.data.available);
        } catch (error) {
          console.error("Error checking username availability:", error);
        }
      } else {
        setIsUsernameAvailable(null);
        setUsernameError("");
      }
    };

    const delayDebounceFn = setTimeout(() => {
      checkUsernameAvailability();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const validatePassword = (password: string): PasswordRules => {
    return {
      minLength: password.length >= 6,
      containsUpper: /[A-Z]/.test(password),
      containsLower: /[a-z]/.test(password),
      containsNumber: /\d/.test(password),
      containsSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      noWhitespace: !/\s/.test(password),
    };
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    const passwordValidityConditions = validatePassword(newPassword);
    setPasswordRules(passwordValidityConditions);
    const isNewPasswordValid = Object.values(passwordValidityConditions).every(
      (rulePassed) => rulePassed === true
    );
    setIsPasswordValid(isNewPasswordValid);
  };

  const passwordRuleMessages: Record<keyof PasswordRules, string> = {
    minLength: "Should be a minimum of 6 characters.",
    containsUpper: "Contains at least one uppercase letter.",
    containsLower: "Contains at least one lowercase letter.",
    containsNumber: "Contains at least one number.",
    containsSpecial: "Contains at least one special symbol.",
    noWhitespace: "Should not contain spaces.",
  };

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    if (usernameError || !isPasswordValid) {
      return;
    }

    try {
      await axios.post(`${backendUrl}/signup`, { username, email, password });
      toast.success("Signup successful", {
        description: "You can now log in with your new account.",
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      navigate("/login"); // Redirect to login page on successful signup
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message, {
          description: "Please check your details and try again.",
          action: {
            label: "Try again",
            onClick: () => console.log("Try again clicked"),
          },
        });
      } else {
        toast.error("Signup failed", {
          description: "There was a problem with your request.",
          action: {
            label: "Try again",
            onClick: () => console.log("Try again clicked"),
          },
        });
      }
      console.error("Error during signup:", err);
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
              required
            />
            {isUsernameAvailable === false && (
              <p className="text-red-500">Username is not available</p>
            )}
            {isUsernameAvailable === true && (
              <p className="text-green-500">Username is available</p>
            )}
            {usernameError && <p className="text-red-500">{usernameError}</p>}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              onChange={handlePasswordChange}
              required
            />
            {passwordRules &&
              Object.entries(passwordRules).map(([rule, passed]) => (
                <p
                  key={rule}
                  className={passed ? "text-green-500" : "text-red-500"}
                >
                  {passwordRuleMessages[rule as keyof PasswordRules]}
                </p>
              ))}
          </div>
          <Button
            disabled={
              isLoading ||
              isUsernameAvailable === false ||
              usernameError !== "" ||
              isPasswordValid === false
            }
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}
