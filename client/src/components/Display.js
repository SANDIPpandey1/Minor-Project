import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  // State to store retrieved image data
  const [data, setData] = useState("");

  // Function to fetch images from the blockchain
  const getdata = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value; // Get inputted address

    try {
      if (Otheraddress) {
        // Fetch data for the provided address
        dataArray = await contract.display(Otheraddress);
      } else {
        // Fetch data for the connected user's account
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access"); // Handle access error
      return;
    }

    // Check if dataArray is empty
    const isEmpty = Object.keys(dataArray).length === 0;

    if (!isEmpty) {
      const str = dataArray.toString(); // Convert to string
      const str_array = str.split(","); // Split into array

      // Map each item to an image element
      const images = str_array.map((item, i) => {
        return (
          <a href={item} key={i} target="_blank" rel="noopener noreferrer">
            <img key={i} src={item} alt="new" className="image-list"></img>
          </a>
        );
      });

      setData(images); // Update state with images
    } else {
      alert("No image to display"); // Handle empty case
    }
  };

  return (
    <>
      {/* Input field for entering an Ethereum address */}
      <input type="text" placeholder="Enter Address" className="address"></input>

      {/* Button to fetch data */}
      <button className="center button" onClick={getdata}>
        Get Data
      </button>

      {/* Display fetched images */}
      <div className="image-list">{data}</div>
    </>
  );
};

export default Display;
