import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import React, { useState } from "react"
import nacl from "tweetnacl";
import bs58 from 'bs58';


interface Wallet {
    privateKey: string;
    publicKey: string;
    showPrivateKey: boolean;
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

    const [wallets, setWallets] = useState<Wallet[]>([]);

    const addWallet = () => {
        const seed = mnemonicToSeedSync(mnemonic);
        const walletNo = wallets.length;

        const path = `m/44'/501'/${walletNo}'/0'`;

        const seedHex = seed.toString('hex');

        const derivedSeed = derivePath(path, seedHex);

        const keypair = nacl.sign.keyPair.fromSeed(derivedSeed.key);

        const solanaKeypair = Keypair.fromSecretKey(keypair.secretKey);

        const newWallet = {
            privateKey: bs58.encode(solanaKeypair.secretKey),
            publicKey: solanaKeypair.publicKey.toBase58(),
            showPrivateKey: false
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
        <div className="bg-black text-white h-screen p-2 px-4">
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
                        <h2>Public Key: {wallet.publicKey}</h2>

                        <h2 className="flex w-full items-center justify-between my-2">
                            <div>Private Key: {visibility[wallet.publicKey] ? wallet.privateKey : "*".repeat(88)}</div>
                            
                            
                            <button onClick={() => toggleVisibility(wallet.publicKey)}
                                className="border px-2 rounded-md bg-gray-600">
                                View 👁️
                            </button>
                        </h2>

                    </div>
                })}
            </div>
        </div>
    )
}
