import { useState, useEffect, useCallback, RefObject } from "react";

export function filterSuggestions (query: string, items: string[]): string[] {
	const searchTerm = query.slice(1).toLowerCase(); // Remove @ from the start

	if (!searchTerm) return items; // Show all items if only @ is typed

	return items
		.filter(item =>
			item.toLowerCase().includes(searchTerm)
		)
		.sort((a, b) => {
			// Prioritize items that start with the search term
			const aStartsWith = a.toLowerCase().startsWith(searchTerm);
			const bStartsWith = b.toLowerCase().startsWith(searchTerm);

			if (aStartsWith && !bStartsWith) return -1;
			if (!aStartsWith && bStartsWith) return 1;
			return 0;
		});
}



interface UseChatAutosuggestProps {
	suggestions: string[];
	containerRef: RefObject<HTMLElement>;
	triggerChar?: string;
}

export function useChatAutosuggest ({
	suggestions,
	containerRef,
	triggerChar = '@'
}: UseChatAutosuggestProps) {
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
	const [dropdownPosition, setDropdownPosition] = useState<'top' | 'bottom'>('top');
	const [currentWord, setCurrentWord] = useState('');

	const updateDropdownPosition = useCallback(() => {
		if (!containerRef.current) return;

		const containerRect = containerRef.current.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const spaceAbove = containerRect.top;
		const spaceBelow = viewportHeight - containerRect.bottom;
		const dropdownHeight = Math.min(filteredSuggestions.length * 36, 240);

		setDropdownPosition(spaceAbove > dropdownHeight ? 'top' : 'bottom');
	}, [filteredSuggestions.length, containerRef]);

	const handleContentChange = useCallback((content: string) => {
		const selection = window.getSelection();
		if (!selection || !selection.focusNode) return;

		const text = selection.focusNode.textContent || '';
		const cursorPosition = selection.focusOffset;

		// Find the current word being typed
		let wordStart = cursorPosition;
		while (wordStart > 0 && text[wordStart - 1] !== ' ' && text[wordStart - 1] !== '\n') {
			wordStart--;
		}
		const word = text.slice(wordStart, cursorPosition);

		if (word.startsWith(triggerChar)) {
			setCurrentWord(word);
			const filtered = filterSuggestions(word, suggestions);
			setFilteredSuggestions(filtered);
			setShowSuggestions(true);
			setActiveIndex(0);
			updateDropdownPosition();
		} else {
			setShowSuggestions(false);
		}
	}, [suggestions, triggerChar, updateDropdownPosition]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (!showSuggestions) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setActiveIndex(prev =>
					prev < filteredSuggestions.length - 1 ? prev + 1 : prev
				);
				break;
			case 'ArrowUp':
				e.preventDefault();
				setActiveIndex(prev => prev > 0 ? prev - 1 : prev);
				break;
			case 'Enter':
				if (filteredSuggestions[activeIndex]) {
					e.preventDefault();
					handleSelect(filteredSuggestions[activeIndex]);
				}
				break;
			case 'Escape':
				setShowSuggestions(false);
				break;
			case 'Tab':
				if (showSuggestions) {
					e.preventDefault();
					if (filteredSuggestions[activeIndex]) {
						handleSelect(filteredSuggestions[activeIndex]);
					}
				}
				break;
		}
	}, [showSuggestions, filteredSuggestions, activeIndex]);

	const handleSelect = useCallback((suggestion: string) => {
		const selection = window.getSelection();
		if (!selection || !selection.focusNode) return;

		const text = selection.focusNode.textContent || '';
		const cursorPosition = selection.focusOffset;

		// Find the start of the current word
		let wordStart = cursorPosition;
		while (wordStart > 0 && text[wordStart - 1] !== ' ' && text[wordStart - 1] !== '\n') {
			wordStart--;
		}

		// Create the new text content
		const beforeWord = text.substring(0, wordStart);
		const replacement = `${ triggerChar }${ suggestion } `;
		const afterWord = text.substring(cursorPosition);
		const newContent = beforeWord + replacement + afterWord;

		// Update the content
		if (selection.focusNode.nodeType === Node.TEXT_NODE && selection.focusNode.parentElement) {
			const parentElement = selection.focusNode.parentElement;
			parentElement.textContent = newContent;

			// Create a new range at the end of the inserted suggestion
			const range = document.createRange();
			const newTextNode = parentElement.firstChild || parentElement;
			const newPosition = wordStart + replacement.length;

			range.setStart(newTextNode, newPosition);
			range.setEnd(newTextNode, newPosition);

			// Update the selection
			selection.removeAllRanges();
			selection.addRange(range);
		}

		setShowSuggestions(false);
	}, [triggerChar]);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setShowSuggestions(false);
			}
		};

		const handleResize = () => {
			if (showSuggestions) {
				updateDropdownPosition();
			}
		};

		document.addEventListener('click', handleClickOutside);
		window.addEventListener('resize', handleResize);
		return () => {
			document.removeEventListener('click', handleClickOutside);
			window.removeEventListener('resize', handleResize);
		};
	}, [showSuggestions, containerRef, updateDropdownPosition]);

	return {
		showSuggestions,
		filteredSuggestions,
		activeIndex,
		dropdownPosition,
		handleContentChange,
		handleKeyDown,
		handleSelect
	};
}