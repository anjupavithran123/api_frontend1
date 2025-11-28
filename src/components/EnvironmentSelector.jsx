import React, { useEffect, useState } from "react";
import { useEnvironment } from "../contexts/EnvironmentContext";

/**
 * EnvironmentSelector
 * - select env
 * - create env
 * - edit env name & variables
 * - variables are displayed in boxed rows (key + value inside a single box)
 * - no functional changes to underlying environment API
 */

export default function EnvironmentSelector() {
  const {
    envs,
    loading,
    currentEnv,
    setCurrentEnv,
    createEnv,
    updateEnv,
    deleteEnv,
    refreshEnvs,
  } = useEnvironment();

  const [editingEnv, setEditingEnv] = useState(null); // local copy { id, name, variables }
  const [newVarKey, setNewVarKey] = useState("");
  const [newVarValue, setNewVarValue] = useState("");

  useEffect(() => {
    if (currentEnv)
      setEditingEnv({ id: currentEnv.id, name: currentEnv.name, variables: { ...(currentEnv.variables || {}) } });
    else setEditingEnv(null);
  }, [currentEnv]);

  async function handleSave() {
    if (!editingEnv) return;
    try {
      await updateEnv(editingEnv.id, { name: editingEnv.name, variables: editingEnv.variables });
      await refreshEnvs();
      alert("Environment saved");
    } catch (e) {
      console.error(e);
      alert("Failed to save env");
    }
  }

  function setVar(key, value) {
    setEditingEnv((s) => ({ ...s, variables: { ...(s.variables || {}), [key]: value } }));
  }

  function removeVar(key) {
    setEditingEnv((s) => {
      const copy = { ...(s.variables || {}) };
      delete copy[key];
      return { ...s, variables: copy };
    });
  }

  async function handleCreate() {
    try {
      await createEnv({ name: "New Environment", variables: { baseUrl: "", token: "" } });
      refreshEnvs();
    } catch (e) {
      console.error(e);
      alert("Create failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete environment?")) return;
    try {
      await deleteEnv(id);
      await refreshEnvs();
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  }

  return (
    <div className="bg-white rounded shadow p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Environments</h3>
        <div className="flex gap-2">
          <button onClick={handleCreate} className="px-2 py-1 bg-blue-600 text-white rounded">+ New</button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <select
            value={currentEnv?.id || ""}
            onChange={(e) => setCurrentEnv(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          >
            <option value="">Select environment</option>
            {envs.map((env) => (
              <option key={env.id} value={env.id}>{env.name}</option>
            ))}
          </select>

          {editingEnv ? (
            <>
              <input
                className="w-full p-2 border rounded mb-2"
                value={editingEnv.name}
                onChange={(e) => setEditingEnv({ ...editingEnv, name: e.target.value })}
              />

              <div className="space-y-2 max-h-48 overflow-auto p-1">
                {/* baseUrl + token top (boxed) */}
                <div className="flex items-center gap-2 p-2 border rounded bg-gray-100 w-full min-w-0">
                  <div className="w-32 text-sm text-gray-700">baseUrl</div>
                  <div className="flex-1 min-w-0">
                    <input
                      className="w-full p-2 border rounded bg-white"
                      value={editingEnv.variables?.baseUrl || ""}
                      onChange={(e) => setVar("baseUrl", e.target.value)}
                      placeholder="https://staging.example.com"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 border rounded bg-gray-100 w-full min-w-0">
                  <div className="w-32 text-sm text-gray-700">token</div>
                  <div className="flex-1 min-w-0">
                    <input
                      className="w-full p-2 border rounded bg-white"
                      value={editingEnv.variables?.token || ""}
                      onChange={(e) => setVar("token", e.target.value)}
                      placeholder="secret-token"
                    />
                  </div>
                </div>

                {/* custom vars */}
                {Object.keys(editingEnv.variables || {})
                  .filter((k) => k !== "baseUrl" && k !== "token")
                  .map((k) => (
                    <div key={k} className="flex items-center gap-2 p-2 border rounded bg-gray-100 w-full min-w-0">
                      <input className="w-32 p-2 border rounded bg-white" value={k} readOnly />
                      <div className="flex-1 min-w-0">
                        <input
                          className="w-full p-2 border rounded bg-white"
                          value={editingEnv.variables[k] || ""}
                          onChange={(e) => setVar(k, e.target.value)}
                        />
                      </div>
                      <button className="px-2 py-1 bg-red-500 text-white rounded whitespace-nowrap" onClick={() => removeVar(k)}>Delete</button>
                    </div>
                  ))}
              </div>

              {/* add variable */}
              <div className="flex items-center gap-2 p-2 border rounded bg-gray-100 mt-3 w-full min-w-0">
                <input placeholder="key" className="w-32 p-2 border rounded bg-white" value={newVarKey} onChange={(e) => setNewVarKey(e.target.value)} />
                <div className="flex-1 min-w-0">
                  <input placeholder="value" className="w-full p-2 border rounded bg-white" value={newVarValue} onChange={(e) => setNewVarValue(e.target.value)} />
                </div>
                <button className="px-3 py-1 bg-green-600 text-white rounded whitespace-nowrap" onClick={() => {
                  if (!newVarKey) { alert("Key required"); return; }
                  setVar(newVarKey, newVarValue);
                  setNewVarKey(""); setNewVarValue("");
                }}>Add</button>
              </div>

              {/* save / delete */}
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={handleSave}>Save</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded ml-auto" onClick={() => handleDelete(editingEnv.id)}>Delete</button>
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-500">No environment selected</div>
          )}
        </>
      )}
    </div>
  );
}
