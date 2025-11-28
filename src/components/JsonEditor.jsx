import React from "react";
import AceEditor from "react-ace";

// JSON mode + theme
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

// Autocomplete
import "ace-builds/src-noconflict/ext-language_tools";

// IMPORTANT: load ace itself before workers
import ace from "ace-builds/src-noconflict/ace";

// Import worker (required for Vite)
import "ace-builds/src-noconflict/worker-json";

// Tell Ace where the worker file is located
ace.config.setModuleUrl("ace/mode/json_worker", "/worker-json.js");

export default function JsonEditor({
  value,
  onChange,
  readOnly = false,
  height = "400px",
}) {
  return (
    <AceEditor
      mode="json"
      theme="github"
      name="json_editor"
      value={value}
      onChange={onChange}
      fontSize={14}
      width="100%"
      height={height}
      showPrintMargin={false}
      showGutter
      highlightActiveLine
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
        useWorker: true, // JSON validation
        foldStyle: "markbegin",
      }}
      readOnly={readOnly}
    />
  );
}
