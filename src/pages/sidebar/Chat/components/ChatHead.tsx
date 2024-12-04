import Markdown from "markdown-parser-react";
import { MessageHeadProps, MessageType } from "./types";


export interface ChatHeadProps {
    message : MessageHeadProps,
    isLoading : boolean , 
    onReply? : (message : MessageHeadProps) => void
}

export const MessageHead = ({ message : { type , title , avatar , references , content } , isLoading , onReply} : ChatHeadProps) => {
	const Options = () => {
		if (type == MessageType.USER) return;
		return (
			!isLoading && <div className="flex flex-row space-x-2 px-4 w-full justify-end text-gray-500">
				<p onClick={() => onReply && onReply({ type , title , avatar , references , content })} className="hover:text-gray-200 text-xs  cursor-pointer">Reply</p>
			</div>
		);
	};
	return (
		<div className={`w-full flex flex-row ${type == MessageType.USER ? "justify-end" : "justify-start"}  `}>
			<div className={` h-fit overflow-hidden text-wrap  rounded-2xl flex flex-col ${type == MessageType.USER ? "border border-[#303030]  w-[80%] max-w-[350px]" : "bg-[#303030]"}  py-2 space-y-2 w-full `}>
				{type == MessageType.BOT && (
					<div className={`flex flex-row items-center ${isLoading ? "animate-pulse" : ""}`}>
						<img src={avatar} className="w-4 h-4 mx-2 "></img>
						<p className="text-gray-400 text-xs">{title}</p>
					</div>
				)}
				{references.map((reference, i) => {
					return (
						<div key={i} className="flex flex-col px-1 space-y-1 overflow-hidden text-gray-400">
							{/* Reply head */}
							<div className=" border-l-4 border-gray-400  bg-[#202020] rounded-lg">
								<p className="text-gray-400 px-3  text-xs  font-thin line-clamp-1 text-ellipsis">{reference.title}</p>
								<p className="rounded-lg text-xs line-clamp-2 text-gray-400 p-2  h-fit max-h-20 w-full text-ellipsis">{reference.content}</p>
							</div>
						</div>
					);
				})}

				<div className="markdown prose prose-invert prose-lead:font-bold prose-em:font-bold prose-md prose-h1:text-2xl prose-h2:text-xl prose-h2:my-2 prose-pre:my-2 prose-td:border prose-td:border-gray-600 prose-h1:my-2 prose-base w-full rounded-lg px-3 py-0 prose-p:my-0 text-gray-200 h-fit  ">
					<Markdown content={content} />
				</div>
				<Options></Options>
			</div>
		</div>
	);
};
