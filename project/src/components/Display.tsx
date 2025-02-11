import { useState } from "react";
import { Search } from "lucide-react";

interface DisplayProps {
  contract: any;
  account: string;
}

const Display = ({ contract, account }: DisplayProps) => {
  const [data, setData] = useState<JSX.Element[]>([]);

  const getdata = async () => {
    const addressInput = document.querySelector<HTMLInputElement>(".address");
    if (!addressInput) return;
    
    let dataArray;
    try {
      if (addressInput.value) {
        dataArray = await contract.display(addressInput.value);
      } else {
        dataArray = await contract.display(account);
      }
      
      const isEmpty = Object.keys(dataArray).length === 0;
      
      if (!isEmpty) {
        const str = dataArray.toString();
        const str_array = str.split(",");
        const images = str_array.map((item: string, i: number) => (
          <a 
            href={item} 
            key={i} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              src={item} 
              alt={`Shared file ${i + 1}`}
              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
            />
          </a>
        ));
        setData(images);
      } else {
        alert("No images to display");
      }
    } catch (e) {
      alert("You don't have access");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter Address"
            className="address w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
        <button
          onClick={getdata}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
        >
          Get Data
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data}
      </div>
    </div>
  );
};

export default Display