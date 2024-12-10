import { Link } from "react-router-dom"
import { ModeToggle } from "../Theme/mode-toggle"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";
import { FeedbackForm } from "@/components/Feedback/FeedbackForm"

const Footer = () => {
    const scrollToFeatures = () => {
        const item = document.getElementById('features');
        if (item) {
            item.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div>
            <footer className="border-t border-zinc-800">
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <Link to="/" className="inline-block">
                                <span className="text-[40px] text-bold">dh</span>
                            </Link>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">Resources</h3>
                            <ul className="space-y-2">
                                <li><Link to="/docs" className="text-white-400 text-sm">Docs</Link></li>
                                <li><Link to="" onClick={scrollToFeatures} className="text-white-400 text-sm">Features</Link></li>
                                <li><Link to="/feed" className="text-white-400 text-sm">Feed</Link></li>
                                <li><Link to="/directory" className="text-white-400 text-sm">Directory</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">More</h3>
                            <ul className="space-y-2">
                                <li>
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            Feedback
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <div className='flex items-center'>
                                                <AlertDialogHeader className='text-2xl'>Feedback Form</AlertDialogHeader>
                                                <div className='flex-grow'></div>
                                                <AlertDialogCancel className="ml-6"><Cross1Icon className='h-3 w-3' /></AlertDialogCancel>
                                            </div>
                                            <FeedbackForm />
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </li>
                                <li><Link to="/playground" className="text-white-400 text-sm">DevBots</Link></li>
                                <li><Link to="/v0" className="text-white-400 text-sm">DevMap</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">Contact</h3>
                            <ul className="space-y-2">
                                <li><Link to="https://github.com/devhub-ai/devhub" className="text-white-400 text-sm">GitHub</Link></li>
                                <li><Link to="https://www.linkedin.com/in/deepraj-bera-b64996231" className="text-white-400 text-sm">Linkedin</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link to="/privacy-policy" className="text-white-400 text-sm">Privacy Policy</Link></li>
                                <li><Link to="/terms-and-conditions" className="text-white-400 text-sm">Terms & Conditions</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-16 pt-8 border-t border-zinc-800">
                        <div className="text-sm text-white-400">
                            © 2024 DevHub
                        </div>
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
