import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function ModeToggle() {
  const { setTheme } = useTheme()

  const appTheme = localStorage.getItem('vite-ui-theme') || 'dark';

  return (
    <Tabs defaultValue={appTheme} className="w-full">
      <TabsList className="grid w-22 flex grid-cols-2 rounded-full">
        <TabsTrigger value="dark" onClick={() => setTheme("dark")} className="w-10 rounded-full"><Moon className="h-4 w-4" /></TabsTrigger>
        <TabsTrigger value="light" onClick={() => setTheme("light")} className="w-10 rounded-full"><Sun className="h-4 w-4"/></TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
