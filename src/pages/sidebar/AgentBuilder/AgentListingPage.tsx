import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router"
import AgentManager from "../Chat/services/AgentManager"
import { useEffect, useRef, useState } from "react"
import AgentStore from "../Chat/services/AgentStore"
import { Agent } from "../Chat/types"

interface AgentInfo {
    name: string
    description: string
}

const AgentItem = ({ name, description }: AgentInfo) => {
    return <div className=" flex flex-col p-2 space-y-2 rounded-lg cursor-pointer border border-1 border-[#292929] hover:bg-[#292929]">
        <h3 className="text-md font-semibold ">{ name }</h3>
        <p className="text-gray-400 text-sm">{ description }</p>
        {/* <div className="flex justify-start space-x-2 text-xs">
            {
                skills.map((skill, i) => {
                    return <p key={ i } className="bg-gray-700 px-3 py-0  rounded-full text-gray-400">
                        { skill }
                    </p>

                })
            }


        </div> */}
    </div>
}


// interface AgentListingPageProps {
//     agentStore : AgentStore
// }

export const AgentListingPage = () => {
    const agentStore  = useRef(new AgentStore())
    const [agents, setAgents] = useState<Agent[]| null>(null)

    const navigate = useNavigate()

    useEffect(()=>{
        const getAgents = async () => {
            const agents = await agentStore.current.getAllAgents()
            setAgents(agents)
        }
        getAgents()
    },[])

    return (

        <div className=" p-2 rounded-lg h-full w-full space-y-4 flex flex-col">
            <div className="rounded-lg w-full space-x-2 flex flex-row items-center justify-start">
                <ChevronLeft onClick={ () => {
                    console.log("hsdsd")
                    navigate(-1)

                } }></ChevronLeft>
                <h2 className="text-xl font-semibold w-fit flex text-gradient-to-r from-blue-500 via-purple-500 to-pink-500">Agents</h2>
                <div className='flex flex-row w-full justify-end text-xs'>
                    <div className="flex flex-col items-end w-full max-w-[120px] space-x-2 p-[2px] rounded-[30px]  bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-0">
                        <button onClick={ () => navigate("/agent_creator", { state: { agent: null, is_new_agent: true } })} className="bg-gray-900 w-full  rounded-[30px] text-white px-4 py-2 transition-all duration-300 active:bg-black hover:bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                            Create New
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex  flex-col h-full text-sm overflow-y-scroll  ">
               { agents != null && <div className="flex space-y-2  flex-col  ">
                    {
                        agents.map((agent , i) => {
                            return <div onClick={ () => {
                                navigate("/agent_creator", { state: { agent, is_new_agent: false }})

                            } }>
                                <AgentItem key={ i } name={ agent.name } description={ agent.description }></AgentItem>
                            </div>
                        })
                    }
                </div>}


            </div>
            
        </div>

    );
};
