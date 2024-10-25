import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <Tabs defaultValue="dark" className="mt-5 w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="dark" onClick={() => setTheme("dark")}><Moon className="h-4 w-4 mr-2" />Dark</TabsTrigger>
        <TabsTrigger value="light" onClick={() => setTheme("light")}><Sun className="h-4 w-4 mr-2"/>Light</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
