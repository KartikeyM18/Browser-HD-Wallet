import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import React, { useState } from "react"
import nacl from "tweetnacl";
import bs58 from 'bs58';
import axios from "axios";


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

    const generatePhrase = () => {
        const phrase = generateMnemonic(128);
        setMnemonic(phrase);
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
            const sols: number = lamports/LAMPORTS_PER_SOL; 

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

    return (
        <div className="p-2 px-4">
            SolanaWallet

            <div>
                <input type="text" placeholder="Enter your secret phrase" value={mnemonic} onChange={inputHandler}
                    className="w-2xl border px-2 rounded-md my-2 mr-2" />

                <button onClick={generatePhrase}
                    className="border  px-2 rounded-md bg-blue-700 ">
                    Generate Secret Phrase
                </button>

            </div>

            <div>
                <button onClick={addWallet}
                    className="border  px-2 rounded-md bg-green-700 ">Add Wallet</button>
            </div>

            <div>
                {wallets.map((wallet, index) => {
                    return <div key={index}
                        className="border my-2 w-7xl py-2 px-4">

                        <h2 className="flex w-full items-center justify-between my-2">
                            <div>Public Key: {wallet.publicKey}</div>


                            <div className="border px-2 rounded-md bg-gray-800 w-20 text-center">
                                {wallet.balance == -1 ? "ERROR" : wallet.balance + " SOL"}
                            </div>
                        </h2>

                        <h2 className="flex w-full items-center justify-between my-2">
                            <div>Private Key: {visibility[wallet.publicKey] ? wallet.privateKey : "*".repeat(88)}</div>


                            <button onClick={() => toggleVisibility(wallet.publicKey)}
                                className="border px-2 rounded-md bg-gray-600 w-20">
                                View 👁️
                            </button>
                        </h2>

                    </div>
                })}
            </div>
        </div>
    )
}
