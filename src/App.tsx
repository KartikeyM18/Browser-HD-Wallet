import './App.css'
import { CheckBalance } from './components/CheckBalance';
import { EthereumWallet } from './components/EthereumWallet';
import { HomePage } from './components/HomePage';
import { Navbar } from './components/Navbar';
import { SolanaWallet } from './components/SolanaWallet';
function App() {

    return (
        // <div className='h-screen bg-black text-white' >
        //     <SolanaWallet />
        //     <EthereumWallet />

        //     <CheckBalance />
        // </div>
        <div className='h-screen font-[Poppins]'>
            <Navbar />
            <HomePage />
        </div>
    )
}

export default App
