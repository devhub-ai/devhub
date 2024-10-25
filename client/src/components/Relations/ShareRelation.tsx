import { useState } from "react";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ShareRelationProps {
    username: string;
}

export function ShareRelation({ username }: ShareRelationProps) {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        const inputElement = document.getElementById("link") as HTMLInputElement;

        if (inputElement) {
            inputElement.select();
            inputElement.setSelectionRange(0, 99999); 

            navigator.clipboard.writeText(inputElement.value)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000); 
                })
                .catch(err => console.error('Failed to copy the link: ', err));
        }
    };

    return (
        <>
            <div className="flex flex-col space-y-2 text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                    Anyone who has this link and a DevHub account will be able to view
                    this.
                </p>
            </div>
            <div className="flex items-center space-x-2 pt-4">
                <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                        Link
                    </Label>
                    <Input
                        id="link"
                        defaultValue={`https://devhub.page/relations/${username}`}
                        readOnly
                        className="h-9"
                    />
                </div>
                <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
                    <span className="sr-only">{isCopied ? "Copied" : "Copy"}</span>
                    {isCopied ? (
                        <CheckIcon className="h-4 w-4" />
                    ) : (
                        <CopyIcon className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </>
    );
}
