import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"


export function Faq() {
    const faqs = [
        {
            question: "How to create an account?",
            answer: "Yes, signUp to create a new account and get opt auth & protection."
        },
        {
            question: "Is it free to chat with the model?",
            answer: "Yes, you can complete your profile and start chat."
        },
        {
            question: "can we make our account private?",
            answer: "No, as a collaborative platform, other developers can find you."
        },
        {
            question: "can we chat with anyone?",
            answer: "Yes, you can search dev and chat with anyone."
        }
    ]
    return (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1  relative z-10 py-10 max-w-7xl mx-auto">
            <h1>FAQS</h1>
            {faqs.map(data => (
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>{data.question}</AccordionTrigger>
                        <AccordionContent>
                            {data.answer}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            ))}
        </div>

    );
}