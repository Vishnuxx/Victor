import { Trash } from "lucide-react"
import { MessageContext, MessageHeadProps } from "./types"

interface ChatReferenceRendererProps {
    message: MessageHeadProps
    onDeleteReference: (index: number) => void
}
export const ChatReferenceRenderer = ({ message, onDeleteReference }: ChatReferenceRendererProps) => {
    return <div className="w-full py-2 space-y-2 select-none">
        { message.references.map((reference: MessageContext, i) => (
            <div key={ i } className="flex flex-row items-center px-1 space-x-1 space-y-1 overflow-hidden text-gray-400">
                {/* Reply head */ }
                <div className="border-l-4 w-full border-gray-400 bg-[#202020] rounded-lg">
                    <div className="flex flex-row overflow-x-hidden">
                        <p className="text-gray-400 px-3 w-full text-xs font-thin line-clamp-1 text-ellipsis">{ reference.title }</p>
                    </div>
                    <p className="rounded-lg text-xs line-clamp-2 text-gray-400 p-2 h-fit max-h-20 w-full text-ellipsis">{ reference.content }</p>
                </div>
                <button onClick={ () => onDeleteReference(i) } className="flex justify-center items-center w-8 h-8 bg-gray-800 hover:bg-gray-600 hover:text-white rounded-full">
                    <Trash className="w-4 h-4" />
                </button>
            </div>
        )) }
    </div>
}