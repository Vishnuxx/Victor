// import { generateEmbeddings } from "@/services/Embeddings/popup";
import { disableTargetSelection, enableTargetSelection, onReceiveTargetContent } from "@/services/NotifyMe/popup";
import { useEffect, useState } from "react";

function App() {
	const [enable, setenable] = useState(false);
    const [sentences, setSentences] = useState([]);
	useEffect(() => {
		onReceiveTargetContent((content) => {
			disableTargetSelection();
            setenable(false);
		});
	}, []);

    console.log(sentences)

	const handleClick = () => {
		if (!enable) {
			enableTargetSelection();
            setenable(true)
		} 
	};

    const embeddingOnClick = async () => {
        await generateEmbeddings(sentences)
    }
	return (
		<div className="text-black">
			<button onClick={handleClick}>{enable ? "Disable" : "Enable"}</button>
            {/* <input type="text" onChange={(e)=> setSentences([e.target.value])} />
			<button onClick={embeddingOnClick}>Generate Embeddings</button> */}
		</div>
	);
}

export default App;
