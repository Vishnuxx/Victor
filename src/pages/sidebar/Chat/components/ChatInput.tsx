import { FormEvent, FormEventHandler, KeyboardEvent, KeyboardEventHandler, LegacyRef, useRef } from "react";
import { MessageHeadProps } from "./types";
import { ChatReferenceRenderer } from "./ChatReferenceRenderer";




import { useChatAutosuggest } from "../../../../components/AutosuggestInput/hooks";
import { SuggestionsList } from "../../../../components/AutosuggestInput/SuggestionsList";


export interface ChatInputProps {
	value: MessageHeadProps;
	isEnabled: boolean;
	agentsuggestionlist : string[];
	onSend?: (message: MessageHeadProps) => void;
	onUpdate: (message: MessageHeadProps) => void;
}

export const ChatInput = ({ value, agentsuggestionlist , isEnabled, onSend, onUpdate }: ChatInputProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLPreElement>(null);

	const {
		showSuggestions,
		filteredSuggestions,
		activeIndex,
		dropdownPosition,
		handleContentChange,
		handleKeyDown: handleSuggestKeyDown,
		handleSelect
	} = useChatAutosuggest({
		suggestions : agentsuggestionlist,
		containerRef,
		triggerChar: '@'
	});



	const send = () => {
		if (value.content.trim() === "") return;
		onSend?.(value);
		// Clear the content synchronously
		onUpdate({
			...value,
			references: [],
			content: "",
		});
		if (inputRef.current) {
			inputRef.current.textContent = ""; // Reset DOM content
		}
	};

	const onKeyDown: KeyboardEventHandler<HTMLPreElement> = (e: KeyboardEvent<HTMLPreElement>) => {
		if (showSuggestions) {
			handleSuggestKeyDown(e);
			if (e.key === 'Enter' && filteredSuggestions[activeIndex]) {
				return; // Don't send if we're selecting a suggestion
			}
		}

		if (e.key === "Enter") {
			if (e.shiftKey) return; // Allow Shift + Enter for multi-line input
			e.preventDefault(); // Prevent adding a newline
			send();
		}
	};

	const onChange: FormEventHandler<HTMLPreElement> = (element: FormEvent<HTMLPreElement>) => {
		const message = (element.target as HTMLPreElement).textContent || "";
		handleContentChange(message);
		onUpdate({
			...value,
			content: message,
		});
	};

	const onDeleteReference = (index: number) => {
		onUpdate({
			...value,
			references: value.references.filter((_, i) => i !== index),
		});
	};

	return (
		<div className={ `p-2 ${ isEnabled ? "pointer-events-auto" : "pointer-events-none" }` } ref={ containerRef }>
			<div className="flex flex-col items-center space-x-2 mx-0">
				<ChatReferenceRenderer message={ value } onDeleteReference={ onDeleteReference } />
				{ showSuggestions && (
					<div
						className={ ` w-full ${ dropdownPosition === 'top'
								? 'bottom-full mb-2'
								: 'top-full mt-2'
							}` }
					>
						<SuggestionsList
							suggestions={ filteredSuggestions }
							onSelect={ handleSelect }
							activeIndex={ activeIndex }
						/>
					</div>
				) }
				<div className="mt-4 w-full rounded-[30px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[2px]">
					<div className="mx-0 relative text-md overflow-y-scroll w-full rounded-[30px] max-h-[500px] focus:bg-[#37393d] bg-[#28292b]">
						{ value.content.trim() === "" && (
							<p className="absolute disabled:text-gray-700 text-gray-400 h-full w-full flex pl-6 pt-4 items-start">
								Enter a message...
							</p>
						) }
						<pre
							contentEditable={ isEnabled }
							ref={ inputRef }
							onKeyDown={ onKeyDown }
							onInput={ onChange }
							suppressContentEditableWarning
							className="focus:outline-none relative px-6 py-4 text-wrap top-0 left-0 p-1 h-full"
						></pre>
					</div>
				</div>
			</div>
		</div>
	);
};