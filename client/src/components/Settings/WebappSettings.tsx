import { ModeToggle } from "../Theme/mode-toggle"
import DeleteAccount from "./DeleteAccount"

const WebappSettings = () => {
  return (
    <div className='p-2 mt-4 h-full overflow-auto'>
      <h2 className='text-xl font-semibold mb-4 dark:text-neutral-100'>
        Update Theme
      </h2>
      <ModeToggle />
      <h2 className='text-xl font-semibold mb-4 dark:text-neutral-100 mt-4'>
        Delete Account
      </h2>
      <DeleteAccount />
    </div>  
  )
}

export default WebappSettings