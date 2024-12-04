import { File } from "lucide-react";
import { MessageHead } from "./components/ChatHead";
import { ChatInput } from "./components/ChatInput";
import { DrawerButton } from "./components/DrawerButton";
import { MessageHeadProps } from "./components/types";
import { useEffect, useRef, useState } from "react";
import { useAIInteraction, useChatSession, useMessageState } from "./hooks";
import { useNavigate } from "react-router";
import { Agent, AgentType, MessageType } from "./types";
import { useAgent } from "./utils/agentutils";
import AgentStore from "./services/AgentStore";


const ChatMenuBar = () => {
    const navigate = useNavigate()
    return (
        <div className="flex items-center justify-between p-4 ">
            <img src="../assets/logo.png" className=" w-6 h-6" alt="" />
            <h1 className="text-lg font-semibold" onClick={ () => {
                console.log("hsdsd")
                navigate("/agents")

            } }>Chat Assistant</h1>
            <DrawerButton></DrawerButton>
        </div>
    );
};

interface ChatMessageRendererProps {
    messages: MessageHeadProps[];
    isLoading: boolean;
    onReply?: (message: MessageHeadProps) => void;
}

const ChatMessageRenderer = ({ messages, isLoading, onReply }: ChatMessageRendererProps) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        ref.current?.scrollTo({ behavior: "smooth", top: ref.current.scrollHeight });
    }, [messages]);

    return (
        <div className="flex-col flex items-center w-full h-full overflow-y-hidden p-4 space-y-4">
            <div ref={ ref } className="flex-col flex items-center w-full max-w-[1000px] h-full overflow-y-scroll md:p-4 pb-10 space-y-4">
                { messages.map((message: MessageHeadProps, i: number) => {
                    // console.log(i == messages.length - 1);
                    return <MessageHead key={ i } onReply={ onReply } message={ message } isLoading={ i == messages.length - 1 ? isLoading : false }></MessageHead>;
                }) }
            </div>
        </div>
    );
};

const QuickToolBar = () => {
    return (
        <div className="px-4 py-2 flex justify-center space-x-4">
            <button className=" flex focus:bg-[#37393d] bg-[#28292b]  text-gray-400 p-2 rounded-full  hover:bg-gray-500 hover:text-white">
                <File className="w-4 h-4 "></File>
            </button>
            <button className=" flex focus:bg-[#37393d] bg-[#28292b]  text-gray-400 p-2 rounded-full  hover:bg-gray-500 hover:text-white">
                <File className="w-4 h-4 "></File>
            </button>
        </div>
    );
};


// const agentStore = new AgentStore()

// agentStore.addAgent({
//     name: "agent1",
//     type: AgentType.PROMPT,
//     description: "",
//     systemPrompt: "You are a json bot. you can respond only in json format",
//     topK: 5,
//     temperature: 0.5
// })

// agentStore.addAgent({
//     name: "agent2",
//     type: AgentType.PROMPT,
//     description: "",
//     systemPrompt: "You are a XML bot. you can respond only in XML format",
//     topK: 5,
//     temperature: 0.5
// })

// agentStore.addAgent({
//     name: "agent3",
//     type: AgentType.PROMPT,
//     description: "",
//     systemPrompt: "You are a XML bot. you can respond only in XML format",
//     topK: 5,
//     temperature: 0.5
// })



const ChatScreen = () => {
    const systemPrompt = `Your name is Victor, a smart chat assistant who can answer queries from the user. 
  The user may or may not provide related references. The response must be factually correct.`;

    const { currentMessage, updateCurrentMessage, updateResponse, inputMessages, addMessage, isLoading, setIsLoading } = useMessageState();
    const [agents , setAgents] = useState<Agent[]>([])

    useEffect(() => {
        const loadAgents = async () => {
            const store = new AgentStore()
            const agents = await store.getAllAgents()
            setAgents(agents)
        }
        loadAgents()
    },[])
    

    const onSend = async (user_message: MessageHeadProps) => {
        addMessage(user_message);
        await useAgent({
            user_msg : user_message, 
            agents : agents,
            onStart :(name: string) => {
                console.log("started : ", name)
                const bot_message: MessageHeadProps = {
                    type: MessageType.BOT,
                    avatar: "../../assets/logo.png",
                    title: name ,
                    references: [],
                    content: "",
                }
                addMessage(bot_message);
            },
            onUpdate : (chunk : string) => {
                console.log("update : ", chunk)
                updateResponse(chunk)
            },
            onFinish : () => {
                console.log("finish : ")
            },
            onError : () => {

            }
        }
        )

        // await askAI(message, addMessage, (chunk: string) => updateResponse(chunk));
    };

    const onReply = (message: MessageHeadProps) => {
        updateCurrentMessage({
            ...currentMessage,
            references: [...currentMessage.references, { title: message.title, type: message.type, content: message.content }],
        });
    };

    useEffect(() => {
        console.log(inputMessages);
    }, [inputMessages]);

    const onInputUpdate = (message: MessageHeadProps) => {
        updateCurrentMessage(message);
    };

    console.log(currentMessage);

    return (
        <div className="flex flex-col h-screen w-full px-1">
            <ChatMenuBar />
            <ChatMessageRenderer onReply={ onReply } messages={ inputMessages } isLoading={ isLoading } />
            <ChatInput agentsuggestionlist={agents.values().toArray().map((agent)=>agent.name)} value={ currentMessage } isEnabled={ !isLoading } onSend={ onSend } onUpdate={ onInputUpdate } />
            <QuickToolBar />
            {/* <Input value={currentMessage} isEnabled onUpdate={(msg)=>console.log(msg)} onSend={(msg)=>console.log(msg)}></Input> */ }
        </div>
    );
};

export default ChatScreen;
