import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";

function App() {
  const [pdfCount, setPdfCount] = useState(1);
  const [includeLetters, setIncludeLetters] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [status, setStatus] = useState("");

  const generateRandomString = (length) => {
    let characters = "";
    if (includeLetters) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) characters += "0123456789";

    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const createPdfWithRandomString = async () => {
    try {
      setStatus(`Generating ${pdfCount} PDF(s)...`);

      for (let i = 1; i <= pdfCount; i++) {
        const randomString = generateRandomString(7);

        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();

        page.drawText(randomString, {
          x: 50,
          y: height - 100,
          size: 12,
          color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();

        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `random_string_${i}.pdf`;
        link.click();
        URL.revokeObjectURL(url);

        setStatus(`PDF file ${i} generated`);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setStatus("Error generating PDFs");
    }
  };

  return (
    <div className="App">
      <h1>Generate PDFs</h1>
      <label htmlFor="pdfCountInput">Number of PDFs:</label>
      <input
        type="number"
        id="pdfCountInput"
        min="1"
        step="1"
        value={pdfCount}
        onChange={(e) => setPdfCount(parseInt(e.target.value, 10))}
      />
      <div>
        <input
          className="input_1"
          type="checkbox"
          id="lettersCheckbox"
          checked={includeLetters}
          onChange={(e) => setIncludeLetters(e.target.checked)}
        />
        <label htmlFor="lettersCheckbox">Include Letters</label>
      </div>
      <div>
        <input
          type="checkbox"
          id="numbersCheckbox"
          checked={includeNumbers}
          onChange={(e) => setIncludeNumbers(e.target.checked)}
        />
        <label htmlFor="numbersCheckbox">Include Numbers</label>
      </div>
      <button onClick={createPdfWithRandomString}>Generate PDFs</button>
      <div id="pdfGenerationStatus">{status}</div>
    </div>
  );
}

export default App;
