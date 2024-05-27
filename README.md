# QR-CRYPTO

QR-Crypto is a React app for encrypting text using AES and generating QR codes for the ciphertext. It also allows decryption by uploading the QR code.

[Live Site](https://qr-crypto.web.app/)

![image](https://github.com/Madhav005/QR-crypt/assets/110885274/f7cefcea-a1a4-47ef-8378-c8639f535b70)

## Features
AES Encryption: Encrypt text securely.
QR Code Generation: Generate QR codes for ciphertext.
QR Code Scanning: Decrypt by scanning the QR code.

## Installation

### Clone the repository:

```
git clone https://github.com/your-username/qr-crypto.git
cd qr-crypto
```

## Install dependencies:

```
npm install
```

## Start the development server:
```
npm start
```

Open http://localhost:3000.

## Usage

Encrypt Text: Input text, click "Encrypt and Generate QR Code".

Decrypt Text: Upload QR code, view decrypted text.

## Technologies

React

JavaScript (AES encryption via crypto-js)

QR code generation (qrcode.react)

QR code scanning (react-qr-reader)
