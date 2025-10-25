import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import React, { useState } from "react"
import { ethers, HDNodeWallet } from "ethers";
import { Wallet } from "ethers";
import axios from "axios";
import { SecretPhraseBox } from "./SecretPhraseBox";
import { Eye, EyeClosed } from "lucide-react";


interface WalletType {
    privateKey: string;
    publicKey: string;
    showPrivateKey: boolean;
    balance: number | string;
}

export const EthereumWallet = () => {

    const [mnemonic, setMnemonic] = useState("");

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMnemonic(e.target.value);
    }

    const [wallets, setWallets] = useState<WalletType[]>([]);

    const getBalance = async (publicKey: string) => {
        try {
            // "https://eth.drpc.org"
            const res = await axios.post(import.meta.env.VITE_ETH_RPC_URL, {
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getBalance",
                params: [publicKey, "latest"]
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

    const addWallet = async () => {
        const seed = mnemonicToSeedSync(mnemonic);
        const walletNo = wallets.length;

        const path = `m/44'/60'/${walletNo}'/0'`;

        const hdNode = HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(path);

        const privateKey = child.privateKey;

        const wallet = new Wallet(privateKey);

        const newWallet = {
            privateKey: privateKey,
            publicKey: wallet.address,
            showPrivateKey: false,
            balance: await getBalance(wallet.address)
        }

        setWallets([...wallets, newWallet]);
    }

    const [visibility, setVisibility] = useState<{ [key: string]: boolean }>({});

    const toggleVisibility = (publicKey: string) => {
        setVisibility(prev => ({
            ...prev,
            [publicKey]: !prev[publicKey]
        }));
    };

    const [phrase, setPhrase] = useState("");

    const generateWalletHandler = async () => {
        const wordPhrase = generateMnemonic(128);
        setPhrase(wordPhrase);
        setMnemonic(wordPhrase);
        await addWallet();
    }

    return (
        // <div className="p-2 px-4">
        //     Ethereum Wallet

        //     <div>
        //         <input type="text" placeholder="Enter your secret phrase" value={mnemonic} onChange={inputHandler}
        //             className="w-2xl border px-2 rounded-md my-2 mr-2" />

        //         <button onClick={generatePhrase}
        //             className="border  px-2 rounded-md bg-blue-700 ">
        //             Generate Secret Phrase
        //         </button>

        //     </div>

        //     <div>
        //         <button onClick={addWallet}
        //             className="border  px-2 rounded-md bg-green-700 ">Add Wallet</button>
        //     </div>

        //     <div>
        //         {wallets.map((wallet, index) => {
        //             return <div key={index}
        //                 className="border my-2 w-7xl py-2 px-4">
        //                 <h2 className="flex w-full items-center justify-between my-2">
        //                     <div>Public Key: {wallet.publicKey}</div>


        //                     <div className="border px-2 rounded-md bg-gray-800 w-20 text-center">
        //                         {wallet.balance == -1 ? "ERROR" : wallet.balance + " ETH"} 
        //                     </div>
        //                 </h2>

        //                 <h2 className="flex w-full items-center justify-between my-2">
        //                     <div>Private Key: {visibility[wallet.publicKey] ? wallet.privateKey : "*".repeat(88)}</div>


        //                     <button onClick={() => toggleVisibility(wallet.publicKey)}
        //                         className="border px-2 rounded-md bg-gray-600">
        //                         View 👁️
        //                     </button>
        //                 </h2>

        //             </div>
        //         })}
        //     </div>
        // </div>

        <div className="min-h-[calc(100vh-7rem)] h-auto pt-25 pb-21 bg-black text-white flex items-center justify-center  ">
            <div className="flex flex-col items-center gap-10">
                <div className="text-7xl">
                    Secret <span className="bg-gradient-to-r from-purple-300 to-purple-900 bg-clip-text text-transparent">Recovery</span> Phrase
                </div>

                <div>


                    {phrase ?
                        <SecretPhraseBox phrase={phrase} />
                        :
                        <input type="text" placeholder="Enter your Secret Phrase" className="w-5xl py-4 px-10 rounded-full text-xl bg-gradient-to-r from-purple-950 " value={mnemonic} onChange={inputHandler} />
                    }
                </div>

                <div>
                    {mnemonic ?
                        <button className="bg-purple-950 rounded-2xl p-4 px-24 hover:bg-purple-800 transition-all duration-500 cursor-pointer text-2xl" onClick={addWallet}>
                            Add Wallet
                        </button>
                        :
                        <button className="bg-purple-950 rounded-2xl p-4 px-24 hover:bg-purple-800 transition-all duration-500 cursor-pointer text-2xl" onClick={generateWalletHandler}>
                            Generate Wallet
                        </button>
                    }
                </div>

                <div className="flex flex-col gap-10 mt-3">
                    {wallets.map((wallet, index) => {
                        return <div key={index} className="w-5xl border border-gray-600 rounded-3xl overflow-hidden pt-5 pb-4 px-10 border-b-4 border-l-4">
                            <div className="flex justify-between border-b-2 pb-1 border-b-gray-600 items-center">
                                <div className="text-4xl font-semibold">
                                    Wallet {index+1}
                                </div>

                                <div className="border text-2xl rounded-full py-2 px-5 bg-purple-300 text-black">
                                    {wallet.balance} <span className="font-semibold">ETH</span>
                                </div>
                            </div>

                            <div className=" flex flex-col gap-4 pt-5">
                                <div className="flex flex-col gap-2">
                                    <div className="text-2xl font-semibold">Public Key</div>
                                    <div className="text-gray-400">
                                        {wallet.publicKey}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">

                                    <div className="text-2xl font-semibold">Private Key</div>
                                    <div className="flex justify-between items-center">

                                        <div className="text-gray-400">
                                            {visibility[wallet.publicKey] ? wallet.privateKey : "* ".repeat(44)}
                                        </div>

                                        <div className="cursor-pointer hover:rounded-md p-1 transition-all duration-100 hover:bg-gray-700 " onClick={() => toggleVisibility(wallet.publicKey)}>


                                            {visibility[wallet.publicKey] ? <Eye /> : <EyeClosed />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}


                </div>
            </div>
        </div>
    )
}
