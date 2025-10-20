import axios from "axios";
import { ethers } from "ethers";
import React, { useState } from "react"



export const CheckBalance = () => {

    const [address, setAddress] = useState("");

    const [selectedWallet, setSelectedWallet] = useState("solana");

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {

        setBalance(-2);
        setAddress(e.target.value);

        if (e.target.value.startsWith("0x")) setSelectedWallet("ethereum");
        else setSelectedWallet("solana");
    }
    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setBalance(-2);
        setSelectedWallet(e.target.value);
    }

    const getBalance = async () => {
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

    const [balance, setBalance] = useState<string | number>(-2);

    const handleClick = async () => {
        // const b = await getBalance();
        // setBalance(b || -1);

        getBalance().then((b) => setBalance(b!));
    }

    return <div className="p-2 px-4 border rounded-xl w-5xl my-6" >
        <div>
            Check Balance
        </div>
        <input type="text" placeholder="Enter Wallet Address (Public Key)" onChange={handleInput} value={address}
            onKeyDown={(e) => { (e.key == "Enter") && handleClick() }}
            className="w-2xl border px-2 rounded-md my-2 mr-2" />

        <select value={selectedWallet} onChange={handleSelect} className="border rounded-md mr-2 px-2 bg-blue-950">
            <option value="solana">Solana</option>
            <option value="ethereum">Ethereum</option>
        </select>

        <button onClick={handleClick} className="border  px-2 rounded-md bg-green-700 ">Check Balance</button>

        <div >
            {balance == -2 ? <></> :
                (balance == -1 ? "ERROR" : "Balance: " + balance + " " + (selectedWallet.substring(0, 3).toUpperCase()))
            }
        </div>
    </div>
}