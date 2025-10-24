import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react";
import { SecretPhraseBox } from "./SecretPhraseBox";

export const WalletPage = () => {

    const [visible, setVisible] = useState(false);

    const handleVisible = ()=>{
        setVisible((v)=>!v);
    }

    return (
        <div className="min-h-[calc(100vh-3.5rem)] h-auto pt-25 pb-21 bg-black text-white flex items-center justify-center  ">
            <div className="flex flex-col items-center gap-10">
                <div className="text-7xl">
                    Secret <span className="bg-gradient-to-r from-purple-300 to-purple-900 bg-clip-text text-transparent">Recovery</span> Phrase
                </div>

                <div>
                    <input type="text" placeholder="Enter your Secret Phrase" className="w-5xl py-4 px-10 rounded-full text-xl bg-gradient-to-r from-purple-950 " />
                    {/* <SecretPhraseBox /> */}
                </div>

                <div>
                    <button className="bg-purple-950 rounded-2xl p-4 px-24 hover:bg-purple-800 transition-all duration-500 cursor-pointer text-2xl">
                        Generate Wallet
                    </button>
                </div>

                <div className="flex flex-col gap-10">
                    <div className="w-6xl border border-gray-600 rounded-3xl overflow-hidden p-5">
                        <div className="flex justify-between border-b-2 pb-1 border-b-gray-600 items-center">
                            <div className="text-4xl">
                                Wallet 1
                            </div>

                            <div className="border text-2xl rounded-full py-2 px-5 bg-purple-300 text-black">
                                0.0 ETH
                            </div>
                        </div>

                        <div className=" flex flex-col gap-4 pt-5">
                            <div className="flex flex-col gap-2">
                                <div className="text-2xl">Public Key</div>
                                <div>
                                    JJUqW5HGGsRvtoeQdjbWH61S1Bfh7TZ5TbtrSY428Lc
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">

                                <div className="text-2xl">Private Key</div>
                                <div className="flex justify-between items-center">

                                    <div>
                                        2cNnXZgXFQHTyzQ7wTzSa2QhDpShBRvcQhukffWPpEUgfJLqEHAGJgAs2vfW1yJNHXH7bw9h563L4BfByNtF94n8
                                    </div>

                                    <div className="cursor-pointer hover:rounded-md p-1 transition-all duration-100 hover:bg-gray-700 " onClick={handleVisible}>
                                      

                                        {visible ? <Eye /> : <EyeClosed/>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    )
}
