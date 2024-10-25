import { ModeToggle } from "../Theme/mode-toggle"

const WebappSettings = () => {
  return (
    <div className = 'p-2 mt-4 h-full overflow-auto'>
          <h2 className='text-xl font-semibold mb-4 dark:text-neutral-100'>
              Update Theme
          </h2>
          <ModeToggle/>
    </div>
  )
}

export default WebappSettings