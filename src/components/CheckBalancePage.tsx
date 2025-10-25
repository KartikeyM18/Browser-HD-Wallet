import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";

export const CheckBalancePage = () => {

    const [address, setAddress] = useState("");

    const [selectedWallet, setSelectedWallet] = useState("solana");

    const [balance, setBalance] = useState<string | number>(-2);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {

        setBalance(-2);
        setAddress(e.target.value);

        if (e.target.value.startsWith("0x")) setSelectedWallet("ethereum");
        else setSelectedWallet("solana");
    }

    const getBalance = async () => {
        console.log(selectedWallet);
        if (selectedWallet == "solana") {

            const LAMPORTS_PER_SOL = 1e9;
            try {
                //"https://api.testnet.solana.com"
                const res = await axios.post(import.meta.env.VITE_SOL_RPC_URL, {
                    jsonrpc: "2.0",
                    id: 1,
                    method: "getBalance",
                    params: [address]
                });

                const lamports: number = res.data.result.value;
                console.log(lamports);
                const sols: number = lamports / LAMPORTS_PER_SOL;

                console.log("balance: ", res.data.result.value);
                return sols;

            } catch (error) {
                console.log(error);
                return -1;
            }
        }

        if (selectedWallet == "ethereum") {
            try {
                // "https://eth.drpc.org"
                const res = await axios.post(import.meta.env.VITE_ETH_RPC_URL, {
                    jsonrpc: "2.0",
                    id: 1,
                    method: "eth_getBalance",
                    params: [address, "latest"]
                });

                console.log("balance: ", res.data.result);

                const weiHex: string = res.data.result;

                const weiBigInt: bigint = BigInt(weiHex);
                const ethBalanceString: string = ethers.formatEther(weiBigInt);

                console.log("Balance in Wei (Hex): ", weiHex);
                console.log("Balance in ETH (String): ", ethBalanceString);

                return ethBalanceString;

            } catch (error) {
                console.log(error);
                return -1;
            }
        }
    }

    const handleClick = async () => {
        // const b = await getBalance();
        // setBalance(b || -1);

        getBalance().then((b) => setBalance(b!));
    }


    return (
        <div className="min-h-[calc(100vh-7rem)] h-auto pt-25 pb-21 bg-black text-white flex items-center justify-center  ">
            <div className="flex flex-col items-center gap-10">
                <div className="text-7xl">
                    {selectedWallet[0].toUpperCase() + selectedWallet.substring(1)} <span className="bg-gradient-to-r from-purple-300 to-purple-900 bg-clip-text text-transparent">Balance</span>
                </div>

                <div>
                    <input type="text" placeholder="Enter your Public Key" className="w-5xl py-4 px-10 rounded-full text-xl bg-gradient-to-r from-purple-950 " onChange={handleInput} value={address} />

                </div>

                <div>
                    <button className="bg-purple-950 rounded-2xl p-4 px-24 hover:bg-purple-800 transition-all duration-500 cursor-pointer text-2xl" onClick={handleClick}>
                        Check Balance
                    </button>

                </div>

                <div className="text-3xl pt-10 border-b-2 border-b-gray-500">
                    
                    {balance == -2 ? <></> :
                        (balance == -1 ? "ERROR" : <> {balance} <span className="font-semibold text-purple-300"> { (selectedWallet.substring(0, 3).toUpperCase())}</span> </>)
                    }
                </div>
            </div>
        </div>
    )
}
