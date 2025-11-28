import React, { useState } from "react";

export default function EncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // ----------------- Encoding / Decoding Methods -----------------

  const urlEncode = () => setOutput(encodeURIComponent(input));
  const urlDecode = () => setOutput(decodeURIComponent(input));

  const base64Encode = () => setOutput(btoa(input));
  const base64Decode = () => {
    try {
      setOutput(atob(input));
    } catch (e) {
      setOutput("❌ Invalid Base64");
    }
  };

  const hexEncode = () =>
    setOutput(
      input
        .split("")
        .map((c) => c.charCodeAt(0).toString(16))
        .join(" ")
    );

  const hexDecode = () => {
    try {
      setOutput(
        input
          .split(" ")
          .map((h) => String.fromCharCode(parseInt(h, 16)))
          .join("")
      );
    } catch {
      setOutput("❌ Invalid hex");
    }
  };

  const htmlEncode = () =>
    setOutput(
      input.replace(/[\u00A0-\u9999<>&]/g, (c) =>
        `&#${c.charCodeAt(0)};`
      )
    );

  const htmlDecode = () => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = input;
    setOutput(textarea.value);
  };

  const prettyJSON = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
    } catch {
      setOutput("❌ Invalid JSON");
    }
  };

  // ----------------- UI -----------------

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow xl:min-h-[400px]">
<h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
   Decoder / Encoder
</h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text here..."
        className="w-full h-32 p-3 rounded bg-white dark:bg-gray-900 dark:text-white border"
      />

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <button className="btn" onClick={urlEncode}>URL Encode</button>
        <button className="btn" onClick={urlDecode}>URL Decode</button>

        <button className="btn" onClick={base64Encode}>Base64 Encode</button>
        <button className="btn" onClick={base64Decode}>Base64 Decode</button>

        <button className="btn" onClick={hexEncode}>Hex Encode</button>
        <button className="btn" onClick={hexDecode}>Hex Decode</button>

        <button className="btn" onClick={htmlEncode}>HTML Encode</button>
        <button className="btn" onClick={htmlDecode}>HTML Decode</button>

        <button className="btn col-span-2 bg-green-600 hover:bg-green-700" onClick={prettyJSON}>
          Pretty JSON
        </button>
      </div>

      <textarea
        value={output}
        readOnly
        placeholder="Output appears here..."
        className="w-full h-32 p-3 mt-1 rounded bg-gray-50 dark:bg-gray-900 dark:text-white border"
      />
    </div>
  );
}
