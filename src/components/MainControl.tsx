import { useState } from "react"
import { HomePage } from "./HomePage"
import { Navbar } from "./Navbar"
import { SolanaWallet } from "./SolanaWallet";
import { EthereumWallet } from "./EthereumWallet";
import { CheckBalancePage } from "./CheckBalancePage";

export const MainControl = () => {

    const [wallet, setWallet] = useState<"" | "solana" | "ethereum" | "balance">("");
  
    return (
        <div className='h-screen font-[Poppins]'>
            <Navbar wallet={wallet} setWallet={setWallet} />
            

            {wallet === "solana" && <SolanaWallet/>}
            {wallet === "ethereum" && <EthereumWallet/>}
            {wallet === "balance" && <CheckBalancePage />}
            {!wallet && <HomePage setWallet={setWallet}/>}
        </div>
    )
}
