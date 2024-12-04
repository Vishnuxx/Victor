import { useEffect, useRef, useState } from "react";
import AgentManager from "../services/AgentManager";

function TestChat () {
    const [value, setValue] = useState("");
    const [response, setResponse] = useState("");
    const managerref = useRef(new AgentManager())
    useEffect(() => {
        const init = async () => {
            managerref.current.addAgent({
                name: "summarizer agent",
                description: "Summarizes articles or any text contents in various lengths and formats",
                systemPrompt: ""
            })
            managerref.current.addAgent({
                name: "writer agent",
                description: "Writes articles or any text contents in various lengths and formats",
                systemPrompt: ""
            })
            managerref.current.addAgent({
                name: "Rewriter agent",
                description: "Rewrites text into clear concise manner.",
                systemPrompt: ""
            })
            await managerref.current.init()
        }
        init()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log("sumbit")
        const agent = await managerref.current.pickAgent(value)
        setResponse(agent != null ? JSON.stringify(agent) : "Error")

    }
    return <div className="text-black">
        <input onChange={ (e) => setValue(e.target.value) } value={ value } type="text" />
        <div className="text-white" >
            <button onClick={ handleSubmit }> submit </button>
            <p>Response : { response }</p>
        </div>

    </div>
}

export default TestChat;