"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Check, X } from "lucide-react";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }
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
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [usernameError, setUsernameError] = useState<string>("");
  const [passwordRules, setPasswordRules] = useState<PasswordRules | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
  const allRulesPassed = passwordRules && Object.values(passwordRules).every((passed) => passed === true);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasStartedTyping(true); 
    handlePasswordChange(e);
  };

  // Username availability check with debounce
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

          const response = await fetch(`${backendUrl}/check_username?username=${username}`);
          const data = await response.json();
          setIsUsernameAvailable(data.available);
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

  // Password validation rules
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

  // Form submission handler
  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    if (usernameError || !isPasswordValid) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      toast.success("Signup successful", {
        description: "You can now log in with your new account.",
        action: {
          label: "Login",
          onClick: () => navigate("/login"),
        },
      });
      navigate("/login");
    } catch (error) {
      toast.error(`Signup failed ${error}`, {
        description: "Please check your details and try again.",
        action: {
          label: "Try again",
          onClick: () => console.log("Try again clicked"),
        },
      });
      console.error("Error during signup:", error);
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

            {/* Container for input and icon */}
            <div className="relative flex items-center">
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
                className="dark:bg-zinc-900 pr-10" // Add padding to the right for the icon
                required
              />

              {/* HoverCard for the green tick */}
              {isUsernameAvailable && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Check className="absolute right-3 text-green-500" />
                  </HoverCardTrigger>
                  <HoverCardContent className="text-green-500 text-sm bg-zinc-900">
                    Username is available
                  </HoverCardContent>
                </HoverCard>
              )}
              {isUsernameAvailable === false && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <X className="absolute right-3 text-red-500" />
                  </HoverCardTrigger>
                    <HoverCardContent className="text-red-500 text-sm bg-zinc-900">
                      Username is not available
                    Username is not available
                    </HoverCardContent>
                </HoverCard>
              )}

              {usernameError && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <X className="absolute right-3 text-red-500" />
                  </HoverCardTrigger>
                  <HoverCardContent className="text-red-500 text-sm bg-zinc-900">
                    {usernameError}
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>
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
              className='dark:bg-zinc-900'
              required
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>

            <div className="relative flex items-center">
              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoComplete="current-password"
                disabled={isLoading}
                value={password}
                onChange={handleInputChange}
                className="dark:bg-zinc-900 pr-10"
                required
              />

              {/* Show the validation only after user has started typing */}
              {hasStartedTyping && (
                <>
                  {allRulesPassed ? (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Check className="absolute right-3 text-green-500" />
                      </HoverCardTrigger>
                      <HoverCardContent className="text-green-500 text-sm bg-zinc-900">
                        {passwordRules &&
                          Object.entries(passwordRules).map(([rule, passed]) => (
                            <p key={rule} className={passed ? "text-green-500" : "text-red-500"}>
                              {passwordRuleMessages[rule as keyof typeof passwordRuleMessages]}
                            </p>
                          ))}
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <X className="absolute right-3 text-red-500" />
                      </HoverCardTrigger>
                      <HoverCardContent className="text-red-500 text-sm bg-zinc-900">
                        {passwordRules &&
                          Object.entries(passwordRules).map(([rule, passed]) => (
                            <p key={rule} className={passed ? "text-green-500" : "text-red-500"}>
                              {passwordRuleMessages[rule as keyof typeof passwordRuleMessages]}
                            </p>
                          ))}
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </>
              )}
            </div>
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
