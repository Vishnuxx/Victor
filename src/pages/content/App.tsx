// import initNotifyMe from "@src/services/NotifyMe/content"
import { useEffect } from "react";
import {FloatingMenu} from "./summarizer/FloatingMenu";
import "../../services/InputAssistant/content"
import InputAssistant from "./WriterAssistant/InputAssistant";

function App() {
    useEffect(() => {
        console.log("content init")
    },[])
    return (
			<div>
				{/* <FloatingMenu></FloatingMenu> */}
                <InputAssistant></InputAssistant>
			</div>
		);
}

export default App