import { ContextMenuItems } from "@/base/types";
import { useChatAutosuggest } from "@/components/AutosuggestInput/hooks";
import AgentStore from "@/pages/sidebar/Chat/services/AgentStore";
import { Agent } from "@/pages/sidebar/Chat/types";
import { useEffect, useState, useRef, useCallback } from "react";

export function splitStringAtIndex(str, index) {
	// Check if the index is valid
	if (index < 0 || index > str.length) {
		throw new Error("Index is out of bounds.");
	}

	// Use slice to split the string at the specified index
	const part1 = str.slice(0, index); // From start to index
	const part2 = str.slice(index); // From index to end

	// Return the parts as an array
	return [part1, part2];
}

export const useAgentSuggestions = (containerRef: any, triggerChar: string) => {
	const agentstore_ref = useRef(new AgentStore());
	const [agents, setAgents] = useState<Agent[]>([]);

	// loads agents from the storage
	useEffect(() => {
		const loadAgents = async () => {
			const agnts = await agentstore_ref.current.getAllAgents();
			setAgents(agnts);
		};
		loadAgents();
	}, []);

	// load agent suggestion list
	const {
		showSuggestions,
		filteredSuggestions,
		activeIndex,
		dropdownPosition,
		handleContentChange,
		handleKeyDown: handleSuggestKeyDown,
		handleSelect,
	} = useChatAutosuggest({
		suggestions: agents.map((agent) => agent.name),
		containerRef,
		triggerChar: "@",
	});
	return {
		showSuggestions,
		filteredSuggestions,
		activeIndex,
		dropdownPosition,
		handleContentChange,
		handleSuggestKeyDown,
		handleSelect,
	};
};

interface AssistantHookProps {
	onSessionStart: (session: any) => void;
	onResponse: (chunks: string) => void;
	onError: (err: string) => void;
	onFinish: () => void;
}

export const useLanguageModel = (callbacks: AssistantHookProps) => {
	const startWriting = useCallback(
		async (inputText: string) => {
			try {
				// Create session
				const sessionInstance = await window.ai.languageModel.create({
					systemPrompt: `
          Act as a question answer bot. 
          Provide only direct answer to the user's query. 
          User may ask queries that can be used for browsing, writing in markdown, or writing code snippets.
          Do not respond as a bot or give your opinion. Only give the answers directly.
        `,
				});

				callbacks?.onSessionStart?.(sessionInstance);

				// Process input
				const chunks = await sessionInstance.prompt(inputText);
				callbacks?.onResponse?.(chunks);
			} catch (err) {
				callbacks?.onError?.(err);
			} finally {
				callbacks?.onFinish?.();
			}
		},
		[callbacks]
	);

	return {
		startWriting,
	};
};

export const useWriterAssistant = (callbacks: AssistantHookProps) => {
	const [session, setSession] = useState(null);

	const startWriting = useCallback(
		async (inputText: string) => {
			try {
				// Create session
				const sessionInstance = await window.ai.writer.create({
					tone: "neutral",
					length: "short",
				});

				setSession(sessionInstance);
				callbacks?.onSessionStart?.(sessionInstance);

				// Process input
				const chunks = await sessionInstance.write(inputText);
				callbacks?.onResponse?.(chunks);
			} catch (err) {
				callbacks?.onError?.(err);
			} finally {
				callbacks?.onFinish?.();
			}
		},
		[callbacks]
	);

	return {
		startWriting,
	};
};

export enum QuickAssistMode {
	EDIT, // no selection but editable
	SELECT, // selection but not editable
	EDIT_SELECT, // selection and editable
}

interface ContextMenuListenerHookProps {
	onSelected: (element: HTMLElement, mode: QuickAssistMode, type: ContextMenuItems) => void;
}

const isElementEditable = (element: HTMLElement | null | undefined): boolean => {
	if (element == null || element == undefined) return false;
	if (element.tagName == "INPUT") {
		const type = element.getAttribute("type");
		if (type == null || type == undefined) return false;
		if (type == "text") return true;
	}
	if (element.tagName == "TEXTAREA") return true;
	if (element.isContentEditable) return true;
};

