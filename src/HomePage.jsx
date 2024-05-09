import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import QrCode from "qrcode";
import jsQR from 'jsqr';


// Strong static key and IV
const key = CryptoJS.enc.Hex.parse('2b7e151628aed2a6abf7158809cf4f3c'); // 128-bit key (16 bytes)
const iv = CryptoJS.enc.Hex.parse('3ad77bb40d7a3660a89ecaf32466ef97'); // 128-bit IV (16 bytes)
console.log(key);
// Modal component to display the QR code image
const QRCodeModal = ({ qrCodeImage, onClose }) => {

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl mb-4 text-center font-semibold">QR Code</h2>
        <img src={qrCodeImage} alt='QR code'/>
        <div className="flex justify-center mt-4">
          <a href={qrCodeImage} download><button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mr-4 transition duration-300 ease-in-out"
            type='button'
          >
            Download
          </button></a>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition duration-300 ease-in-out"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const DecryptionModal = ({ decryptedText, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl mb-4 text-center font-semibold">Decrypted Text</h2>
        {decryptedText ? (
          <p className="text-center">{decryptedText}</p>
        ) : (
          <p className="text-center text-red-500">Error decrypting</p>
        )}
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mr-4 transition duration-300 ease-in-out"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


const HomePage = () => {
  const [inputValue, setInputValue] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [decryptedText,setDecryptedText] = useState('');
  const [encryptedText, setEncryptedText]=useState('');
  const [qrCodeImage, setQRCodeImage] = useState('');
  const [fileName, setFileName] = useState(''); 
  const [showDecryptionModal, setShowDecryptionModal] = useState(false);


  const generateQRCode = (text) => {
      const canvas = document.createElement('canvas');
      QrCode.toCanvas(canvas, text);
      const dataUrl = canvas.toDataURL('image/png');
      setQRCodeImage(dataUrl);
      setShowQrModal(true);
  };

  const handleGenerateQR = () => {
    if (inputValue=='') {
      alert('Please input text first.');
      return;
    }
    console.log(inputValue);
    const encrypted = CryptoJS.AES.encrypt(inputValue, key, { iv: iv }).toString();
    //setEncryptedText(encrypted);
    console.log(encrypted);
    generateQRCode(encrypted);
    setInputValue('');
  };

  const handleDecryptQR = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowQrModal(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    console.log('Uploaded file:', file);
    setUploadedFile(file);
    setFileName(file.name);
  };




  const decodeQRCode = () => {
    if (!uploadedFile) {
      alert('Please upload a file first.');
      console.error('No file uploaded.');
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
  
        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
  
        if (code) {
          // QR code decoded successfully
          const decrypted = CryptoJS.AES.decrypt(code.data, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
          setDecryptedText(decrypted);
        } else {
          setDecryptedText('');
          console.error('Failed to decode QR code.');
        }
      };
      image.src = event.target.result;
    };
    reader.readAsDataURL(uploadedFile);
  };


  

  const handleDecryptConfirm = () => {
    decodeQRCode();
    console.log(decryptedText);
    if(uploadedFile){
      setShowDecryptionModal(true);
    }
    setFileName('');
    setShowModal(false);
    setUploadedFile(null);
  };

  const handleCloseDecryptionModal = () => {
    // Close the decryption modal
    setShowDecryptionModal(false);
  };


  

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl mb-4 text-center font-semibold">QR Code Generator</h2>
        <div className="flex justify-center mb-4">
        <input
          type="text"
          className="border border-gray-300 px-4 py-2 mb-4 rounded-lg w-full focus:outline-none"
          placeholder="Enter text for QR code"
          onChange={(e)=>setInputValue(e.target.value)}
          value={inputValue}
        />
         </div>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mr-4 transition duration-300 ease-in-out"
            onClick={handleGenerateQR}
          >
            Generate QR code
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition duration-300 ease-in-out"
            onClick={handleDecryptQR}
          >
            Decrypt QR code
          </button>
        </div>
      </div>
      {/* Decryption Modal */}
      {showDecryptionModal && (
        <DecryptionModal decryptedText={decryptedText} onClose={handleCloseDecryptionModal} />
      )}

      {showQrModal && (
        <QRCodeModal qrCodeImage={qrCodeImage} onClose={handleCloseModal} />
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl mb-4 text-center font-semibold">Decrypt QR Code?</h2>
            <p className="mb-4">Are you sure you want to decrypt the QR code?</p>
            
            <div className="flex justify-center mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded mr-4 cursor-pointer transition duration-300 ease-in-out"
              >
                Upload Image
              </label>
              
            </div>
            {fileName && <p className="mt-2">Uploaded file: {fileName}</p>}

            <div className="flex justify-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded mr-4 transition duration-300 ease-in-out"
                onClick={handleDecryptConfirm}
              >
                Decrypt
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded transition duration-300 ease-in-out"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
