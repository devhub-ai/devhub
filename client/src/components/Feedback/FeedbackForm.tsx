import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

export function FeedbackForm() {
    const [rating, setRating] = React.useState<number>(0)
    const [hoveredRating, setHoveredRating] = React.useState<number>(0)
    const [message, setMessage] = React.useState("")
    const [loading, setLoading] = React.useState(false) 
    const username = localStorage.getItem("devhub_username") || "Anonymous"

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        setLoading(true) 
        try {
            const response = await fetch(`${backendUrl}/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    rating: rating.toString(),
                    message,
                }),
            })
            const data = await response.json()
            if (data.success) {
                toast.success("Feedback message sent successfully")
                setRating(0) 
                setMessage("") 
            } else {
                toast.error("Failed to save feedback message")
            }
        } catch (error) {
            toast.error("An error occurred while sending feedback: " + error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md border-none">
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <h2 className="text-center text-xl font-semibold">
                        Your opinion matters to us!
                    </h2>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                    <div className="flex flex-col items-center space-y-3">
                        <span className="text-lg text-muted-foreground">
                            How was your experience?
                        </span>
                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus-visible:outline-none"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                >
                                    <Star
                                        className={cn(
                                            "h-8 w-8 transition-colors",
                                            (hoveredRating || rating) >= star
                                                ? "fill-primary text-primary"
                                                : "fill-muted text-muted"
                                        )}
                                    />
                                    <span className="sr-only">Rate {star} stars</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <Textarea
                        placeholder="Leave a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full"
                        disabled={loading} 
                    />
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
