import { ScrollArea } from "@/components/ui/scroll-area"

export default function PrivacyPolicy() {
    const lastUpdated = "October 24, 2024"

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-6">Devhub Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>

                <ScrollArea className="h-[600px] rounded-md border p-4">
                    <div className="pr-4">
                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                            <p>Welcome to Devhub. We value your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or interact with our services.</p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                            <h3 className="text-xl font-medium mb-2">Personal Data</h3>
                            <p>When you visit our site, we may collect personal information such as:</p>
                            <ul className="list-disc pl-6 mb-4">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Contact information</li>
                                <li>Any other information you voluntarily provide via contact forms or user profiles</li>
                            </ul>
                            <h3 className="text-xl font-medium mb-2">Usage Data</h3>
                            <p>We may also collect non-personal information automatically when you interact with our website, such as:</p>
                            <ul className="list-disc pl-6">
                                <li>IP address</li>
                                <li>Browser type and version</li>
                                <li>Pages visited</li>
                                <li>Time and date of your visit</li>
                                <li>Referring websites</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                            <p>We may use the information collected in the following ways:</p>
                            <ul className="list-disc pl-6">
                                <li>To provide, operate, and maintain our website</li>
                                <li>To improve and personalize user experience</li>
                                <li>To understand and analyze how users interact with our site</li>
                                <li>To communicate with you, either directly or through one of our partners, including for customer service and updates</li>
                                <li>To comply with legal obligations or protect your rights</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
                            <p>We use cookies and similar tracking technologies to enhance your experience on our website, track user preferences, and gather analytical data. You can choose to disable cookies through your browser settings, but doing so may affect the functionality of our site.</p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
                            <p>We may use third-party services for analytics, marketing, or payment processing. These third parties may collect information in accordance with their own privacy policies. We are not responsible for the privacy practices of these third parties.</p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                            <p>We implement reasonable security measures to protect the personal information you provide us from unauthorized access, disclosure, or loss. However, no method of transmission over the internet or method of electronic storage is entirely secure.</p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Your Data Rights</h2>
                            <p>You have the following rights regarding your personal information:</p>
                            <ul className="list-disc pl-6">
                                <li>Access, update, or delete your personal data</li>
                                <li>Opt-out of marketing communications</li>
                                <li>Request restrictions on how we process your data</li>
                            </ul>
                            <p className="mt-4">To exercise any of these rights, please contact us at <a href="mailto:deepraj21.bera@gmail.com" className="text-blue-300 underline" >deepraj21.bera@gmail.com</a></p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
                            <p>Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We take appropriate measures to ensure that your personal data remains protected in accordance with this Privacy Policy.</p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
                            <p>We may update this Privacy Policy from time to time to reflect changes in our practices. We encourage you to review this page periodically for the latest information on our privacy practices.</p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                            <p>If you have any questions about this Privacy Policy, please contact us <a href="mailto:deepraj21.bera@gmail.com" className="text-blue-300 underline" target="_blank" rel="noopener noreferrer">here</a>.</p>
                        </section>
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}