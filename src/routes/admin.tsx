import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "ZOVA Admin — Orders & Messages" },
      { name: "description", content: "ZOVA admin dashboard for orders, messages and newsletter subscribers." },
      { property: "og:title", content: "ZOVA Admin" },
      { property: "og:description", content: "Private ZOVA admin dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Row = { id: string; created_at: string; name?: string; phone?: string; address?: string; items?: { name: string; qty: number }[]; total?: number; email?: string; message?: string };

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => data.subscription.unsubscribe();
  }, []);
  if (!ready) return null;
  return <div className="min-h-screen px-6 py-12">{session ? <Dashboard session={session} /> : <Login />}</div>;
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email")).trim();
    const password = String(fd.get("password"));
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setBusy(true);
    const { error, data } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (mode === "up" && !data.session) toast.success("Check your email to confirm your account.");
  };
  return (
    <form onSubmit={submit} className="glass gradient-border mx-auto mt-20 max-w-sm space-y-4 rounded-3xl p-8">
      <h1 className="text-neon text-3xl font-black">ZOVA Admin</h1>
      <p className="text-sm text-muted-foreground">{mode === "in" ? "Sign in to view orders and messages." : "The first account created becomes the admin."}</p>
      <input name="email" type="email" required placeholder="Email" className="glass w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      <input name="password" type="password" required placeholder="Password" className="glass w-full rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-ring" />
      <button disabled={busy} className="bg-neon w-full rounded-full py-3 font-semibold text-primary-foreground">{busy ? "…" : mode === "in" ? "Sign in" : "Create account"}</button>
      <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-sm text-muted-foreground hover:text-foreground">
        {mode === "in" ? "No account? Create one" : "Have an account? Sign in"}
      </button>
      <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">← Back to site</Link>
    </form>
  );
}

function Dashboard({ session }: { session: Session }) {
  const [tab, setTab] = useState<"orders" | "contact_messages" | "newsletter_subscribers">("orders");
  const [rows, setRows] = useState<Row[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }).then(({ data }) => setIsAdmin(!!data));
  }, [session.user.id]);

  useEffect(() => {
    if (!isAdmin) return;
    supabase.from(tab).select("*").order("created_at", { ascending: false }).then(({ data, error }) => {
      if (error) toast.error(error.message);
      setRows((data as unknown as Row[]) ?? []);
    });
  }, [tab, isAdmin]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-neon text-3xl font-black">ZOVA Dashboard</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {session.user.email}
          <button onClick={() => supabase.auth.signOut()} className="glass rounded-full px-4 py-2 text-foreground">Sign out</button>
        </div>
      </div>
      {isAdmin === false ? (
        <p className="glass rounded-3xl p-8 text-muted-foreground">This account doesn't have admin access.</p>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {([["orders", "Orders"], ["contact_messages", "Messages"], ["newsletter_subscribers", "Subscribers"]] as const).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={tab === k ? "bg-neon rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground" : "glass rounded-full px-5 py-2 text-sm"}>{l}</button>
            ))}
          </div>
          <div className="space-y-3">
            {rows.length === 0 && <p className="text-muted-foreground">Nothing here yet.</p>}
            {rows.map((r) => (
              <article key={r.id} className="glass rounded-2xl p-5">
                <p className="mb-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                {tab === "orders" ? (
                  <div className="grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
                    <div><p className="font-semibold">{String(r.name)}</p><p className="text-sm text-muted-foreground">{String(r.phone)}</p><p className="text-sm text-muted-foreground">{String(r.address)}</p></div>
                    <ul className="text-sm">{(r.items ?? []).map((i, n) => <li key={n}>{i.qty} × {i.name}</li>)}</ul>
                    <p className="font-display text-xl font-bold">${Number(r.total).toFixed(2)}</p>
                  </div>
                ) : tab === "contact_messages" ? (
                  <div><p className="font-semibold">{String(r.name)} <span className="font-normal text-muted-foreground">· {String(r.email)}</span></p><p className="mt-2 whitespace-pre-wrap text-sm">{String(r.message)}</p></div>
                ) : (
                  <p className="font-semibold">{String(r.email)}</p>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
