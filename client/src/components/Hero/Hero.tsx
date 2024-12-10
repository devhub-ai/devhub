import { UserSearch, MessagesSquare, FolderOpen, ChartNetwork, UserPen, GalleryVerticalEnd } from 'lucide-react';

export function Hero() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full md:w-[60%]">

      <div className="bg-zinc-800 rounded-lg">
        <div className="relative h-48 bg-black rounded-tl-lg rounded-tr-lg overflow-hidden p-2">
          <img src="https://i.ibb.co/tx4dhcj/Screenshot-2024-12-09-131735.png" alt="" className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105 rounded-[5px]"/>
        </div>
        <div className="p-6 bg-zinc-800 rounded-bl-lg rounded-br-lg">
          <div className='flex flex-row gap-x-2 items-center'>
            <UserSearch className='h-5 w-5 text-zinc-200'/>
            <h3 className="text-lg font-semibold text-zinc-200">Search and Recomendations</h3>
          </div>
          <p className="text-sm text-zinc-400">
            Find People and recommendations based on skillset and prjects.
          </p>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg">
        <div className="relative h-48 bg-black rounded-tl-lg rounded-tr-lg overflow-hidden p-2">
          <img src="https://i.ibb.co/GdMdhts/Screenshot-2024-12-09-131307.png" alt="" className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105 rounded-[5px]" />
        </div>
        <div className="p-6 bg-zinc-800 rounded-bl-lg rounded-br-lg">
          <div className='flex flex-row gap-x-2  items-center'>
            <MessagesSquare className='h-5 w-5 text-zinc-200'/>
            <h3 className="text-lg font-semibold text-zinc-200">Chat with People</h3>
            </div>
          <p className="text-sm text-zinc-400">
            Find People from list and start conversation with developers.
          </p>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg">
        <div className="relative h-48 bg-black rounded-tl-lg rounded-tr-lg overflow-hidden p-2">
          <img src="https://i.ibb.co/zhFXyWh/Screenshot-2024-12-09-101722.png" alt="" className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105 rounded-[5px]"/>
        </div>
        <div className="p-6 bg-zinc-800 rounded-bl-lg rounded-br-lg">
          <div className='flex flex-row gap-x-2  items-center'>
            <FolderOpen className='h-5 w-5 text-zinc-200'/>
            <h3 className="text-lg font-semibold text-zinc-200">Showcase Projects</h3>
          </div>
          <p className="text-sm text-zinc-400">
            Add, Share and Star projects of your and others and show your skills.
          </p>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg">
        <div className="relative h-48 bg-black rounded-tl-lg rounded-tr-lg p-2 overflow-hidden">
          <img src="https://i.ibb.co/GJ561rC/Screenshot-2024-12-09-125415.png" alt="" className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105 rounded-[5px]"/>
        </div>
        <div className="p-6 bg-zinc-800 rounded-bl-lg rounded-br-lg">
            <div className='flex flex-row gap-x-2  items-center'>
            <ChartNetwork className='h-5 w-5 text-zinc-200'/>
              <h3 className="text-lg font-semibold text-zinc-200">Connections as Nodes</h3>
            </div>
        
          <p className="text-sm text-zinc-400">
            See your Connections and projects as nodes and execute Neo4j Queries.
          </p>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg">
        <div className="relative h-48 bg-black rounded-tl-lg rounded-tr-lg p-2 overflow-hidden">
          <img src="https://i.ibb.co/MM1jQrz/Screenshot-2024-12-09-125706.png" alt="" className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105 rounded-[5px]"/>
        </div>
        <div className="p-6 bg-zinc-800 rounded-bl-lg rounded-br-lg">
          <div className='flex flex-row gap-x-2  items-center'>
            <GalleryVerticalEnd className='h-5 w-5 text-zinc-200'/>
          <h3 className="text-lg font-semibold text-zinc-200">Feed and Posts</h3>
          </div>
          <p className="text-sm text-zinc-400">
            Add, Share, Upvote, Downvote, comment on Posts and updated Feed.
          </p>
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg ">
        <div className="relative h-48 bg-black rounded-tl-lg rounded-tr-lg p-2 overflow-hidden">
          <img src="https://i.ibb.co/XCWQVQ1/Screenshot-2024-12-09-125857.png" alt="" className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105 rounded-[5px]"/>
        </div>
        <div className="p-6 bg-zinc-800 rounded-bl-lg rounded-br-lg">
          <div className='flex flex-row gap-x-2  items-center'>
            <UserPen className='h-5 w-5 text-zinc-200'/>
          <h3 className="text-lg font-semibold text-zinc-200">Sharble Profile</h3>
          </div>
          <p className="text-sm text-zinc-400">
            Update, Follow and share your profiles with others.
          </p>
        </div>
      </div>
    </div>

  );
}

