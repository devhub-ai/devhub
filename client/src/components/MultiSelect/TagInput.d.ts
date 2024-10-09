declare module "@/components/MultiSelect/TagInput" {
    import { FC } from "react";

    interface Tag {
        value: string;
        label: string;
    }

    interface TagInputProps {
        selectedTags: Tag[];
        onTagsChange: (tags: Tag[]) => void;
    }

    const TagInput: FC<TagInputProps>;
    export type { Tag }; // Export the Tag type
    export default TagInput;
}
