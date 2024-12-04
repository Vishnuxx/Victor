export const FloatingButton = ({ buttonRef, handleMouseDown, handleClick, isLoading, children }: { buttonRef: React.RefObject<HTMLElement>; handleMouseDown: (e: React.MouseEvent) => void; handleClick: (e: React.MouseEvent) => void; isLoading: boolean; children: React.ReactNode }) => (


    <div className="relative flex text-white text-[12px] m-0">
        <div className={ `w-[33px] h-[33px]  shadow-[0_0_10px_0_rgba(0,0,0,0.1)] border border-gray-600 rounded-[100%] overflow-hidden m-0  ${ isLoading ? " transition-all duration-300 animate-pulse" : "" } from-blue-500 bg-gradient-to-r bg-pink-400 text-white  select-none  flex items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors duration-200` }>
            <button ref={ buttonRef as any} onMouseDown={ handleMouseDown } onClick={ handleClick } className="w-[25px] h-[25px] m-0 rounded-[100%] bg-[#262626] text-white flex items-center justify-center cursor-move transition-colors duration-200">
                <img src={ "../tooltip.png" } />
            </button>
        </div>
        { children }
    </div>
);

