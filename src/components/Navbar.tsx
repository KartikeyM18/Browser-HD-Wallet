
export const Navbar = ({ wallet, setWallet }: {
    wallet: "" | "solana" | "ethereum" | "balance",
    setWallet: React.Dispatch<React.SetStateAction<"" | "solana" | "ethereum" | "balance">>
}) => {
    return (
        <div>

            <div className="bg-black h-14 text-lg text-white border-b-2 border-b-gray-600">
                <div className="w-sm h-full flex items-center justify-around text pt-1  ml-20">
                    <div className="hover:text-purple-300 transition-all duration-200 cursor-pointer"
                        onClick={() => setWallet("")}>
                        Wallet
                    </div>
                    <div className="hover:text-purple-300 transition-all duration-200 cursor-pointer"
                    onClick={()=>setWallet("balance")}>
                        Check Balance
                    </div>
                </div>
            </div>

            {wallet &&
                <div className="bg-black h-14 text-lg text-white ">
                    <div className="w-70 h-full flex items-center gap-23 text pt-1  ml-32">
                        <div className="hover:text-purple-300 transition-all duration-200 cursor-pointer" onClick={() => setWallet("solana")}>
                            Solana
                        </div>
                        <div className="hover:text-purple-300 transition-all duration-200 cursor-pointer" onClick={() => setWallet("ethereum")}>
                            Ethereum
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
