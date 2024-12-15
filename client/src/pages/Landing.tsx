import React from 'react';
import Footer from '@/components/Footer/Footer';
import { Navbar } from "@/components/Navbar/Navbar";
import { Hero } from '@/components/Hero/Hero';
import { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import Products from '@/components/Products/Products';


const Landing: React.FC = () => {

  const username = localStorage.getItem('devhub_username');

  useEffect(() => {
  }, [username]);
  
  return (
    <>
      <div className="rounded-md md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden w-full dark:bg-zinc-900 bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.3] items-center justify-center bg-fixed">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_bottom,transparent_60%,black)]"></div>
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        <div id="top" className="p-4 max-w-7xl mx-auto relative z-20 w-full pt-20 md:pt-0 flex flex-col items-center md:mt-24 mt-14">
          <div className="py-2 mt-16 grid hidden md:block">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="bg-[#00FFA3]/10 text-[#00FFA3] px-2 py-0.5 rounded-full text-xs font-medium uppercase">
                  New
                </span>
                <span className="text-white-800">
                  ✨ DevBots are available and ready to assist you!
                </span>
                <Button variant="link" size="sm" className="text-white-800 font-normal inline-flex items-center">
                  🎉 Get Started
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 p-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white mb-6">
            Build amazing connections
          </h1>
          <p className="mt-2 font-normal text-base text-neutral-300 max-w-[650px] text-center mx-auto bg-clip-text text-transparent dark:bg-white bg-black from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
            Intelligent matchmaking and personalized recommendations
          </p>
          <div className='mt-8 flex space-x-4'>
            <div className="flex items-center gap-4">
              <Button className='rounded-[12px]' onClick={() => {
                window.location.href = '/login';
              }}>Get Started</Button>
            </div>
          </div>
        </div>
        <div className="py-2 mt-16" id="features">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="bg-[#00FFA3]/10 text-[#00FFA3] px-2 py-0.5 rounded-full text-xs font-medium uppercase">
                FEATURES
              </span>
              <span className="text-white-800">
                What we provide ?
              </span>
            </div>
          </div>
        </div>
        <div className='mt-10 p-10 flex justify-center' id='features'>
          <Hero />
        </div>
        <div className="py-2 mt-16" id="products">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="bg-[#00FFA3]/10 text-[#00FFA3] px-2 py-0.5 rounded-full text-xs font-medium uppercase">
                PRODUCTS
              </span>
              <span className="text-white-800">
                Everything you need.
              </span>
            </div>
          </div>
        </div>
        <div className='mt-10 p-10 flex justify-center' id='features'>
          <Products />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Landing;
