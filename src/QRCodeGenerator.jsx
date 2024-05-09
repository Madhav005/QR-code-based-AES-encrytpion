import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeGenerator = () => {
  return (
    <div>
      <QRCode value={"Hello"} />
    </div>
  );
};

export default QRCodeGenerator;


