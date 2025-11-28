// src/pages/dashboard.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import EnvironmentSelector from "../components/EnvironmentSelector";
import ApiForm from "../components/ApiForm";
import JsonEditor from "../components/JsonEditor";
import EncoderDecoder from "../components/EncoderDecoder";

import { supabase } from "../lib/supabase";

export default function ApiTester() {
  const [response, setResponse] = useState(null);
  const [formState, setFormState] = useState({
    url: "",
    method: "GET",
    headersText: "",
    bodyText: "",
    params: [],
    responseData: null,
  });
    const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("response"); // new state


  
  // ------------------------------
  // DARK MODE
  // // ------------------------------
  // useEffect(() => {
  //   if (darkMode) document.documentElement.classList.add("dark");
  //   else document.documentElement.classList.remove("dark");
  // }, [darkMode]);

  // ------------------------------
  // SAVE TO HISTORY (AUTO)
  // ------------------------------
  async function saveToHistory({ url, method, headersText, bodyText, params, responseData, collectionId  }) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("history").insert([
        {
          url,
          method,
          headers: headersText || null,
          body: bodyText || null,
          params: JSON.stringify(params || []),
          response: JSON.stringify(responseData || {}),
          user_id: user.id
        }
      ]);
    } catch (err) {
      console.log("❌ Failed to save history:", err);
    }
  }

  // ------------------------------
  // AUTO-SEND WHEN CLICKING HISTORY / COLLECTION
  // ------------------------------
  function handleLoadRequest(payload, id = null) {
    const parsedPayload = {
      ...payload,
      headersText:
        typeof payload.headers === "string"
          ? payload.headers
          : JSON.stringify(payload.headers || {}, null, 2),
      bodyText:
        typeof payload.body === "string"
          ? payload.body
          : JSON.stringify(payload.body || {}, null, 2),
    };

    setFormState(parsedPayload);
    setSelectedRequestId(id);

    sendRequestAutomatically(parsedPayload);
  }

  async function sendRequestAutomatically(payload) {
    let bodyJSON = null;

    if (payload.method !== "GET" && payload.bodyText?.trim()) {
      try {
        bodyJSON = JSON.parse(payload.bodyText);
      } catch {
        return setResponse({ error: "Invalid JSON in saved request body" });
      }
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/proxy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: payload.url,
          method: payload.method,
          headers: JSON.parse(payload.headersText || "{}"),
          body: bodyJSON,
        }),
      });

      const data = await res.json();
      setResponse(data);
      setFormState(prev => ({ ...prev, responseData: data }));

      // ⭐ SAVE TO HISTORY
      await saveToHistory({
        url: payload.url,
        method: payload.method,
        headersText: payload.headersText,
        bodyText: payload.bodyText,
        params: payload.params,
        responseData: data
      });

    } catch (err) {
      setResponse({ error: err.message });
    }
  }

  // ------------------------------
  // SELECT COLLECTION
  // ------------------------------
  function handleSelectCollection(id) {
    setSelectedCollection(id);
  }

  // ------------------------------
  // LOGOUT
  // ------------------------------
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  // ------------------------------
  // MANUAL SAVE TO COLLECTION
  // ------------------------------
