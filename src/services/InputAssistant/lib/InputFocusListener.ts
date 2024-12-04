export default class TextInputFocusListener {
	private focusInCallback: (element: HTMLElement) => void;
	private focusOutCallback: (element: HTMLElement) => void;
	private isListening: boolean;
	private focusInListener: (event: FocusEvent) => void;
	private focusOutListener: (event: FocusEvent) => void;

	constructor(focusInCallback: (element: HTMLElement) => void, focusOutCallback: (element: HTMLElement) => void) {
		this.focusInCallback = focusInCallback;
		this.focusOutCallback = focusOutCallback;
		this.isListening = false;

		// Define the event listeners
		this.focusInListener = this.handleFocusIn.bind(this);
		this.focusOutListener = this.handleFocusOut.bind(this);
	}

	/**
	 * Starts listening for focusin and focusout events on text-inputable elements.
	 */
	enable(): void {
		if (!this.isListening) {
			document.addEventListener("focusin", this.focusInListener);
			document.addEventListener("focusout", this.focusOutListener);
			this.isListening = true;
		}
	}

	/**
	 * Stops listening for focusin and focusout events.
	 */
	disable(): void {
		if (this.isListening) {
			document.removeEventListener("focusin", this.focusInListener);
			document.removeEventListener("focusout", this.focusOutListener);
			this.isListening = false;
		}
	}

	/**
	 * Event handler for focusin events. Triggers the focusInCallback if applicable.
	 * @param event - The focus event.
	 */
	private handleFocusIn(event: FocusEvent): void {
		const target = event.target as HTMLElement;

		if (this.isTextInputableElement(target)) {
			this.focusInCallback(target);
		}
	}

	/**
	 * Event handler for focusout events. Triggers the focusOutCallback if applicable.
	 * @param event - The focus event.
	 */
	private handleFocusOut(event: FocusEvent): void {
		const target = event.target as HTMLElement;

		if (this.isTextInputableElement(target)) {
			this.focusOutCallback(target);
		}
	}

	/**
	 * Determines if an element is a text-inputable element.
	 * @param element - The DOM element to check.
	 * @returns True if the element is inputable, otherwise false.
	 */
	private isTextInputableElement(element: HTMLElement): boolean {
		const tagName = element.tagName.toLowerCase();

		return (tagName === "input" && this.isTextInputType(element as HTMLInputElement)) || tagName === "textarea" || (tagName === "div" && element.isContentEditable);
	}

	/**
	 * Determines if an <input> element is of a text-inputable type.
	 * @param input - The input element to check.
	 * @returns True if the input type is text-inputable, otherwise false.
	 */
	private isTextInputType(input: HTMLInputElement): boolean {
		const textInputTypes = ["text", "password", "email", "number", "search", "tel", "url", "date", "datetime-local", "month", "time", "week"];
		return textInputTypes.includes(input.type);
	}
}

// // Usage example:
// const listener = new TextInputFocusListener(
// 	(element) => console.log("Focused on:", element),
// 	(element) => console.log("Focus lost from:", element)
// );

// // Enable the listener
// listener.enable();

// // Disable the listener (when needed)
// // listener.disable();
