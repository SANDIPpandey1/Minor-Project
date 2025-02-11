import { useEffect, useRef } from "react";
import { X, Share2, Users } from "lucide-react";

interface ModalProps {
  setModalOpen: (open: boolean) => void;
  contract: any;
}

const Modal = ({ setModalOpen, contract }: ModalProps) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const sharing = async () => {
    const addressInput = document.querySelector<HTMLInputElement>(".modal-address");
    if (!addressInput?.value) return;
    
    try {
      await contract.allow(addressInput.value);
      setModalOpen(false);
    } catch (error) {
      alert("Error sharing access. Please try again.");
    }
  };

  useEffect(() => {
    const accessList = async () => {
      if (!contract || !selectRef.current) return;

      try {
        const addressList = await contract.shareAccess();
        
        // Clear existing options except the first one
        while (selectRef.current.options.length > 1) {
          selectRef.current.remove(1);
        }

        // Add new options
        addressList.forEach((address: string) => {
          const option = document.createElement("option");
          option.value = address;
          option.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
          selectRef.current?.appendChild(option);
        });
      } catch (error) {
        console.error("Error fetching access list:", error);
      }
    };

    contract && accessList();
  }, [contract]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Share2 className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold">Share Access</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Share with address
              </label>
              <input
                type="text"
                className="modal-address w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                placeholder="Enter Ethereum address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Users size={16} />
                People with access
              </label>
              <select
                ref={selectRef}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="">Select an address</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={sharing}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal