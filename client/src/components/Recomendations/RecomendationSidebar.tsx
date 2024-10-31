import {
    Sidebar,
    SidebarHeader,
    SidebarRail,
    SidebarProvider,
    SidebarInset,
    SidebarTriggerRight,
} from "@/components/ui/sidebar";
import Recomendations from "./Recomendations";

export default function DevhubSidebar() {
    return (
        <SidebarProvider>
            <SidebarRight />
            <SidebarInset>
                <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTriggerRight />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <div className="mx-auto h-24 w-full max-w-3xl rounded-xl bg-muted/50" />
                    <div className="mx-auto h-[100vh] w-full max-w-3xl rounded-xl bg-muted/50" />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export function SidebarRight({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar className="border-l-0" {...props} side="right">
            <SidebarHeader>
                <h1 className="text-4xl mt-4">Recomended</h1>
            </SidebarHeader>
            <SidebarHeader>
                <Recomendations />
            </SidebarHeader>
            <SidebarRail />
        </Sidebar>
    )
}
