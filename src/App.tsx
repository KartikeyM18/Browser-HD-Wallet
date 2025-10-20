import './App.css'
import { CheckBalance } from './components/CheckBalance';
import { EthereumWallet } from './components/EthereumWallet';
import { SolanaWallet } from './components/SolanaWallet';
function App() {

    return (
        <div className='h-screen bg-black text-white' >
            <SolanaWallet />
            <EthereumWallet />

            <CheckBalance />
        </div>
    )
}

export default App
