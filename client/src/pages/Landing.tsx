import React from 'react';
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { FeaturesSectionDemo } from '@/components/Hero/features';
import Footer from '@/components/Footer/Footer';
import { Navbar } from '@/components/Navbar/navbar';
import { Hero } from '@/components/Hero/Hero';

const Landing: React.FC = () => {
  return (
    <div className="w-full rounded-md md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden w-full dark:bg-zinc-900 bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] items-center justify-center" >
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

      <Navbar />

      <div className="mt-[2rem] p-4 max-w-7xl mx-auto relative z-20 w-full pt-20 md:pt-0 flex flex-col items-center">
        <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block mb-8">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
            <span>
              Connect | Collaborate | Create
            </span>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
        <h1 className="text-4xl md:text-8xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          DevHub
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          The platform offers intelligent matchmaking and personalized recommendations to form effective teams and engage in meaningful collaborations.
        </p>
        <div className='mt-8'>
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            <span>Login to Continue</span>
          </HoverBorderGradient>
        </div>
      </div>

      <Hero />
      
      <FeaturesSectionDemo />

      <Footer />

    </div>
  );
};

export default Landing;
