import { useState } from "react";
import { Camera, Check, Loader2, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import SeoHead from "@/components/funnel/SeoHead";

const AMBER = "#FF9E2D";
const INK = "#232F3E";

export default function V3TemoignagePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [consent, setConsent] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onFile = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim() || !comment.trim()) {
      toast.error("Merci de remplir votre nom, votre email et votre commentaire.");
      return;
    }
    if (!consent) {
      toast.error("Merci de cocher l'accord de publication.");
      return;
    }

    setLoading(true);
    try {
      let photoUrl: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("testimonials")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) throw upErr;
        const { data: signed } = await supabase.storage
          .from("testimonials")
          .createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
        photoUrl = signed?.signedUrl ?? null;
      }

      const { error } = await supabase.from("book_testimonials").insert({
        email: email.trim(),
        author_name: name.trim(),
        book_title: bookTitle.trim() || null,
        comment: comment.trim(),
        rating,
        photo_url: photoUrl,
        consent_publication: true,
        approved: false,

      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      console.error(err);
      toast.error("Envoi impossible pour le moment. Réessayez dans un instant.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-5 py-20 text-center">
        <div className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-5" style={{ background: AMBER }}>
          <Check className="w-8 h-8" style={{ color: INK }} />
        </div>
        <h1 className="text-3xl font-black mb-3">Merci infiniment 🙏</h1>
        <p className="text-muted-foreground">
          Votre photo et votre commentaire sont bien reçus. Ils pourront apparaître sur la page
          de présentation d'EbookStudio après validation.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-12">
      <SeoHead
        title="Envoyez la photo de votre premier livre — EbookStudio"
        description="Partagez la photo de votre premier livre publié avec EbookStudio et votre commentaire : votre témoignage peut apparaître sur notre page de présentation."
        canonical="https://ebookstudio.fr/v3/temoignage"
      />

      <span
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
        style={{ background: AMBER, color: INK }}
      >
        <Camera className="w-3.5 h-3.5" /> Votre témoignage
      </span>
      <h1 className="text-3xl md:text-4xl font-black mt-4 leading-tight">
        Montrez-nous votre premier livre
      </h1>
      <p className="text-muted-foreground mt-3">
        Une photo de votre livre (écran, tablette ou exemplaire papier) et quelques mots sur votre
        expérience. C'est la meilleure preuve que la méthode fonctionne — et ça aide énormément
        les prochains auteurs à se lancer.
      </p>

      <form onSubmit={submit} className="grid gap-4 mt-8">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">Votre nom / pseudo *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Marie L." className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold">Votre email *</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@email.com" className="mt-1" />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Titre de votre livre</label>
          <Input value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="Le titre publié sur Amazon KDP" className="mt-1" />
        </div>

        <div>
          <label className="text-sm font-semibold">Votre commentaire *</label>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="mt-1"
            placeholder="Ce que vous avez réussi à faire, en combien de temps, ce qui vous a le plus aidé…"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Votre note</label>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" onClick={() => setRating(i)} aria-label={`${i} étoiles`}>
                <Star
                  className="w-6 h-6"
                  style={{ fill: i <= rating ? AMBER : "transparent", color: AMBER }}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Photo de votre livre</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:font-semibold file:cursor-pointer"
          />
          {preview && (
            <img src={preview} alt="Aperçu de votre livre" className="mt-3 max-h-64 rounded-xl border" />
          )}
        </div>

        <Button type="submit" size="lg" disabled={loading} className="mt-2 font-bold" style={{ background: AMBER, color: INK }}>
          {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
          Envoyer mon témoignage
        </Button>
        <p className="text-xs text-muted-foreground">
          En envoyant ce formulaire, vous nous autorisez à publier votre prénom, votre photo de
          livre et votre commentaire sur nos pages de présentation.
        </p>
      </form>
    </div>
  );
}
