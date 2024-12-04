import { ChevronLeft, Navigation } from "lucide-react";
import { useState, useRef, useEffect } from "react";


export const FloatingMenu = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [hasMoved, setHasMoved] = useState(false);

	const [isContentOpen, setisContentOpen] = useState(false);

	const menuRef = useRef<HTMLElement>(null);
	const inputRef = useRef<HTMLElement>(null);
	const buttonRef = useRef<HTMLElement>(null);

	// Handle dragging
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging && buttonRef.current) {
				const moveDistance = Math.sqrt(Math.pow(e.clientX - dragStart.x, 2) + Math.pow(e.clientY - dragStart.y, 2));
				if (moveDistance > 5) {
					setHasMoved(true);
				}

				let newX = e.clientX - dragOffset.x;
				let newY = e.clientY - dragOffset.y;

				const windowWidth = window.innerWidth;
				const windowHeight = window.innerHeight;
				const buttonRect = buttonRef.current.getBoundingClientRect();

				// Use button dimensions for constraints instead of menu
				const maxX = windowWidth - buttonRect.width;
				const maxY = windowHeight - buttonRect.height;

				newX = Math.max(0, Math.min(newX, maxX));
				newY = Math.max(0, Math.min(newY, maxY));

				setPosition({ x: newX, y: newY });
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			setTimeout(() => {
				setHasMoved(false);
			}, 0);
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, dragOffset, dragStart]);

	// Handle click outside to close and clear content
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
				setIsExpanded(false);
				if (inputRef.current) {
					inputRef.current.innerHTML = "";
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleMouseDown = (e: MouseEvent) => {
		if (buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setDragOffset({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
			});
			setDragStart({
				x: e.clientX,
				y: e.clientY,
			});
			setIsDragging(true);
		}
	};

	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
		if (!hasMoved) {
			const willClose = isExpanded;
			setIsExpanded(!isExpanded);
			setisContentOpen(false);

			if (willClose && inputRef.current) {
				// Clear content when closing
				inputRef.current.innerHTML = "";
			} else if (!isExpanded && inputRef.current) {
				// Focus when opening
				setTimeout(() => inputRef.current?.focus(), 100);
			}
		}
	};

	const onEnter = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			if (e.shiftKey) return; // Allow Shift + Enter for multi-line input

			e.preventDefault(); // Prevent adding a newline
			setisContentOpen(true);
		}
	};

	const tooltipicon = chrome.runtime.getURL("src/assets/img/tooltip.png");

	return (
		<div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
			<div
				ref={menuRef}
				className="absolute flex items-center"
				style={{
					transform: `translate(${position.x}px, ${position.y}px)`,
					pointerEvents: "auto",
					zIndex: "9999999999",
				}}
			>
				<div className="relative flex text-white text-[12px]">
					<div className="w-[30px] h-[30px] shadow-[0_0_10px_0_rgba(0,0,0,0.1)] border border-gray-600 rounded-[100%]  from-blue-500 bg-gradient-to-r bg-pink-400 text-white flex items-center justify-center cursor-move hover:bg-gray-900 transition-colors duration-200  ">
						<button ref={buttonRef} onMouseDown={handleMouseDown} onClick={handleClick} className="w-[25px] h-[25px] shadow-md border border-gray-600 rounded-[100%] bg-gray-800 text-white flex items-center justify-center cursor-move hover:bg-gray-900 transition-colors duration-200  ">
							<div className={`transform pointer-events-none w-[20px] h-[20px] transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`}>
								<img src={tooltipicon} className={`transform pointer-events-none w-[20px] h-[20px] transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`} />
							</div>
						</button>
					</div>

					<div
						className={`absolute p-[2px] flex flex-col items-center space-y-[6px] left-[100%] transition-all duration-300 ${isExpanded ? "opacity-100 text-[12px]" : "opacity-0 pointer-events-none text-[0]"}`}
						style={{
							width: isExpanded ? "250px" : 0,
							display: isContentOpen ? "none" : "flex",
						}}
					>
						<div className="flex flex-row justify-between w-full space-x-[4px] px-[3px] py-[3px] shadow-[0_0_10px_0_rgba(0,0,0,0.1)] border border-gray-600 bg-[#404246] rounded-[20px] focus:outline-none text-white">
							<select className="outline-none rounded-[50px] w-full px-[6px] py-[3px] bg-[#1F1F1F] m-[0] " name="type" id="1">
								<option value="1">Formal</option>
								<option value="2">Casual</option>
								<option value="3">three</option>
							</select>
							<select className="outline-none rounded-[50px] w-full px-[6px] py-[3px] bg-[#1F1F1F] m-[0]" name="length" id="1">
								<option value="1">Short</option>
								<option value="2">Mid</option>
								<option value="3">Long</option>
							</select>
							<select className="outline-none rounded-[50px] w-full px-[6px] py-[3px] bg-[#1F1F1F] m-[0]" name="select" id="1">
								<option value="1">one</option>
								<option value="2">two</option>
								<option value="3">three</option>
							</select>
						</div>
						<div
							onKeyDown={onEnter}
							className={` p-[2px] flex flex-col from-blue-500 bg-gradient-to-r bg-pink-400  rounded-[20px] transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}`}
							style={{
								width: isExpanded ? "100%" : 0,
							}}
						>
							<div contentEditable ref={inputRef} className="w-full px-[6px] py-[3px]  border border-gray-600 bg-gray-800 rounded-[20px] focus:outline-none text-white" />
						</div>
					</div>
					<SummaryResult isExpanded={isExpanded && isContentOpen} content={"text"} isLoading={true} onBackButtonClicked={null}></SummaryResult>
				</div>
			</div>
		</div>
	);
};

interface SummaryResultProps {
	isExpanded: boolean;
	content: string;
	isLoading: boolean;
	onBackButtonClicked?: () => void;
}

const SummaryResult = ({ isExpanded, isLoading = false, content, onBackButtonClicked }: SummaryResultProps) => {
	return (
		isExpanded && (
			<div className={` p-[3px] flex flex-col items-center space-y-[6px] left-full transition-all duration-300 `}>
				{isLoading && <p className=" animate-pulse h-full flex items-center text-gray-400">Generating response...</p>}
				{!isLoading && (
					<div className="flex flex-col justify-between w-full px-[3px] space-y-[3px] focus:outline-none text-white  border-gray-600 bg-[#404246] rounded-[20px] ">
						<ChevronLeft></ChevronLeft>
						<div className="w-[100%] px-[5px] py-[3px]  text-gray-200">{content}</div>
					</div>
				)}
			</div>
		)
	);
};
