// src/components/ApiForm.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { FiSave, FiSend } from "react-icons/fi";
import JsonEditor from "../components/JsonEditor"; // JSON editor
import { useEnvironment } from "../contexts/EnvironmentContext";
import { replaceEnvVars } from "../utils/resolveEnvVars";

// Props:
// - initialData
// - onResponse (function)
// - selectedCollectionId (optional)
// - onSaveHistory (optional callback parent can pass to refresh lists)
export default function ApiForm({
  initialData,
  onResponse,
  selectedCollectionId,
  onAddToCollection,
  onSaveHistory,
}) {
  const { currentEnv } = useEnvironment();

  const [url, setUrl] = useState(initialData?.url || "{{baseUrl}}/users/{{userId}}");
  const [method, setMethod] = useState(initialData?.method || "GET");
  const [params, setParams] = useState(initialData?.params || [{ key: "", value: "" }]);
  const [headersText, setHeadersText] = useState(initialData?.headersText || "");
  const [bodyText, setBodyText] = useState(initialData?.bodyText || '{"name":"{{userName}}"}');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync form when initialData changes
  useEffect(() => {
    if (!initialData) return;
    setUrl(initialData.url || "{{baseUrl}}/users/{{userId}}");
    setMethod(initialData.method || "GET");
    setParams(initialData.params || [{ key: "", value: "" }]);
    setHeadersText(initialData.headersText || "");
    setBodyText(initialData.bodyText || '{"name":"{{userName}}"}');
  }, [initialData]);

  function addParam() {
    setParams((p) => [...p, { key: "", value: "" }]);
  }

  function updateParam(index, field, value) {
    setParams((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function buildFinalUrl() {
    // Replace env variables in URL first
    let finalUrl = replaceEnvVars(url, currentEnv?.variables);

    const query = params
      .filter((p) => p.key?.trim() !== "")
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join("&");

    return query ? `${finalUrl}${finalUrl.includes("?") ? "&" : "?"}${query}` : finalUrl;
  }

  // -------------------------------------------------------------------
  // Save function
  // -------------------------------------------------------------------
  async function saveHistory(finalUrl, responseData = null) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.warn("Not logged in — skipping history save.");
        return;
      }

      let bodyJSON = null;
      if (bodyText?.trim()) {
        try {
          bodyJSON = JSON.parse(replaceEnvVars(bodyText, currentEnv?.variables));
        } catch {
          bodyJSON = null;
        }
      }

      const baseInsert = {
        user_id: user.id,
        url: finalUrl,
        method,
        headers: headersText || null,
        body: bodyJSON,
        params: JSON.stringify(params || []),
        response: responseData ? JSON.stringify(responseData) : null,
      };

      const { error: historyErr } = await supabase.from("history").insert(baseInsert);
      if (historyErr) console.error("History insert error:", historyErr);

      if (selectedCollectionId) {
        const colInsert = { ...baseInsert, collection_id: selectedCollectionId };
        const { error: colErr } = await supabase.from("collection_items").insert(colInsert);
        if (colErr) console.error("Collection insert error:", colErr);
      }

      if (typeof onSaveHistory === "function") {
        try {
          await onSaveHistory();
        } catch (e) {
          console.warn("onSaveHistory callback error:", e);
        }
      }
    } catch (err) {
      console.error("saveHistory exception:", err);
    }
  }

  async function saveRequest() {
    if (!onSaveHistory) return;

    await onSaveHistory({
      url,
      method,
      params,
      headers: headersText,
      body: bodyText,
    });

    alert("Saved to History!");
  }

  // -------------------------------------------------------------------
  // sendRequest
  // -------------------------------------------------------------------
  async function sendRequest() {
    setLoading(true);
    setError(null);

    const finalUrl = buildFinalUrl();

    let parsedHeaders = {};
    if (headersText?.trim()) {
      try {
        parsedHeaders = JSON.parse(replaceEnvVars(headersText, currentEnv?.variables));
      } catch {
        parsedHeaders = {};
        headersText.split("\n").forEach((line) => {
          const idx = line.indexOf(":");
          if (idx > -1) {
            const k = line.slice(0, idx).trim();
            const v = replaceEnvVars(line.slice(idx + 1).trim(), currentEnv?.variables);
            if (k) parsedHeaders[k] = v;
          }
        });
      }
    }

    let bodyObj = null;
    if (method !== "GET" && bodyText?.trim()) {
      try {
        bodyObj = JSON.parse(replaceEnvVars(bodyText, currentEnv?.variables));
      } catch {
        setLoading(false);
        setError("Body must be valid JSON.");
        return;
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/proxy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: finalUrl,
          method,
          headers: parsedHeaders,
          body: bodyObj,
        }),
      });

      const data = await res.json().catch(async () => {
        const text = await res.text();
        return { text };
      });

      if (!res.ok || data?.error) {
        const msg = data?.error || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      if (typeof onResponse === "function") onResponse(data);

      await saveHistory(finalUrl, data);
    } catch (err) {
      if (!navigator.onLine) {
        setError("No internet connection. Please check your network.");
      } else if (err.message && err.message.toLowerCase().includes("cors")) {
        setError("CORS or network error — check API or proxy.");
      } else {
        setError(err.message || "Request failed.");
      }

      if (typeof onResponse === "function") onResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative space-y-6">
      <button
        onClick={saveRequest}
        className="absolute top-0 right-0 m-4 p-2 bg-gray-700 hover:bg-green-700 rounded text-white"
        title="Save Request"
      >
        <FiSave size={15} />
      </button>

      <h1 className="text-2xl font-bold text-center mb-4">API Request</h1>

      {/* URL + SEND BUTTON IN ROW */}
      <div className="flex items-end gap-2">
        <select
          className="border p-2 rounded mt-1 text-black"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>

        <div className="flex-1">
          <input
            type="text"
            placeholder="https://api.example.com/users"
            className="w-full border p-2 rounded mt-1 text-black"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <button
          onClick={sendRequest}
          disabled={loading}
          className="h-[42px] px-4 bg-blue-600 text-white rounded mt-6 flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
        >
          <FiSend size={18} />
          Send
        </button>
      </div>

      {loading && (
        <div className="flex items-center mt-2">
          <svg
            className="animate-spin h-5 w-5 mr-2 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span>Loading...</span>
        </div>
      )}

      {/* Params */}
      <div>
        <label className="font-semibold">Params</label>
        <div className="space-y-2 mt-2">
          {params.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="key"
                value={p.key}
                className="border p-2 rounded w-1/2 text-black"
                onChange={(e) => updateParam(i, "key", e.target.value)}
              />
              <input
                placeholder="value"
                value={p.value}
                className="border p-2 rounded w-1/2 text-black"
                onChange={(e) => updateParam(i, "value", e.target.value)}
              />
            </div>
          ))}
        </div>
        <button
          className="mt-2 px-3 py-1 bg-gray-800 text-white rounded"
          onClick={addParam}
          type="button"
        >
          + Add Param
        </button>
      </div>

      {/* Headers */}
      <div>
        <label className="font-semibold">Headers</label>
        <textarea
          placeholder='{"Authorization":"Bearer ..."} or "Key: Value" per line'
          className="w-full border p-2 rounded h-24 mt-1 text-black"
          value={headersText}
          onChange={(e) => setHeadersText(e.target.value)}
        />
      </div>

      {/* Body */}
      {method !== "GET" && (
        <div>
          <label className="font-semibold">Body (JSON)</label>
          <JsonEditor
            value={bodyText}
            onChange={setBodyText}
            readOnly={false}
            height="200px"
          />
        </div>
      )}

      {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
    </div>
  );
}
