import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { InputWithButton } from "./subscribe"

export function DrawerDemo() {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Know About Us</Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <InputWithButton />
                       
                    </div>
                    <DrawerFooter>
                       
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
