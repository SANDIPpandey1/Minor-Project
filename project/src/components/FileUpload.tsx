import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Upload as UploadIcon, File } from "lucide-react";

interface FileUploadProps {
  contract: any;
  account: string;
  provider: any;
}

const FileUpload = ({ contract, account }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("No file selected");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const resFile = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        headers: {
          pinata_api_key: `904a778c4b7ab3fb528f`,
          pinata_secret_api_key: `b035a812cc43aa00d1c11981c0c1316f63f1e667a694a28409c94d973af38e04`,
          "Content-Type": "multipart/form-data",
        },
      });

      const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
      await contract.add(account, ImgHash);
      alert("File uploaded successfully!");
      setFileName("No file selected");
      setFile(null);
    } catch (e) {
      alert("Unable to upload file to Pinata");
    } finally {
      setUploading(false);
    }
  };

  const retrieveFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const data = e.target.files?.[0];
    if (!data) return;

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
    };
    setFileName(data.name);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer
              ${!account ? 'bg-gray-100 border-gray-300' : 'hover:bg-purple-50 border-purple-300'}
              transition-colors duration-300`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadIcon 
                className={`w-12 h-12 mb-3 ${!account ? 'text-gray-400' : 'text-purple-500'}`} 
              />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Any file type (MAX. 10MB)</p>
            </div>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={retrieveFile}
              disabled={!account}
            />
          </label>
        </div>

        {fileName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <File size={16} />
            <span className="truncate">{fileName}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!file || uploading || !account}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium
            ${!file || uploading || !account
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'} 
            transition-colors duration-300`}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>
    </div>
  );
};

export default FileUpload