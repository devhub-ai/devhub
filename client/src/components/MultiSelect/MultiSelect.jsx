import React, { useState } from 'react';

const predefinedTags = ['React', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Django', 'Flask'];

const FancyMultiSelect = ({ onChange }) => {
    const [selectedTags, setSelectedTags] = useState([]);
    const [query, setQuery] = useState('');

    const handleTagClick = (tag) => {
        setSelectedTags((prev) => {
            if (prev.includes(tag)) {
                return prev.filter((t) => t !== tag);
            } else {
                return [...prev, tag];
            }
        });
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const filteredTags = predefinedTags.filter((tag) =>
        tag.toLowerCase().includes(query.toLowerCase())
    );

    React.useEffect(() => {
        onChange(selectedTags);
    }, [selectedTags, onChange]);

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search or add tags..."
                className="border rounded px-2 py-1"
            />
            <div className="mt-2">
                {filteredTags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleTagClick(tag)}
                        className={`border rounded px-2 py-1 mr-2 mb-2 ${
                            selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default FancyMultiSelect;
