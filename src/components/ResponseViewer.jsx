import React from "react";
import JsonEditor from "./JsonEditor"; // adjust path if needed

export default function ResponseViewer({ response }) {
  return (
    <div>
      <h3 className="font-bold mb-2">Response</h3>
      {response ? (
        <JsonEditor
          value={JSON.stringify(response, null, 2)} // pass JSON as string
          readOnly={true} // read-only for response viewing
          height="500px"
        />
      ) : (
        <p className="text-sm text-gray-500">No response yet...</p>
      )}
    </div>
  );
}
