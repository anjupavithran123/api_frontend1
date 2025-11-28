import axios from "axios";
const BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

async function authHeaders() {
  // get access token
  const { data: sessionData } = await (await import("../supabaseClient")).supabase.auth.getSession();
  const token = sessionData?.session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function proxyRequest(payload) {
  const headers = await authHeaders();
  return axios.post(`${BASE}/proxy`, payload, { headers });
}

export async function saveHistory(payload) {
  const headers = await authHeaders();
  return axios.post(`${BASE}/history`, payload, { headers });
}

export async function fetchHistory() {
  const headers = await authHeaders();
  return axios.get(`${BASE}/history`, { headers });
}

export async function createCollection(payload) {
  const headers = await authHeaders();
  return axios.post(`${BASE}/collections`, payload, { headers });
}

export async function listCollections() {
  const headers = await authHeaders();
  return axios.get(`${BASE}/collections`, { headers });
}

export async function addCollectionItem(collectionId, payload) {
  const headers = await authHeaders();
  return axios.post(`${BASE}/collections/${collectionId}/items`, payload, { headers });
}

export async function getCollectionItems(collectionId) {
  const headers = await authHeaders();
  return axios.get(`${BASE}/collections/${collectionId}/items`, { headers });
}
