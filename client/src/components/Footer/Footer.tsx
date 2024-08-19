import { Link } from 'react-router-dom';

// Third-party library imports
import Balancer from "react-wrap-balancer";

// UI component imports
import { Button } from "../ui/button";

// Icon imports
import { Github, Twitter, Facebook } from "lucide-react";

// Local component imports
import { Section, Container } from "@/components/ui/craft";

// Asset imports
// import Logo from "@/public/logo.svg";

export default function Footer() {
    return (
        <footer>
            <Section>
                <Container className="grid gap-12 md:grid-cols-[1.5fr_0.5fr_0.5fr]">
                    <div className="not-prose flex flex-col gap-6">
                        <Link to="/">
                            <h3 className="sr-only">brijr/components</h3>
                            {/* <img
                                src={Logo}
                                alt="Logo"
                                width={120}
                                height={27.27}
                                className="transition-all hover:opacity-75 dark:invert"
                            ></img> */}
                        </Link>
                        <p>
                            <Balancer>
                                brijr/components is a collection of Next.js, React, Typescript
                                components for building landing pages and websites.
                            </Balancer>
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h5>Website</h5>
                        <Link to="/">Blog</Link>
                        <Link to="/">Authors</Link>
                        <Link to="/">Categories</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h5>Legal</h5>
                        <Link to="/privacy-policy">Privacy Policy</Link>
                        <Link to="/terms-of-service">Terms of Service</Link>
                        <Link to="/cookie-policy">Cookie Policy</Link>
                    </div>
                </Container>
                <Container className="not-prose flex flex-col justify-between gap-6 border-t md:flex-row md:items-center md:gap-2">
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                            <Github />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Twitter />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Facebook />
                        </Button>
                    </div>
                    <p className="text-muted-foreground">
                        ©{" "}
                        <a to="https://github.com/brijr/components">brijr/components</a>.
                        All rights reserved. 2024-present.
                    </p>
                </Container>
            </Section>
        </footer>
    );
}
