import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import UpdateProfile from "./UpdateProfile"
import WebappSettings from "./WebappSettings"

const Setting = () => {
    return (
        <Tabs defaultValue="profile" className="mt-5 w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="webapp">WebApp</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <UpdateProfile />
            </TabsContent>
            <TabsContent value="webapp">
                <WebappSettings />
            </TabsContent>
        </Tabs>
    )
}

export default Setting