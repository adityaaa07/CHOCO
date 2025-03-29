import React from "react";
import { QRCodeCanvas } from "qrcode.react"; // Correct import

interface QRCodeComponentProps {
  speakerId: string;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ speakerId }) => {
  const qrCodeValue = `http://localhost:5173/join/${speakerId}`;

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Scan to Connect to the Speaker</h2>
      <QRCodeCanvas value={qrCodeValue} size={256} />
    </div>
  );
};

export default QRCodeComponent;
