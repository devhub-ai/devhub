import { useEffect, useState } from 'react'
import axios from 'axios'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronUp, ChevronDown, MessageCircle, Send } from "lucide-react"

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

interface Post {
    _id: string
    author_username: string
    description: string
    tags: string[]
    image_link?: string
    upvotes: number
    downvotes: number
    created_at: string
    comments: Comment[]
}

interface Comment {
    _id: string
    post_id: string
    user_username: string
    text: string
    created_at: string
}

export default function ShowPosts() {
    const [posts, setPosts] = useState<Post[]>([])
    const [commentText, setCommentText] = useState<string>('')
    const [selectedPost, setSelectedPost] = useState<string | null>(null)
    const [openComments, setOpenComments] = useState<Record<string, boolean>>({})

    useEffect(() => {
        axios.get(`${backendUrl}/posts`)
            .then(response => {
                setPosts(response.data)
            })
            .catch(error => {
                console.error('Error fetching posts:', error)
            })
    }, [])

    const handleCommentSubmit = (postId: string) => {
        if (!commentText) return

        const commentData = {
            user_username: localStorage.getItem('devhub_username'),
            text: commentText,
        }

        axios.post(`${backendUrl}/posts/${postId}/comments`, commentData)
            .then(response => {
                const updatedPosts = posts.map(post => {
                    if (post._id === postId) {
                        return {
                            ...post,
                            comments: [...post.comments, response.data],
                        }
                    }
                    return post
                })
                setPosts(updatedPosts)
                setCommentText('')
            })
            .catch(error => {
                console.error('Error adding comment:', error)
            })
    }

    const toggleComments = (postId: string) => {
        setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }))
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-8">
            {posts.map((post) => (
                <div key={post._id} className="bg-background shadow-lg rounded-lg overflow-hidden border">
                    <div className="p-4">
                        <div className="flex items-center mb-4">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="" alt={post.author_username} />
                                <AvatarFallback>{post.author_username}</AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{post.author_username}</p>
                                <p className="text-xs text-muted-foreground">
                                    Posted {new Date(post.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        {post.image_link && (
                            <img
                                src={post.image_link}
                                alt="Post image"
                                className="w-full h-64 object-cover rounded-md mb-4"
                            />
                        )}
                        <p className="text-sm mb-2">{post.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <ChevronUp className="h-5 w-5" />
                                <span>{post.upvotes}</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                            >
                                <ChevronDown className="h-5 w-5" />
                                <span>{post.downvotes}</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => toggleComments(post._id)}
                            >
                                <MessageCircle className="h-5 w-5" />
                                <span>{post.comments.length}</span>
                            </Button>
                        </div>
                        <DropdownMenu open={openComments[post._id]} onOpenChange={() => toggleComments(post._id)}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    {openComments[post._id] ? 'Hide Comments' : 'Show Comments'}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full" align="start">
                                <div className="p-4 space-y-4 max-h-60 overflow-y-auto">
                                    {post.comments.slice(0, 3).map((comment) => (
                                        <div key={comment._id} className="flex items-start gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src="/placeholder.svg?height=32&width=32" alt={comment.user_username} />
                                                <AvatarFallback>{comment.user_username}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{comment.user_username}</p>
                                                <p className="text-sm">{comment.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {post.comments.length > 3 && (
                                        <p className="text-sm text-muted-foreground text-center">
                                            {post.comments.length - 3} more comments...
                                        </p>
                                    )}
                                </div>
                                <div className="border-t p-4">
                                    <form onSubmit={(e) => {
                                        e.preventDefault()
                                        handleCommentSubmit(post._id)
                                    }} className="flex items-center gap-2">
                                        <Input
                                            type="text"
                                            placeholder="Add a comment..."
                                            value={commentText}
                                            onChange={(e) => {
                                                setCommentText(e.target.value)
                                                setSelectedPost(post._id)
                                                console.log(selectedPost)
                                            }}
                                            className="flex-grow"
                                        />
                                        <Button type="submit" size="sm">
                                            <Send className="h-4 w-4" />
                                            <span className="sr-only">Send comment</span>
                                        </Button>
                                    </form>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ))}
        </div>
    )
}