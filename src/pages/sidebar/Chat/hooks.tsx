import { useEffect, useRef, useState } from "react";
import { Agent, MessageHeadProps } from "./types";




export const useMessageState = () => {
    const [currentMessage, setCurrentMessage] = useState<MessageHeadProps>({
        type: "USER",
        avatar: "../../assets/logo.png",
        title: "Sample Title",
        references: [],
        content: "",
    });
    const [inputMessages, setInputMessages] = useState<MessageHeadProps[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const addMessage = (message: MessageHeadProps) => {
        setInputMessages((prev) => [...prev, message]);
    };

    const updateCurrentMessage = (updates: Partial<MessageHeadProps>) => {
        setCurrentMessage((prev) => {
            return {
                ...prev,
                ...updates,
            };
        });
    };

    const updateResponse = (chunk: string) => {
        setInputMessages((prev: MessageHeadProps[]) => {
            // Create a new array with the updated content
            const updatedMessages = [...prev];
            const lastMessage = { ...updatedMessages[updatedMessages.length - 1], content: chunk }; // Create a new object for the last message
            updatedMessages[updatedMessages.length - 1] = lastMessage; // Update the last message in the array
            return updatedMessages; // Return a new array reference
        });
    };

    return {
        currentMessage,
        updateCurrentMessage,
        updateResponse,
        inputMessages,
        setInputMessages,
        addMessage,
        isLoading,
        setIsLoading,
    };
};



export const useChatSession = (systemPrompt: string) => {
    const session = useRef(null);
    useEffect(() => {
        async function createSession () {
            session.current = await window.ai.languageModel.create({ systemPrompt });
            console.log("Session created");
        }

        createSession();
        return () => session.current?.destroy();
    }, [systemPrompt]);
    return session;
};

interface PromptAPIProps {
    prompt : string
    isStreaming : boolean
    temperature : number
    topK : number
    onStart : () => void
    onStream : (chunk : string) => void
    onFinish : (response : string) => void
    onError : (error : any) => void
}




export const useAIInteraction = (session: any ,  setIsLoading: (loading: boolean) => void) => {
    const extractMessageContent = (message: MessageHeadProps) => {
        let msg = "### References\n";
        message.references.forEach((ref, i) => {
            msg += `${ i + 1 }. ${ ref.title }\n\`\`\`\n${ ref.content }\n\`\`\`\n`;
        });
        msg += `# Query\n${ message.content }`;
        return msg;
    };

    const askAI = async (message: MessageHeadProps, addMessage: (msg: MessageHeadProps) => void, updateResponse: (chunk: string) => void) => {
        if (!session.current) {
            console.error("AI session not created");
            return;
        }

        setIsLoading(true);

        const stream = await session.current.promptStreaming(extractMessageContent(message));
        const botMessage: MessageHeadProps = {
            type: "BOT",
            avatar: "../../assets/logo.png",
            title: "Victor",
            references: [],
            content: "",
        };

        addMessage(botMessage);

        for await (const chunk of stream) {
            updateResponse(chunk);
        }

        setIsLoading(false);
    };

    return { askAI };
};