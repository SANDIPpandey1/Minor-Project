import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Share2 } from "lucide-react";
import Upload from "./contracts/Upload.json";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const initProvider = async () => {
      if (typeof window.ethereum === "undefined") {
        console.error("MetaMask is not installed");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      try {
        window.ethereum.on("chainChanged", () => window.location.reload());
        window.ethereum.on("accountsChanged", () => window.location.reload());
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        
        const contract = new ethers.Contract(contractAddress, Upload.abi, signer);
        
        setAccount(address);
        setContract(contract);
        setProvider(provider);
      } catch (error) {
        console.error("Error initializing provider:", error);
      }
    };

    initProvider();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      {/* Share Button */}
      {!modalOpen && (
        <button
          onClick={() => setModalOpen(true)}
          className="fixed top-4 right-4 px-4 py-2 bg-white text-purple-600 rounded-lg shadow-lg hover:bg-purple-50 transition-colors duration-300 flex items-center gap-2"
        >
          <Share2 size={20} />
          Share
        </button>
      )}
      
      {/* Modal */}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract} />
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-wider">
            Decentralized File Sharing
          </h1>
          
          <div className="inline-block px-6 py-2 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
            <p className="text-white text-sm md:text-base">
              {account ? (
                <>
                  Connected: <span className="font-mono">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
                </>
              ) : (
                "Not connected"
              )}
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <FileUpload
            account={account}
            provider={provider}
            contract={contract}
          />
          <Display 
            contract={contract} 
            account={account}
          />
        </div>
      </div>
    </div>
  );
}

export default App
