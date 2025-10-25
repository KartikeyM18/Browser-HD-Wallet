import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import React, { useState } from "react"
import nacl from "tweetnacl";
import bs58 from 'bs58';
import axios from "axios";
import { Eye, EyeClosed } from "lucide-react";
import { SecretPhraseBox } from "./SecretPhraseBox";


interface WalletType {
    privateKey: string;
    publicKey: string;
    showPrivateKey: boolean;
    balance: number;
}

export const SolanaWallet = () => {

    const [mnemonic, setMnemonic] = useState("");

    const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMnemonic(e.target.value);
    }


    const [wallets, setWallets] = useState<WalletType[]>([]);


    const getBalance = async (publicKey: string) => {
        const LAMPORTS_PER_SOL = 1e9;
        try {
            //"https://api.testnet.solana.com"
            const res = await axios.post(import.meta.env.VITE_SOL_RPC_URL, {
                jsonrpc: "2.0",
                id: 1,
                method: "getBalance",
                params: [publicKey]
            });

            const lamports: number = res.data.result.value;
            const sols: number = lamports / LAMPORTS_PER_SOL;

            console.log("balance: ", res.data.result.value);
            return sols;

        } catch (error) {
            console.log(error);
            return -1;
        }
    }

    const addWallet = async () => {
        const seed = mnemonicToSeedSync(mnemonic);
        const walletNo = wallets.length;

        const path = `m/44'/501'/${walletNo}'/0'`;

        const seedHex = seed.toString('hex');

        const derivedSeed = derivePath(path, seedHex);

        const keypair = nacl.sign.keyPair.fromSeed(derivedSeed.key);

        const solanaKeypair = Keypair.fromSecretKey(keypair.secretKey);

        const publicKey = solanaKeypair.publicKey.toBase58();

        const newWallet = {
            privateKey: bs58.encode(solanaKeypair.secretKey),
            publicKey: publicKey,
            showPrivateKey: false,
            balance: await getBalance(publicKey)
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

        <div className="min-h-[calc(100vh-7rem)] h-auto pt-25 pb-21 bg-black text-white flex items-center justify-center  ">
            <div className="flex flex-col items-center gap-10">
                <div className="text-7xl">
                    Secret <span className="bg-gradient-to-r from-purple-300 to-purple-900 bg-clip-text text-transparent">Recovery</span> Phrase
                </div>

                <div>


                    {phrase ?
                        <SecretPhraseBox phrase={phrase}/>
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
                                    {wallet.balance} <span className="font-semibold">SOL</span>
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
