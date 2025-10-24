
export const Navbar = () => {
    return (
        <div className="bg-black h-14 text-lg text-white border-b-2 border-b-gray-600">
            <div className="w-sm h-full flex items-center justify-around text pt-1  ml-20">
                <div className="hover:text-purple-300 transition-all duration-200 cursor-pointer">
                    Wallet
                </div>
                <div className="hover:text-purple-300 transition-all duration-200 cursor-pointer">
                    Check Balance
                </div>
            </div>
        </div>
    )
}
