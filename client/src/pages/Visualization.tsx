import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarLeft } from '@/components/Sidebar/Sidebar'
import Relations from "@/components/Relations/Relations"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import CypherQueryExecutor from "@/components/ConnectNeo4j/ConnectNeo4j"
import { useParams } from "react-router-dom"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Visualization = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const devhub_username = localStorage.getItem('devhub_username');

        if (!devhub_username) {
            navigate('/login');
        }
    }, [navigate]);
    const { username: paramsUsername } = useParams<{ username: string }>();
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
                    <h1 className="ml-5 text-5xl mt-2">Neo4j KGs</h1>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                    <Tabs defaultValue="userRelation" className="mt-5 w-full">
                        <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="userRelation">{paramsUsername} Relations</TabsTrigger>
                            <TabsTrigger value="seeRelation">Exec. Cypher Query</TabsTrigger>
                        </TabsList>
                            <TabsContent value="userRelation">
                                <Relations />
                        </TabsContent>
                            <TabsContent value="seeRelation">
                            <CypherQueryExecutor />
                        </TabsContent>
                    </Tabs>
                </div>  
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Visualization