export function getCaretAndText(element: HTMLElement) {
	if (!element) {
		throw new Error("Invalid element provided.");
	}

	let caretPosition = 0;
	let textUpToCaret = "";
	let textContent = ""

	if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
		// For input and textarea elements
		const selection_start = element.selectionStart;
		if (selection_start == null) return { caretPosition: -1, textUpToCaret: "" , textContent : ""};
		caretPosition = selection_start;

		textUpToCaret = element.value.substring(0, caretPosition);
		textContent = element.value
	} else if (element.isContentEditable) {
		// For contenteditable elements
		const selection = window.getSelection();
		if (selection == null) return { caretPosition: -1, textUpToCaret: "", textContent: "" };
		if (selection.rangeCount > 0) {
			const range = selection.getRangeAt(0);
			const preCaretRange = range.cloneRange();
			preCaretRange.selectNodeContents(element);
			preCaretRange.setEnd(range.endContainer, range.endOffset);
			caretPosition = preCaretRange.toString().length;
			textUpToCaret = preCaretRange.toString();
			textContent = element.innerText
		}
	} else {
		return { caretPosition: -1, textUpToCaret: "" , textContent : ""};
	}

	return { caretPosition, textUpToCaret  ,  textContent : textContent };
}

export const useContextMenuListener = ({ onSelected }: ContextMenuListenerHookProps) => {
	let contextMenuElementRef = useRef<HTMLElement>();

	useEffect(() => {
		const getMode = (): number => {
			const has_selection = window.getSelection() != null && window.getSelection()!.toString().trim().length > 0;
			if (!has_selection && isElementEditable(contextMenuElementRef.current)) return QuickAssistMode.EDIT;
			if (has_selection && !isElementEditable(contextMenuElementRef.current)) return QuickAssistMode.SELECT;
			if (has_selection && isElementEditable(contextMenuElementRef.current)) return QuickAssistMode.EDIT_SELECT;
			return QuickAssistMode.SELECT;
		};

		// Add a listener to capture the element when the context menu is triggered
		const handleContextMenu = (event: MouseEvent) => {
			contextMenuElementRef.current = event.target as HTMLElement;

			console.log("selection", window.getSelection());
			console.log("Element triggering context menu:", contextMenuElementRef.current);
		};

		// Chrome runtime message listener
		const messageListener = (message: { action: string | number; value: chrome.contextMenus.OnClickData }, sender: chrome.runtime.MessageSender, sendResponse: (response: boolean) => void) => {
			switch (message.action) {
				case ContextMenuItems.ASK:
					onSelected(contextMenuElementRef.current as HTMLElement, getMode(), ContextMenuItems.ASK);
					sendResponse(true);
					break;
			}
		};

		document.addEventListener("contextmenu", handleContextMenu);
		chrome.runtime.onMessage.addListener(messageListener);

		// Cleanup listeners on component unmount
		return () => {
			document.removeEventListener("contextmenu", handleContextMenu);
			chrome.runtime.onMessage.removeListener(messageListener);
		};
	}, []);
	return { contextMenuElementRef };
};

export const useDraggable = (
	buttonRef: React.RefObject<HTMLElement>,
	onDrag: React.Dispatch<
		React.SetStateAction<{
			x: number;
			y: number;
		}>
	>
) => {
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [hasMoved, setHasMoved] = useState(false);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging && buttonRef.current) {
				const moveDistance = Math.sqrt(Math.pow(e.clientX - dragStart.x, 2) + Math.pow(e.clientY - dragStart.y, 2));
				if (moveDistance > 5) setHasMoved(true);

				const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - buttonRef.current.getBoundingClientRect().width));
				const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - buttonRef.current.getBoundingClientRect().height));

				onDrag({
					x: newX,
					y: newY,
				});
			}
		};

		const handleMouseUp = () => setIsDragging(false);

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, dragOffset, dragStart, buttonRef, onDrag]);

	const handleMouseDown = (e: React.MouseEvent) => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
			setDragStart({ x: e.clientX, y: e.clientY });
			setIsDragging(true);
		}
	};

	return { handleMouseDown, isDragging };
};

export const useOutsideClick = (ref: React.RefObject<HTMLElement>, onClickOutside: () => void) => {
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				onClickOutside();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [ref, onClickOutside]);
};
