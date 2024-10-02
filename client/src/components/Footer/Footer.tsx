import { Link } from 'react-router-dom';

// Third-party library imports
import Balancer from "react-wrap-balancer";

// UI component imports
import { Button } from "../ui/button";

// Icon imports
import { Github } from "lucide-react";

// Local component imports
import { Section, Container } from "@/components/ui/craft";
import { DiscordLogoIcon } from '@radix-ui/react-icons';

// Asset imports
// import Logo from "@/public/logo.svg";

export default function Footer() {
    const handleGithubClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevent any default button behavior
        window.open("https://github.com/devhub-ai/devhub", "_blank");
    };
    const handleDiscordClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevent any default button behavior
        window.open("https://discord.gg/he8QHEC8WP", "_blank");
    };
    return (
        <footer>
            <Section>
                <Container className="grid gap-12 md:grid-cols-[1.5fr_0.5fr_0.5fr]">
                    <div className="not-prose flex flex-col gap-6">
                        <div className='logo'>
                            <img
                                src="https://i.ibb.co/kh28sVv/cropped-image.png"
                                alt="Logo"
                                width={60}
                                height={27.27}
                                className="transition-all hover:opacity-75 dark:invert"
                            ></img>
                        </div>
                        <p>
                            <Balancer>
                                DevHub is an innovative platform designed to connect developers who share similar interests and complementary skills.
                            </Balancer>
                        </p>
                    </div>
                    <div className="flex flex-col gap-2" style={{justifyContent: 'flex-end'}}>
                        <h5>Legal</h5>
                        <Link to="/privacy-policy">Privacy Policy</Link>
                    </div>
                    <div className="flex flex-col justify-cont gap-2" style={{justifyContent: 'flex-end'}}>
                        <Link to="/terms-of-service">Terms of Service</Link>
                        <Link to="/cookie-policy">Cookie Policy</Link>
                    </div>
                </Container>
                <Container className="not-prose flex flex-col justify-between gap-6 border-t md:flex-row md:items-center md:gap-2">
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={handleGithubClick}>
                            <Github />
                        </Button>
                        <Button variant="outline" size="icon" onClick={handleDiscordClick}>
                            <DiscordLogoIcon />
                        </Button>
                    </div>
                    <p className="text-muted-foreground">
                        ©{" "}
                        <span>Devhub</span>.
                        All rights reserved. 2024.
                    </p>
                </Container>
            </Section>
        </footer>
    );
}
