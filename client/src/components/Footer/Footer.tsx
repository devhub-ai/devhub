import { Link } from "react-router-dom"
import { ModeToggle } from "../Theme/mode-toggle"

const Footer = () => {
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
                                <li><Link to="/docs" className="text-white-400 ">Docs</Link></li>
                                <li><Link to="/cookbook" className="text-white-400 ">Cookbook</Link></li>
                                <li><Link to="/providers" className="text-white-400 ">Providers</Link></li>
                                <li><Link to="/showcase" className="text-white-400 ">Showcase</Link></li>
                                <li><Link to="/github" className="text-white-400 ">GitHub</Link></li>
                                <li><Link to="/discussions" className="text-white-400 ">Discussions</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">More</h3>
                            <ul className="space-y-2">
                                <li><Link to="/playground" className="text-white-400 ">Playground</Link></li>
                                <li><Link to="/v0" className="text-white-400 ">v0</Link></li>
                                <li><Link to="/contact" className="text-white-400 ">Contact Sales</Link></li>
                                <li><Link to="/x" className="text-white-400 ">X</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">About Vercel</h3>
                            <ul className="space-y-2">
                                <li><Link to="/nextjs" className="text-white-400 ">Next.js + Vercel</Link></li>
                                <li><Link to="/open-source" className="text-white-400 ">Open Source Software</Link></li>
                                <li><Link to="/github" className="text-white-400 ">GitHub</Link></li>
                                <li><Link to="/x" className="text-white-400 ">X</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link to="/privacy" className="text-white-400 ">Privacy Policy</Link></li>
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
