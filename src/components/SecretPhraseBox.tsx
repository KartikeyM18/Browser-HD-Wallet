import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

export const SecretPhraseBox = ({phrase}: {phrase: string}) => {

    const arr = phrase.split(" ");
    const [isPhraseOpen, setIsPhraseOpen] = useState(false);

    const handleOpen = () => {
        setIsPhraseOpen((prev) => !prev);
    }

    return (
        <div className=" ">
            <div className="flex justify-between w-5xl py-4 px-10 text-xl bg-gradient-to-r from-purple-950 rounded-t-4xl border-b-4 border-black">

                <div>
                    Your Secret Phrase
                </div>
                <div className="cursor-pointer hover:rounded-md p-1 transition-all duration-100 hover:bg-gray-700 " onClick={handleOpen}>
                    {isPhraseOpen ? <ChevronUp /> : <ChevronDown />}

                </div>
            </div>

            {
                <div className={` grid grid-rows-3 grid-cols-4 gap-2 bg-gradient-to-r from-purple-950 transition-all duration-200 overflow-hidden ease-linear rounded-b-4xl ${isPhraseOpen ? 'max-h-96  p-5' : 'max-h-0'}`}>
                    {arr.map((ele, index) => {
                        return <div key={index} className="px-3 py-2 bg-black rounded-md hover:bg-gray-900 transition-all duration-75 cursor-pointer">
                            {ele}
                        </div>
                    })}
                </div>
            }
        </div>
    )
}
