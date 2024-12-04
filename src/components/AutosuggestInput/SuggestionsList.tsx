interface SuggestionsListProps {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
    activeIndex: number;
}

export function SuggestionsList ({
    suggestions,
    onSelect,
    activeIndex
}: SuggestionsListProps) {
    if (suggestions.length === 0) return null;

    return (
        <div className="max-h-60 w-full overflow-auto rounded-xl text-white py-1 shadow-xl">
            <ul className=" w-full overflow-auto rounded-md text-white bg-gray-700">
                { suggestions.map((suggestion, index) => (
                    <li
                        key={ suggestion }
                        className={ `cursor-pointer px-3 py-1 text-sm ${ index === activeIndex
                            ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white'
                            : 'text-white hover:bg-gray-600'
                            }` }
                        onClick={ () => onSelect(suggestion) }
                    >
                        { suggestion }
                    </li>
                )) }
          </ul>
            
        </div>
    );
}

