import {
    Home,
} from "lucide-react"

const Sidebar = () => {
  return (
      <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <a href="/" className="flex items-center gap-2 font-semibold">
                      <span className="">Devhub</span>
                  </a>

              </div>
              <div className="flex-1">
                  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                      <a
                          href="/home"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary mt-4"
                      >
                          <Home className="h-4 w-4" />
                          Home
                      </a>
                     
                  </nav>
              </div>
          </div>
      </div>
  )
}

export default Sidebar