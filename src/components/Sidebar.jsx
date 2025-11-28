import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Sidebar({ onLoadRequest, onSelectCollection }) {
  const [history, setHistory] = useState([]);
  const [collections, setCollections] = useState([]);
  const [collectionItems, setCollectionItems] = useState({});
  const [expandedHistory, setExpandedHistory] = useState(false);
  const [expandedCollections, setExpandedCollections] = useState({});
  const [newCollectionName, setNewCollectionName] = useState("");
  const [user, setUser] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // NEW: context menu
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    type: null,
    item: null,
    parentCollection: null,
  });

  function openContextMenu(e, type, item, parentCollection = null) {
    e.preventDefault();
    setContextMenu({
      show: true,
      x: e.pageX,
      y: e.pageY,
      type,
      item,
      parentCollection,
    });
  }

  function closeContextMenu() {
    setContextMenu({ show: false, x: 0, y: 0, type: null, item: null });
  }

  useEffect(() => {
    window.addEventListener("click", closeContextMenu);
    return () => window.removeEventListener("click", closeContextMenu);
  }, []);

  // Fetch user
  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user || null);
    }
    fetchUser();
  }, []);

  // Load history
  useEffect(() => {
    async function loadHistory() {
      const { data, error } = await supabase
        .from("history")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setHistory(data || []);
    }
    loadHistory();
  }, []);

  // Load collections
  useEffect(() => {
    async function loadCollections() {
      if (!user) return;
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (!error) setCollections(data || []);
    }
    loadCollections();
  }, [user]);

  // ADD NEW COLLECTION
  async function addCollection() {
    if (!newCollectionName.trim() || !user) return;
    const { data, error } = await supabase
      .from("collections")
      .insert([{ name: newCollectionName, user_id: user.id }]);

    if (!error) setCollections([...collections, data[0]]);
    setNewCollectionName("");
  }

  // --- DELETE FUNCTIONS -----
  async function deleteHistoryItem(id) {
    await supabase.from("history").delete().eq("id", id);
    setHistory(history.filter((h) => h.id !== id));
  }

  async function deleteCollection(id) {
    await supabase.from("collections").delete().eq("id", id);
    setCollections(collections.filter((c) => c.id !== id));
    delete collectionItems[id];
  }

  async function deleteCollectionItem(id, parentCollection) {
    await supabase.from("collection_items").delete().eq("id", id);

    setCollectionItems((prev) => ({
      ...prev,
      [parentCollection]: prev[parentCollection].filter((i) => i.id !== id),
    }));
  }

  // Load history item
  function loadHistoryItem(item) {
    setSelectedItemId(item.id);
    onLoadRequest(
      {
        url: item.url,
        method: item.method,
        headersText: item.headers || "",
        bodyText: item.body ? JSON.stringify(item.body, null, 2) : "",
        params: item.params ? JSON.parse(item.params) : [{ key: "", value: "" }],
        response: item.response || null,
      },
      item.id
    );
  }

  // Select collection
  async function selectCollection(collectionId) {
    if (!user) return;

    setExpandedCollections((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }));

    onSelectCollection(collectionId);

    if (!collectionItems[collectionId]) {
      const { data } = await supabase
        .from("collection_items")
        .select("*")
        .eq("collection_id", collectionId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      setCollectionItems((prev) => ({ ...prev, [collectionId]: data || [] }));
    }
  }

  // Load collection item
  function loadCollectionItem(item) {
    setSelectedItemId(item.id);
    onLoadRequest(
      {
        url: item.url,
        method: item.method,
        headersText: item.headers || "",
        bodyText: item.body ? JSON.stringify(item.body, null, 2) : "",
        params: item.params ? JSON.parse(item.params) : [{ key: "", value: "" }],
        response: item.response || null,
      },
      item.id
    );
  }

  return (
    <div className="h-full p-4 bg-gray-900 text-white overflow-auto">

      {/* HISTORY */}
      <h2
        className="text-lg font-bold mb-2 cursor-pointer"
        onClick={() => setExpandedHistory(!expandedHistory)}
      >
        History {expandedHistory ? "▲" : "▼"}
      </h2>

      {expandedHistory && (
        <div className="space-y-2 mb-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => loadHistoryItem(item)}
              onContextMenu={(e) => openContextMenu(e, "history", item)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-700 ${
                selectedItemId === item.id ? "bg-gray-600" : "bg-gray-800"
              }`}
            >
              <p className="font-semibold">{item.method}</p>
              <p className="text-xs break-all">{item.url}</p>
            </div>
          ))}
        </div>
      )}

      {/* COLLECTIONS */}
      <h2 className="text-lg font-bold mt-4 mb-2">Collections</h2>

      <div className="space-y-2 mb-4">

        {/* Add collection */}
        <div className="mt-2">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="New collection"
            className="w-full p-1 rounded text-black bg-gray-200"
          />
          <button
            onClick={addCollection}
            className="mt-2 w-full px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Add Collection
          </button>
        </div>

        {/* Render collections */}
        {collections.map((col) => (
          <div key={col.id}>
            <div
              onClick={() => selectCollection(col.id)}
              onContextMenu={(e) => openContextMenu(e, "collection", col)}
              className={`p-2 rounded cursor-pointer hover:bg-gray-700 ${
                expandedCollections[col.id] ? "bg-gray-600" : "bg-gray-800"
              }`}
            >
              {col.name} {expandedCollections[col.id] ? "▲" : "▼"}
            </div>

            {/* Collection items */}
            {expandedCollections[col.id] && collectionItems[col.id]?.length > 0 && (
              <div className="ml-4 mt-1 space-y-1">
                {collectionItems[col.id].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadCollectionItem(item)}
                    onContextMenu={(e) =>
                      openContextMenu(e, "collectionItem", item, col.id)
                    }
                    className={`p-1 rounded cursor-pointer hover:bg-gray-600 text-sm break-all ${
                      selectedItemId === item.id ? "bg-gray-600" : "bg-gray-700"
                    }`}
                  >
                    {item.url}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* RIGHT CLICK MENU */}
      {contextMenu.show && (
  <div
    className="absolute z-50 w-48 rounded-xl shadow-2xl border border-gray-200 
               bg-white dark:bg-gray-800 dark:border-gray-700 animate-fadeIn"
    style={{ top: contextMenu.y, left: contextMenu.x }}
  >
    <button
      onClick={() => {
        if (contextMenu.type === "history")
          deleteHistoryItem(contextMenu.item.id);

        if (contextMenu.type === "collection")
          deleteCollection(contextMenu.item.id);

        if (contextMenu.type === "collectionItem")
          deleteCollectionItem(contextMenu.item.id, contextMenu.parentCollection);

        closeContextMenu();
      }}
      className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-600 
                 hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-700
                 rounded-xl transition-all duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a2 2 0 01-2-2V4
             a2 2 0 00-2-2h-2a2 2 0 00-2 2v1a2 2 0 01-2 2h10z"
        />
      </svg>

      <span className="font-medium">Delete</span>
    </button>
  </div>
)}

    </div>
  );
}
