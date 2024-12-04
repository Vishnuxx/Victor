import { Notebook, PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DrawerButton : React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDrawer = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div>
			<Notebook onClick={toggleDrawer} className="w-5 h-5 " />
			<Drawer isOpen={isOpen} onClose={toggleDrawer}></Drawer>
		</div>
	);
};

const Drawer : React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
	const drawerRef = useRef<HTMLDivElement>(null);

	// Close the drawer when clicking outside of it
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, onClose]);

	return (
		<div className={`fixed z-50 top-0 right-0 w-[80%] max-w-[350px] h-full bg-[#282828] shadow-lg transition-transform transform ${isOpen ? "translate-x-0" : "translate-x-full"}`} ref={drawerRef}>
			<div className="p-4 flex flex-col h-full">
				<div className="flex flex-row space-x-2">
					<PlusIcon className=" hover:bg-[#404040] w-8 h-8"></PlusIcon>
					<h2 className="text-lg font-bold w-full">Sources</h2>
				</div>

				<div className="flex flex-col  space-y-2 py-2 overflow-y-scroll h-full">
					<div className=" h-fit space-y-2 py-2">
						{[2, 243, 34, 4, 4, 4, 4, 4, 4, 4, 3, 3, 34, 4, 4, 4, 4, 4].map((item, i) => {
							return (
								<div key={i} className="flex flex-col overflow-hidden w-full max-h-[100px] px-2 py-2 hover:bg-[#404040] bg-[#363636] border-gray-500 rounded-lg text-sm">
									<p className="font-bold ">This is p</p>
									<p className="text-xs text-gray-400 ">This is p</p>
									<p className="text-ellipse">This is qskjhdkfjshdkfjhs dkfjhsdk fjh ksdjhf ksdjhf ksdjh fkjsdhf kjdsh fkjsdhfkjsdhfk </p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};


export  {DrawerButton , Drawer}