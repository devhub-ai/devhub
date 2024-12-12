import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarLeft } from '@/components/Sidebar/Sidebar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function TermsAndConditions() {
    const lastUpdated = "October 25, 2024"
    return (
        <SidebarProvider>
            <SidebarLeft />
            <SidebarInset>
                <header className="sticky top-0 flex h-14 shrink-0 items-center gap-2 bg-background">
                    <div className="flex flex-1 items-center gap-2 px-3">
                        <SidebarTrigger />
                    </div>
                </header>
                <main className="flex flex-col flex-grow overflow-hidden">
                    <div className="min-h-screen bg-background text-foreground p-8">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-4xl  mb-6"><a href='/'>DevHub</a> Terms and Conditions</h1>
                            <p className="text-muted-foreground mb-8">Last updated: {lastUpdated}</p>
                                <div className="pr-4 space-y-6">
                                    <section>
                                        <h2 className="text-2xl  mb-4">Introduction</h2>
                                        <p>Welcome to<a href='/'> DevHub</a>. These Terms and Conditions govern your use of our website. By accessing or using our website, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please refrain from using our website.</p>
                                    </section>

                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="item-1">
                                            <AccordionTrigger>1. Acceptance of Terms</AccordionTrigger>
                                            <AccordionContent>
                                                <p>By accessing or using DevHub, you acknowledge that you have read, understood, and agreed to these Terms. We may modify these Terms at any time without prior notice, and it is your responsibility to check for updates periodically. Continued use of the website following changes signifies your acceptance of the revised Terms.</p>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-2">
                                            <AccordionTrigger>2. Use of the Website</AccordionTrigger>
                                            <AccordionContent>
                                                <p>You agree to use DevHub for lawful purposes only and in a manner that does not infringe on the rights of, restrict, or inhibit others' use and enjoyment of the site. Prohibited actions include but are not limited to:</p>
                                                <ul className="list-disc pl-6 mt-2">
                                                    <li>Engaging in any illegal activities.</li>
                                                    <li>Distributing viruses or any harmful software.</li>
                                                    <li>Breaching any intellectual property rights.</li>
                                                    <li>Uploading misleading, defamatory, or abusive content.</li>
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-3">
                                            <AccordionTrigger>3. Intellectual Property Rights</AccordionTrigger>
                                            <AccordionContent>
                                                <p>All content, including text, graphics, logos, and software available on DevHub, is the property of the website owner or its licensors and is protected by applicable intellectual property laws in India. You may not reproduce, distribute, or otherwise use any content without obtaining permission from the copyright owner.</p>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-4">
                                            <AccordionTrigger>4. User-Generated Content</AccordionTrigger>
                                            <AccordionContent>
                                                <p>Any content you upload, post, or share on DevHub (e.g., comments, feedback, suggestions) will remain your property, but by submitting such content, you grant us a non-exclusive, royalty-free, and worldwide license to use, distribute, and display the content. You are solely responsible for the content you share and must ensure that it does not violate any laws or third-party rights.</p>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-5">
                                            <AccordionTrigger>5. Limitation of Liability</AccordionTrigger>
                                            <AccordionContent>
                                                <p>DevHub, its owners, employees, or partners shall not be held liable for any direct, indirect, incidental, or consequential damages arising from your use of the website, including but not limited to:</p>
                                                <ul className="list-disc pl-6 mt-2">
                                                    <li>Loss of data.</li>
                                                    <li>Technical issues or disruptions.</li>
                                                    <li>Third-party content accessed through links on the website.</li>
                                                </ul>
                                                <p className="mt-2">We do not guarantee that the site will be error-free, uninterrupted, or free from viruses or harmful components.</p>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-6">
                                            <AccordionTrigger>6. Links to Third-Party Websites</AccordionTrigger>
                                            <AccordionContent>
                                                <p>DevHub may contain links to third-party websites or services, which are not owned or controlled by us. We have no responsibility for the content, privacy policies, or practices of third-party websites. You access any linked website at your own risk.</p>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-7">
                                            <AccordionTrigger>7. Privacy Policy</AccordionTrigger>
                                            <AccordionContent>
                                                <p>Your use of the website is also governed by our Privacy Policy, which can be found <a href="/privacy-policy" className="text-primary hover:underline">here</a>. By using DevHub, you agree to the collection and use of your personal data as outlined in our Privacy Policy.</p>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-8">
                                            <AccordionTrigger>8. Termination of Access</AccordionTrigger>
                                            <AccordionContent>
                                                <p>We reserve the right to suspend or terminate your access to DevHub without prior notice if you violate these Terms or engage in any conduct that we consider harmful to the site or its users.</p>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-9">
                                            <AccordionTrigger>9. Governing Law and Jurisdiction</AccordionTrigger>
                                            <AccordionContent>
                                                <p>These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Mumbai, India.</p>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-10">
                                            <AccordionTrigger>10. Indemnification</AccordionTrigger>
                                            <AccordionContent>
                                                <p>You agree to indemnify, defend, and hold harmless DevHub, its owners, employees, and partners from and against any claims, liabilities, damages, losses, and expenses, including legal fees, arising from your use of the website or violation of these Terms.</p>
                                            </AccordionContent>
                                        </AccordionItem>

                                        <AccordionItem value="item-11">
                                            <AccordionTrigger>11. Changes to Terms</AccordionTrigger>
                                            <AccordionContent>
                                                <p>We may update these Terms and Conditions at any time. We encourage you to review this page periodically for any changes. Continued use of the website following any updates constitutes your acceptance of the revised Terms.</p>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>

                                    <section>
                                        <h2 className="text-2xl  mb-4">Contact Us</h2>
                                        <p>If you have any questions or concerns about these Terms and Conditions, please contact us at:</p>
                                        <p className="mt-2">DevHub</p>
                                        <p className='mt-1'>Email: <a href="mailto:deepraj21.bera@gmail.com" className="text-primary hover:underline" target="_blank">deepraj21.bera@gmail.com</a></p>
                                    </section>
                                </div>
                        </div>
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

