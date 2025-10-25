
import solanaImage from "../assets/solana.svg"
import ethImage from "../assets/Ethereum-logo.png"
import { useState } from "react"

export const HomePage = ({ setWallet }: { setWallet: React.Dispatch<React.SetStateAction<"" | "solana" | "ethereum" | "balance">> }) => {

    const [blockImage, setBlockImage] = useState<"solana" | "ethereum">("solana")


    return (
        <div className="h-[calc(100vh-3.5rem)] bg-black text-white flex items-center justify-center  ">
            <div className="flex  justify-around">
                <div className="flex flex-col   justify-around gap-6 ">
                    <div className=" flex flex-col gap-3">
                        <div className="text-7xl">
                            Choose a <span className="bg-gradient-to-r from-purple-300 to-purple-950 bg-clip-text text-transparent">Blockchain </span>
                        </div>
                        <div className="text-3xl pl-2">
                            to create wallet
                        </div>
                    </div>

                    <div className="flex gap-16 text-2xl tracking-widest  ">
                        <button className="bg-purple-950 rounded-2xl p-4 px-24 hover:bg-purple-800 transition-all duration-500 cursor-pointer" onMouseEnter={() => { setBlockImage("solana") }} onClick={() => { setWallet("solana") }}>
                            Solana
                        </button>

                        <button className="bg-purple-300 rounded-2xl p-4 px-24 text-black hover:bg-purple-400 transition-all duration-500 cursor-pointer" onMouseEnter={() => { setBlockImage("ethereum") }} onClick={() => { setWallet("ethereum") }}>
                            Ethereum
                        </button>
                    </div>
                </div>

                <div className="h-[450px] w-[450px]  flex justify-center items-center">
                    {blockImage === "solana" ?
                        <img src={solanaImage} alt="solana-icon" height={447} width={447} className="" />
                        :
                        <img src={ethImage} alt="ethereum-icon" height={350} width={350} className="" />
                    }
                </div>
            </div>
        </div>
    )
}
