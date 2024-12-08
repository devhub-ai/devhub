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
                                <li><Link to="/docs" className="text-gray-400 hover:text-white">Docs</Link></li>
                                <li><Link to="/cookbook" className="text-gray-400 hover:text-white">Cookbook</Link></li>
                                <li><Link to="/providers" className="text-gray-400 hover:text-white">Providers</Link></li>
                                <li><Link to="/showcase" className="text-gray-400 hover:text-white">Showcase</Link></li>
                                <li><Link to="/github" className="text-gray-400 hover:text-white">GitHub</Link></li>
                                <li><Link to="/discussions" className="text-gray-400 hover:text-white">Discussions</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">More</h3>
                            <ul className="space-y-2">
                                <li><Link to="/playground" className="text-gray-400 hover:text-white">Playground</Link></li>
                                <li><Link to="/v0" className="text-gray-400 hover:text-white">v0</Link></li>
                                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Sales</Link></li>
                                <li><Link to="/x" className="text-gray-400 hover:text-white">X</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">About Vercel</h3>
                            <ul className="space-y-2">
                                <li><Link to="/nextjs" className="text-gray-400 hover:text-white">Next.js + Vercel</Link></li>
                                <li><Link to="/open-source" className="text-gray-400 hover:text-white">Open Source Software</Link></li>
                                <li><Link to="/github" className="text-gray-400 hover:text-white">GitHub</Link></li>
                                <li><Link to="/x" className="text-gray-400 hover:text-white">X</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-3">Legal</h3>
                            <ul className="space-y-2">
                                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-16 pt-8 border-t border-zinc-800">
                        <div className="text-sm text-gray-400">
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
