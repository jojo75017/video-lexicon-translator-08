import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, RefreshCw, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Row {
  id: string;
  email: string;
  author_name: string;
  book_title: string | null;
  comment: string;
  rating: number | null;
  photo_url: string | null;
  approved: boolean;
  consent_publication: boolean;
  created_at: string;
}

type Filter = "pending" | "approved" | "all";

/** Modération des témoignages acheteurs : validation, retrait, suppression. */
export default function AdminTemoignagesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    // L'email des clients n'est plus lisible publiquement : il passe par une
    // fonction réservée aux administrateurs.
    const { data, error } = await (supabase as unknown as {
      rpc: (fn: string) => Promise<{ data: unknown; error: { message: string } | null }>;
    }).rpc("admin_list_testimonials");
    if (error) toast.error("Lecture impossible : " + error.message);
    setRows((data as Row[]) ?? []);
    setLoading(false);
  }, []);


  useEffect(() => { void load(); }, [load]);

  const setApproved = async (id: string, approved: boolean) => {
    setBusyId(id);
    const { error } = await supabase.from("book_testimonials").update({ approved }).eq("id", id);
    setBusyId(null);
    if (error) return toast.error("Mise à jour impossible : " + error.message);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, approved } : r)));
    toast.success(approved ? "Témoignage publié." : "Témoignage retiré de la page publique.");
  };

  const remove = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.from("book_testimonials").delete().eq("id", id);
    setBusyId(null);
    if (error) return toast.error("Suppression impossible : " + error.message);
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Témoignage supprimé.");
  };

  const visible = rows.filter((r) =>
    filter === "all" ? true : filter === "approved" ? r.approved : !r.approved,
  );

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black">Témoignages</h1>
          <p className="text-sm text-muted-foreground">
            {rows.filter((r) => !r.approved).length} en attente · {rows.filter((r) => r.approved).length} publiés
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </header>

      <div className="mt-5 flex gap-2">
        {([["pending", "En attente"], ["approved", "Publiés"], ["all", "Tous"]] as const).map(([key, label]) => (
          <Button
            key={key}
            size="sm"
            variant={filter === key ? "default" : "outline"}
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : visible.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">Aucun témoignage dans cette vue.</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {visible.map((r) => (
            <article key={r.id} className="rounded-2xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">
                    {r.author_name}
                    {r.book_title ? <span className="font-normal text-muted-foreground"> — {r.book_title}</span> : null}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {r.email} · {new Date(r.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${r.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {r.approved ? "Publié" : "En attente"}
                  </span>
                  {!r.consent_publication && (
                    <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
                      Accord non donné
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-2 flex gap-0.5">
                {Array.from({ length: r.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current text-amber-500" />
                ))}
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm">{r.comment}</p>

              {r.photo_url && (
                <img src={r.photo_url} alt={`Livre de ${r.author_name}`} loading="lazy" className="mt-3 max-h-56 rounded-xl border" />
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {r.approved ? (
                  <Button size="sm" variant="outline" disabled={busyId === r.id} onClick={() => void setApproved(r.id, false)}>
                    <X className="mr-1.5 h-4 w-4" /> Retirer
                  </Button>
                ) : (
                  <Button size="sm" disabled={busyId === r.id || !r.consent_publication} onClick={() => void setApproved(r.id, true)}>
                    <Check className="mr-1.5 h-4 w-4" /> Publier
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="text-destructive" disabled={busyId === r.id} onClick={() => void remove(r.id)}>
                  <Trash2 className="mr-1.5 h-4 w-4" /> Supprimer
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
