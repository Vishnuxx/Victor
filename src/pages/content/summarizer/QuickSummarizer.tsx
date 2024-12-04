import { useEffect, useRef, useState } from "react";
import tooltiplogo from "@assets/img/tooltip.png";
import ShadowRoot from "react-shadow-root";
const FloatingMenu = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [hasMoved, setHasMoved] = useState(false);

	const menuRef = useRef(null);
	const inputRef = useRef(null);
	const buttonRef = useRef(null);

	// Handle dragging
	useEffect(() => {
		const handleMouseMove = (e) => {
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
		const handleClickOutside = (e) => {
			console.log("outside");
			if (menuRef.current && !menuRef.current.contains(e.target)) {
				setIsExpanded(false);
				if (inputRef.current) {
					inputRef.current.innerHTML = "";
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleMouseDown = (e) => {
		e.stopPropagation();
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

	const handleClick = (e) => {
		e.stopPropagation();
		if (!hasMoved) {
			const willClose = isExpanded;
			setIsExpanded(!isExpanded);

			if (willClose && inputRef.current) {
				inputRef.current.innerHTML = "";
			} else if (!isExpanded && inputRef.current) {
				setTimeout(() => inputRef.current?.focus(), 100);
			}
		}
	};

	return (
		<div
			style={{
				position: "fixed",
				left: 0,
				top: 0,
				width: "100%",
				height: "100%",
				pointerEvents: "none",
				zIndex: 9999999999,
			}}
		>
			<ShadowRoot>
				<div
					ref={menuRef}
					onClick={(e) => e.stopPropagation()}
					style={{
						position: "absolute",
						display: "flex",
						alignItems: "center",
						transform: `translate(${position.x}px, ${position.y}px)`,
						pointerEvents: "auto",
					}}
				>
					<div style={{ position: "relative", display: "flex", alignItems: "center" }}>
						<button
							ref={buttonRef}
							onMouseDown={handleMouseDown}
							onClick={handleClick}
							style={{
								width: "32px",
								height: "32px",
								boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
								border: "1px solid #4B5563",
								borderRadius: "50%",
								backgroundColor: "#1F2937",
								color: "#FFFFFF",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								cursor: "move",
								transition: "background-color 0.2s",
							}}
							onMouseOver={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#111827")}
							onMouseOut={(e) => ((e.target as HTMLButtonElement).style.backgroundColor = "#1F2937")}
						>
							<div
								style={{
									width: "16px",
									height: "16px",
									transition: "transform 0.3s",
									transform: isExpanded ? "rotate(45deg)" : "none",
									pointerEvents: "none",
								}}
							>
								<img
									src={tooltiplogo}
									alt="Logo"
									style={{
										width: "100%",
										height: "100%",
										transform: isExpanded ? "rotate(45deg)" : "none",
										transition: "transform 0.3s",
										pointerEvents: "none",
									}}
								/>
							</div>
						</button>

						<div
							style={{
								position: "absolute",
								left: "100%",
								marginLeft: "8px",
								opacity: isExpanded ? 1 : 0,
								pointerEvents: isExpanded ? "auto" : "none",
								width: isExpanded ? "16rem" : 0,
								transition: "all 0.3s",
							}}
						>
							<div
								contentEditable
								ref={inputRef}
								style={{
									width: "100%",
									padding: "4px 16px",
									boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
									border: "1px solid #4B5563",
									backgroundColor: "#1F2937",
									borderRadius: "20px",
									outline: "none",
									color: "#FFFFFF",
								}}
							/>
						</div>
					</div>
				</div>
			</ShadowRoot>
		</div>
	);
};

export default FloatingMenu;
