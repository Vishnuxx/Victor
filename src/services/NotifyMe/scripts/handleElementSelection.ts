export class ElementSelector {
	private hoveredElement: HTMLElement | null = null;
	private selectedElement: HTMLElement | null = null;
	private onSelectCallback: ((element: HTMLElement) => void) | null = null;
	public isEnabled: boolean = false;

	constructor() {}

	// Mouse over handler to highlight the element
	private handleMouseOver = (event: MouseEvent): void => {
		const target = event.target as HTMLElement;

		// Avoid highlighting the selected element again
		if (target !== this.selectedElement) {
			this.hoveredElement = target;
			this.hoveredElement.style.backgroundColor = "orange";
		}
	};

	// Mouse out handler to remove the hover highlight
	private handleMouseOut = (event: MouseEvent): void => {
		const target = event.target as HTMLElement;

		if (target === this.hoveredElement) {
			this.hoveredElement.style.backgroundColor = "";
			this.hoveredElement = null;
		}
	};

	// Click handler to select the element
	private handleClick = (event: MouseEvent): void => {
		const target = event.target as HTMLElement;

		// Prevent default action and bubbling up
		event.preventDefault();
		event.stopPropagation();

		// If there's a previously selected element, reset its outline
		if (this.selectedElement) {
			this.selectedElement.style.outline = "";
		}

		// Mark the new element as selected and thicken its outline
		this.selectedElement = target;
		this.selectedElement.style.outline = "4px solid black";

		// Trigger the callback if defined
		if (this.onSelectCallback) {
			this.onSelectCallback(this.selectedElement);
		}
	};

	/**
	 * Enable the selection functionality.
	 * @param onSelect Callback function triggered when an element is selected.
	 */
	public enableSelection(onSelect: (element: HTMLElement) => void): void {
		this.onSelectCallback = onSelect; // Store the callback
		document.body.addEventListener("mouseover", this.handleMouseOver);
		document.body.addEventListener("mouseout", this.handleMouseOut);
		document.body.addEventListener("click", this.handleClick);
		this.isEnabled = true;
	}

	/**
	 * Disable the selection functionality.
	 */
	public disableSelection(): void {
		document.body.removeEventListener("mouseover", this.handleMouseOver);
		document.body.removeEventListener("mouseout", this.handleMouseOut);
		document.body.removeEventListener("click", this.handleClick);

		this.onSelectCallback = null; // Clear the callback

		// Reset styles for the hovered and selected elements
		if (this.hoveredElement) {
			this.hoveredElement.style.backgroundColor = "";
			this.hoveredElement = null;
		}
		if (this.selectedElement) {
			this.selectedElement.style.outline = "";
			this.selectedElement = null;
		}
		this.isEnabled = false;
	}
}
