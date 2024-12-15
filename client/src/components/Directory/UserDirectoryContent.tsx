import { useState, useMemo } from 'react'
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { groupUsersByFirstLetter, User } from './directoryUtils'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

async function getUsers() {
  const res = await fetch(`${backendUrl}/directory`)
  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  return res.json()
}

export default function UserDirectoryContent() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useMemo(() => {
    getUsers()
      .then(fetchedUsers => {
        setUsers(fetchedUsers)
        setIsLoading(false)
      })
      .catch(() => {
        setError('Failed to fetch users. Please try again later.')
        setIsLoading(false)
      })
  }, [])

  const filteredAndGroupedUsers = useMemo(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return groupUsersByFirstLetter(filtered)
  }, [users, searchTerm])

  if (isLoading) return (<div>Loading...</div>)
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <>
      <Input
        type="text"
        placeholder="Search by username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <ScrollArea className="h-[600px]">
        {Object.entries(filteredAndGroupedUsers).map(([letter, groupUsers]) => (
          <div key={letter} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{letter}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {groupUsers.map(user => (
                <Card key={user.username} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${user.username.slice(0, 2).toUpperCase()}`} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className='overflow-x-auto'>
                        <a href={`/user/${user.username}`}><p className="font-medium">{user.username}</p></a>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  )
}

