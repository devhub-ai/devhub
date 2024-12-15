import { Button } from "@/components/ui/button"
import {Link} from 'react-router-dom'

const ErrorPage = () => {
    return (
        <main className="grid min-h-screen place-items-center bg-background text-foreground px-6 py-24 dark:bg-zinc-900">
            <div className="text-center">
                <p className="text-base font-semibold text-primary">404</p>
                <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
                    Page not found
                </h1>
                <p className="mt-6 text-pretty text-base text-muted-foreground sm:text-lg max-w-prose mx-auto">
                    Sorry, we couldn't find the page you're looking for. Please check the URL or navigate back to the homepage.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button asChild>
                        <Link to="/">
                            Go back home
                        </Link>
                    </Button>
                </div>
            </div>
        </main>
    )
}

export default ErrorPage

