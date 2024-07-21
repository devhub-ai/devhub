import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { InputWithButton } from "./subscribe"

export function DrawerDemo() {
    const [goal, setGoal] = React.useState(350)

    function onClick(adjustment: number) {
        setGoal(Math.max(200, Math.min(400, goal + adjustment)))
    }

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
