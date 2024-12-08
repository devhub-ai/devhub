import React from "react";
import {Link} from 'react-router-dom';
import { Button } from "@/components/ui/button";

export type IconProps = React.HTMLAttributes<SVGElement> & React.ImgHTMLAttributes<HTMLImageElement>;

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black bg-opacity-50 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-6 w-6">dh</div>
              <span>|</span>
              <span className="font-bold">DevHub</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/providers" className="text-sm text-gray-400 hover:text-white">
                Features
              </Link>
              <Link to="/showcase" className="text-sm text-gray-400 hover:text-white">
                Products
              </Link>
              <Link to="/playground" className="text-sm text-gray-400 hover:text-white">
                Playground
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">Sign in with Github</Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
