import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Environment shape:
 * {
 *   id: string,
 *   name: string,
 *   variables: { [key]: value },
 *   meta?: {}
 * }
 */

const STORAGE_KEY = "app.environments.v1";
const CURR_KEY = "app.currentEnvId.v1";

const EnvironmentContext = createContext(null);

export function EnvironmentProvider({ children }) {
  const [envs, setEnvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentEnvId, setCurrentEnvId] = useState(null);

  // load from localStorage (or seed defaults)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let parsed = raw ? JSON.parse(raw) : null;

      if (!parsed || !Array.isArray(parsed) || parsed.length === 0) {
        // seed defaults
        parsed = [
          { id: "dev", name: "Development", variables: { baseUrl: "dev.api.example.com", token: "dev-token" } },
          { id: "staging", name: "Staging", variables: { baseUrl: "staging.api.example.com", token: "staging-token" } },
          { id: "prod", name: "Production", variables: { baseUrl: "api.example.com", token: "" } },
        ];
      }

      setEnvs(parsed);

      const cid = localStorage.getItem(CURR_KEY) || parsed[0]?.id;
      setCurrentEnvId(cid);
    } catch (e) {
      console.error("Failed to load envs", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // persist helper
  function persist(newEnvs) {
    setEnvs(newEnvs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEnvs));
  }

  function refreshEnvs() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setEnvs(JSON.parse(raw));
  }

  async function createEnv(env) {
    // env: { name, variables }
    const id = (env.name || "env").toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).slice(2, 8);
    const next = [{ id, name: env.name || "New Environment", variables: env.variables || {} }, ...envs];
    persist(next);
    // set current to new one
    setCurrentEnvId(id);
    localStorage.setItem(CURR_KEY, id);
    return id;
  }

  async function updateEnv(id, patch) {
    const next = envs.map((e) => (e.id === id ? { ...e, ...patch } : e));
    persist(next);
  }

  async function deleteEnv(id) {
    const next = envs.filter((e) => e.id !== id);
    persist(next);
    if (currentEnvId === id) {
      const newId = next[0]?.id || null;
      setCurrentEnvId(newId);
      if (newId) localStorage.setItem(CURR_KEY, newId);
      else localStorage.removeItem(CURR_KEY);
    }
  }

  function setCurrentEnv(id) {
    setCurrentEnvId(id);
    if (id) localStorage.setItem(CURR_KEY, id);
  }

  const currentEnv = envs.find((e) => e.id === currentEnvId) || null;

  return (
    <EnvironmentContext.Provider
      value={{
        envs,
        loading,
        currentEnv,
        currentEnvId,
        createEnv,
        updateEnv,
        deleteEnv,
        refreshEnvs,
        setCurrentEnv,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const ctx = useContext(EnvironmentContext);
  if (!ctx) throw new Error("useEnvironment must be used inside EnvironmentProvider");
  return ctx;
}
