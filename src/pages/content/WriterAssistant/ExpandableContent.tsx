export const ExpandableContent = ({ isExpanded, inputRef, handleKeyDown, onInput }: { isExpanded: boolean; inputRef: React.RefObject<HTMLElement>; handleKeyDown: (e: React.KeyboardEvent) => void, onInput: React.FormEventHandler<HTMLDivElement> }) => (
    <div className={ ` p-[3px] flex flex-col items-center space-y-[6px] left-[100%] rounded-[20px] transition-all duration-300  from-blue-500 bg-gradient-to-r bg-pink-400 ${ isExpanded ? "opacity-100 text-[12px]" : "opacity-0 pointer-events-none text-[0]" }` } style={ { width: isExpanded ? "250px" : 0 } }>
        <div contentEditable ref={ inputRef as any } onKeyDown={ handleKeyDown } onInput={ onInput } className="w-full px-[6px] py-[3px] border border-gray-600 bg-gray-800 rounded-[20px] focus:outline-none text-white" />
    </div>
);