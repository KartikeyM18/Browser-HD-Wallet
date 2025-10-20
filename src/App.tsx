import './App.css'
import { EthereumWallet } from './components/EthereumWallet';
import { SolanaWallet } from './components/SolanaWallet';
function App() {

    return (
        <div className='h-screen bg-black text-white' >
            <SolanaWallet />
            <EthereumWallet />
        </div>
    )
}

export default App
