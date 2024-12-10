import { Suspense } from 'react'
import UserDirectoryContent from './UserDirectoryContent'

const UserDirectory = () => {
  return (
      <div className="container mx-auto">
          <h1 className="text-5xl mt-2 mb-3">Developer Directory</h1>
          <Suspense fallback={<div>Loading...</div>}>
              <UserDirectoryContent />
          </Suspense>
      </div>
  )
}

export default UserDirectory