// ------------------------------
// MANUAL SAVE TO COLLECTION
// ------------------------------
// ------------------------------
// MANUAL SAVE TO COLLECTION
// ------------------------------
const handleAddToCollection = async () => {
  if (!selectedCollection) {
    alert("Please select a collection.");
    return;
  }

  if (!formState) {
    alert("Nothing to save.");
    return;
  }

  // ⭐ Fetch user FIRST (this was missing!)
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert("User not logged in");
    return;
  }

  const { url, method, headersText, bodyText, params, responseData } = formState;

  const { error } = await supabase.from("collection_items").insert([
    {
      collection_id: selectedCollection,
      url: url || "",
      method: method || "",
      headers: headersText || "",
      body: bodyText || "",
      params: JSON.stringify(params || []),
      response: responseData ? JSON.stringify(responseData) : null,
      user_id: user.id, // ✅ Now user is defined
    }
  ]);

  if (error) {
    console.error("SUPABASE ERROR:", error);
    alert("Failed to save!");
  } else {
    alert("Saved to collection!");
  }
};


  // ------------------------------
  // MANUAL SEND REQUEST
  // ------------------------------
  async function sendRequest({ url, method, headersText, bodyText, params }) {
    setLoading(true);
    setError(null);

    try {
      const query = params
        ?.filter((p) => p.key.trim() !== "")
        .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
        .join("&");

      const finalUrl = query ? `${url}?${query}` : url;

      let headers = {};
      let body = null;

      try { headers = headersText ? JSON.parse(headersText) : {}; } catch {}

      if (bodyText && method !== "GET") {
        try { body = JSON.parse(bodyText); }
        catch { throw new Error("Body must be valid JSON"); }
      }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/proxy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl, method, headers, body }),
      });

      const data = await res.json();

      if (!res.ok || data.error) throw new Error(data.error || `HTTP ${res.status}`);

      setResponse(data);

      // ⭐ SAVE TO HISTORY
      await saveToHistory({
        url,
        method,
        headersText,
        bodyText,
        params,
        responseData: data
      
      });

    } catch (err) {
      if (!navigator.onLine) setError("No internet connection.");
      else if (err.message.includes("CORS")) setError("CORS / network error.");
      else setError(err.message);

      setResponse(null);
    } finally {
      setLoading(false);
    }
  }

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className="h-screen flex flex-col">

      {/* HEADER */}
      <header className="w-full px-6 py-4 flex justify-between items-center shadow
        bg-gray-900 text-white dark:bg-gray-800">

        <h1 className="text-xl font-bold">API Tester</h1>

        <div className="flex gap-3">
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button> */}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white">
            Logout
          </button>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-12 flex-1">

        {/* SIDEBAR */}
        <div className="col-span-3 border-r p-4 overflow-auto space-y-4">
          <EnvironmentSelector />
          <Sidebar
            onLoadRequest={handleLoadRequest}
            onSelectCollection={handleSelectCollection}
          />
        </div>

        {/* FORM */}
        <div className="col-span-6 p-6 overflow-auto">
        <ApiForm
    initialData={formState}
    onResponse={(r) => setResponse(r)}
    onSaveHistory={saveToHistory}        // ✅ ADD THIS
    selectedCollectionId={selectedCollection}
    sendRequest={sendRequest}
    loading={loading}
  />

{selectedCollection && (
  <button
    onClick={handleAddToCollection}
    className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
    Add to Collection
  </button>
)}


          {loading && <div className="mt-3 text-blue-600">Loading...</div>}
          {error && <div className="mt-3 text-red-600">{error}</div>}
        </div>

        {/* RESPONSE */}
         {/* RESPONSE / ENCODE PANEL */}
   {/* RESPONSE / ENCODE PANEL */}
<div className="col-span-3 p-4 space-y-4 overflow-auto bg-gray-50 dark:bg-gray-900">
  {/* Header Tabs */}
  <div className="flex border-b border-gray-300 dark:border-gray-700 mb-3 text-white">
    <button
      className={`px-4 py-2 font-semibold ${activeTab === "response" ? "border-b-2 border-blue-600" : ""}`}
      onClick={() => setActiveTab("response")}
    >
      Response
    </button>
    <button
      className={`px-4 py-2 font-semibold ${activeTab === "encoder" ? "border-b-2 border-blue-600" : ""}`}
      onClick={() => setActiveTab("encoder")}
    >
      Encode / Decoder
    </button>
  </div>

  {/* Panel Content */}
  {activeTab === "response" && (
    <div>
      <JsonEditor
        value={response ? JSON.stringify(response, null, 2) : ""}
        readOnly
        height="500px"
      />
    </div>
  )}

  {activeTab === "encoder" && <EncoderDecoder />}
</div>
</div>
</div>
  );
}
