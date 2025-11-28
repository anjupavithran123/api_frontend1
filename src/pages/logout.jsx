import { supabase } from "../lib/supabase";

export default function LogoutButton() {
  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return <button onClick={logout}>Logout</button>;
}
