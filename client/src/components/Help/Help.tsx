import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const Help = () => {
  return (
    <>
      <div className="p-2 mt-4 h-full overflow-auto">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground mb-8">Welcome to the DevHub Help ! Here, we aim to support you in making the most of our platform. If you have any questions or encounter issues, please refer to the sections below.</p>

          <ScrollArea className="h-[45vh] rounded-md border p-4 ">
            <div className="pr-4 space-y-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="getting-started">
                  <AccordionTrigger>Getting Started</AccordionTrigger>
                  <AccordionContent>
                    <h3 className="font-semibold mb-2">Creating an Account:</h3>
                    <ul className="list-disc pl-6 mb-4">
                      <li>Sign up with your email or GitHub to access DevHub's full features.</li>
                      <li>You can personalize your profile and integrate GitHub/LeetCode accounts.</li>
                    </ul>
                    <h3 className="font-semibold mb-2">Setting Up Your Profile:</h3>
                    <ul className="list-disc pl-6">
                      <li>Fill in your bio, expertise, and links to projects.</li>
                      <li>Sync GitHub and LeetCode accounts for automatic updates to your portfolio.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="features-guide">
                  <AccordionTrigger>Features Guide</AccordionTrigger>
                  <AccordionContent>
                    <h3 className="font-semibold mb-2">Portfolio Management:</h3>
                    <ul className="list-disc pl-6 mb-4">
                      <li>Use our tools to showcase projects, skills, and achievements.</li>
                      <li>Leverage our GitHub and LeetCode integration for real-time portfolio updates.</li>
                    </ul>
                    <h3 className="font-semibold mb-2">Networking:</h3>
                    <ul className="list-disc pl-6 mb-4">
                      <li>Connect with other developers, follow profiles, and build your network.</li>
                    </ul>
                    <h3 className="font-semibold mb-2">Explore Section:</h3>
                    <ul className="list-disc pl-6">
                      <li>Browse through profiles and portfolios of other developers.</li>
                      <li>Filter and search by skills, experience, and more.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="relations">
                  <AccordionTrigger>Relations</AccordionTrigger>
                  <AccordionContent>
                    <h3 className="font-semibold mb-2">People You May Know:</h3>
                    <ul className="list-disc pl-6 mb-4">
                      <li>This section offers personalized recommendations based on mutual connections, shared interests, or skillsets.</li>
                    </ul>
                    <h3 className="font-semibold mb-2">Following Profiles:</h3>
                    <ul className="list-disc pl-6 mb-4">
                      <li>If you’re not ready to connect, you can choose to follow developers for updates on their activities without sending a connection request.</li>
                    </ul>
                    <h3 className="font-semibold mb-2">Messaging Connections:</h3>
                    <ul className="list-disc pl-6">
                      <li>Once connected, send messages to people in your network to initiate conversations or discuss collaborations.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="troubleshooting">
                  <AccordionTrigger>Troubleshooting</AccordionTrigger>
                  <AccordionContent>
                    <h3 className="font-semibold mb-2">Login Issues:</h3>
                    <ul className="list-disc pl-6 mb-4">
                      <li>Ensure you're using the correct email/GitHub credentials.</li>
                      <li>For account recovery, click the "Forgot Password?" link on the login page.</li>
                    </ul>
                    <h3 className="font-semibold mb-2">Profile Syncing:</h3>
                    <ul className="list-disc pl-6 mb-4">
                      <li>If your GitHub or LeetCode data isn't updating, try reconnecting your accounts from the Settings page.</li>
                    </ul>
                    <h3 className="font-semibold mb-2">Page Errors:</h3>
                    <ul className="list-disc pl-6">
                      <li>Clear your browser cache or try a different browser. If the issue persists, contact us.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                  <AccordionItem value="faq">
                    <AccordionTrigger>FAQ</AccordionTrigger>
                    <AccordionContent>
                      <Accordion type="single">
                        <AccordionItem value="faq_1">
                          <AccordionTrigger>
                          <h3 className="font-semibold mb-2 no-underline">• How do I update my profile information?</h3>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="mb-4">Go to Settings, where you can change your bio, skills, and other details.</p>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="faq_2">
                          <AccordionTrigger>
                            <h3 className="font-semibold mb-2 no-underline">• Can I make my profile private?</h3>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p>Currently, DevHub supports public profiles, but we're exploring privacy options.</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
            </div>
          </ScrollArea>
         
        </div>
      </div>

    </>
  )
}

export default Help