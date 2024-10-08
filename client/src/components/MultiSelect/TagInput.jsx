"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Command as CommandPrimitive } from "cmdk";

// hardcoded later to be fetched from server which will analyze all project and create necessary tags
const TAGS = [
  { value: "react", label: "React" },
  { value: "node.js", label: "Node.js" },
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "ai", label: "AI" },
  { value: "ml", label: "Machine Learning" },
  { value: "fintech", label: "Fintech" },
];

export function TagInput({ selectedTags, onTagsChange }) {
  const inputRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = React.useCallback((tag) => {
    onTagsChange(selectedTags.filter((s) => s.value !== tag.value));
  }, [selectedTags, onTagsChange]);

  const handleKeyDown = React.useCallback((e) => {
    const input = inputRef.current;
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          onTagsChange(selectedTags.slice(0, -1));
        }
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  }, [selectedTags, onTagsChange]);

  const selectables = TAGS.filter(tag => !selectedTags.includes(tag));

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tag) => (
            <Badge key={tag.value} variant="secondary">
              {tag.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(tag);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(tag)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder="Select tags..."
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((tag) => (
                  <CommandItem
                    key={tag.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onTagsChange([...selectedTags, tag]);
                    }}
                    className="cursor-pointer"
                  >
                    {tag.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}

