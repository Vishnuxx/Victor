
import { useState, useRef, useEffect, FormEventHandler, FormEvent } from "react";
import { getCaretAndText, QuickAssistMode, splitStringAtIndex, useAgentSuggestions, useContextMenuListener, useDraggable, useLanguageModel, useOutsideClick } from "./hooks";
import { SuggestionsList } from "@/components/AutosuggestInput/SuggestionsList";
import { FloatingButton } from "./FloatingButton";
import { ExpandableContent } from "./ExpandableContent";
import { useAgent } from "@/pages/sidebar/Chat/utils/agentutils";
import { useQuickAgent } from "./aihooks";
import { ContextMenuItems } from "@/base/types";
import AgentStore from "@/pages/sidebar/Chat/services/AgentStore";
import { Agent } from "@/pages/sidebar/Chat/types";

interface SelectionProps {
	element: HTMLElement,
	mode: QuickAssistMode,
	caretPosition: number,
	textUpToCaret: string,
	textContent : string
}




const InputAssistant = () => {
	const [visible, setVisible] = useState(false);
	const [isExpanded, setIsExpanded] = useState(true);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isLoading, setLoading] = useState(false);

	const [agents, setAgents] = useState<Agent[]>([])

	const [selectedProps, setSelectedProps] = useState<SelectionProps>()

	const menuRef = useRef(null);
	const inputRef = useRef(null);
	const buttonRef = useRef(null);
	const agentstoreRef = useRef(new AgentStore())


	useEffect(() => {
		const getAgents = async () => {
			const agents = await agentstoreRef.current.getAllAgents()
			setAgents(agents)
		}
		getAgents()
	}, [])

	const { handleMouseDown, isDragging } = useDraggable(buttonRef, setPosition);

	const { contextMenuElementRef } = useContextMenuListener({
		onSelected: (element: HTMLElement, mode: QuickAssistMode, type: ContextMenuItems) => {
			const { caretPosition, textUpToCaret , textContent } = getCaretAndText(element)
			setSelectedProps({
				element,
				mode,
				caretPosition,
				textUpToCaret,
				textContent
			})
			if (QuickAssistMode.EDIT || QuickAssistMode.SELECT || QuickAssistMode.EDIT_SELECT) {
				setPosition({
					x: element.getBoundingClientRect().x,
					y: element.getBoundingClientRect().y,
				});
				setVisible(true);
			}
		}
	});

	// close on outside click
	useOutsideClick(menuRef, () => {
		setVisible(false)
		setIsExpanded(false);
		if (inputRef.current) (inputRef.current as HTMLElement).innerHTML = "";
	});

	// does the suggestion stuff
	const {
		showSuggestions,
		filteredSuggestions,
		activeIndex,
		dropdownPosition,
		handleContentChange,
		handleSuggestKeyDown,
		handleSelect
	} = useAgentSuggestions(menuRef, "@")

	// to focus on the input when expanded
	useEffect(() => {
		if (isExpanded && inputRef.current != null) {
			(inputRef.current as HTMLElement).focus()
		}
	}, [isExpanded])

	// to generate response
	const { startWriting } = useLanguageModel({
		onSessionStart: (session) => {
			console.log('Session started:', session);
		},
		onResponse: (chunks) => {
			const type = (contextMenuElementRef.current as HTMLElement).tagName
			console.log(chunks)
			// console.log(type)
			if (type == "INPUT" || type == "TEXTAREA") {
				contextMenuElementRef.current.value = chunks
			} else {
				contextMenuElementRef.current.innerText = chunks
			}
		},
		onError: (err) => {
			console.error('Error occurred:', err);
			setLoading(false)
		},
		onFinish: () => {
			setLoading(false)
			setVisible(false)
			console.log("finished")
		},
	});

	const processQuery = () => {
		if (!selectedProps) return
		switch (selectedProps.mode) {
			case QuickAssistMode.SELECT:
				// go to chat
				break
			case QuickAssistMode.EDIT:
				break
			case QuickAssistMode.EDIT_SELECT:
				// if(selectedProps.textUpToCaret.trim() != "") {

				// } else {

				// }
				let texts = splitStringAtIndex(selectedProps.textContent , selectedProps.caretPosition)
				
				useQuickAgent({
					context: selectedProps.textUpToCaret,
					query: (inputRef.current as HTMLElement).innerText,
					agents: agents,
					onStart: () => {setLoading(true) },
					onUpdate: (chunk) => {
					    selectedProps.element.innerText = texts[0] + chunk + texts[1]
					},
					onFinish: () => {
						setLoading(false)
						setVisible(false)
},
					onError: (error) => { setLoading(false) }

				})
				break
		}
		
	}

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		console.log("has moved: ", isDragging);
		if (!isDragging) {
			setIsExpanded(!isExpanded);
			setLoading(false);
		}
	};

	const handleOnChange: FormEventHandler<HTMLDivElement> = (e: FormEvent<HTMLDivElement>) => {
		handleContentChange((e.target as HTMLElement).innerText)
	}

	const handleKeyDown = async (e: React.KeyboardEvent) => {

		if (showSuggestions) {
			handleSuggestKeyDown(e);
			if (e.key === 'Enter' && filteredSuggestions[activeIndex]) {
				return; // Don't send if we're selecting a suggestion
			}
		}

		if (e.key === "Enter") {
			if (e.shiftKey) return; // Allow Shift + Enter for multi-line input
			e.preventDefault(); // Prevent adding a newline
			setLoading(true);
			setIsExpanded(false)
			handleSuggestKeyDown(e)
			// await startWriting(inputRef.current.innerText)
			processQuery()
			// useAgent({
			// 	user_msg : 
			// })
			// useQuickAgent({

			// })
		}
	};

	console.log(showSuggestions, filteredSuggestions)

	return (
		visible && (
			<div style={ { position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: "9999999999" } }>
				<div
					ref={ menuRef }
					className=" flex items-center"
					style={ {
						width: "fit-content",
						transform: `translate(${ position.x }px, ${ position.y }px)`,
						pointerEvents: "auto",
						zIndex: "9999999999",
					} }
				>
					<FloatingButton buttonRef={ buttonRef } handleMouseDown={ handleMouseDown } handleClick={ handleClick } isLoading={ isLoading } >
						<div className="flex flex-col justify-center">
							<ExpandableContent isExpanded={ isExpanded } inputRef={ inputRef } onInput={ handleOnChange } handleKeyDown={ handleKeyDown } />
							{/* Agent suggestions */ }
							{ showSuggestions && (
								<div
									className={ ` w-full ${ dropdownPosition === 'bottom'
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
						</div>

					</FloatingButton>
				</div>
			</div>
		)
	);
};





export default InputAssistant;
