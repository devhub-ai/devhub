import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarLeft } from '@/components/Sidebar/Sidebar'
import UserDirectory from "@/components/Directory/UserDirectory";

const Directory = () => {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
          </div>
        </header>
        <main className="flex flex-col flex-grow p-4 overflow-hidden">
          <div className="flex flex-col h-full">
            <UserDirectory />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Directory