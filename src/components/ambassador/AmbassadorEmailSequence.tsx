import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { PRICE_NOW, PRICE_V3, COMMISSION_NOW, COMMISSION_V3 } from '@/lib/influencerKit';

const TEAL = '#008296';

interface EmailTemplate {
  key: string;
  tab: string;
  timing: string;
  subject: string;
  body: string;
}

const AmbassadorEmailSequence = ({ shareLink }: { shareLink: string }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const link = shareLink || 'https://www.ebookstudio.fr/influenceurs';

  const emails: EmailTemplate[] = useMemo(() => [
    {
      key: 'bienvenue',
      tab: '1 · Bienvenue',
      timing: 'À envoyer immédiatement (J+0)',
      subject: 'Bienvenue 🎉 voici ton kit pour gagner avec Ebookstudio',
      body: `Salut [Prénom],

Merci de ton intérêt pour faire connaître Ebookstudio, l'outil qui crée des livres complets (texte, couverture, audio) prêts pour Amazon KDP grâce à l'IA.

Concrètement, tu touches 30% de commission À VIE sur chaque vente : ${COMMISSION_NOW}€ sur l'offre actuelle à ${PRICE_NOW}€, et bientôt ${COMMISSION_V3}€ sur la V3 Pro à ${PRICE_V3}€.

🎁 Ton kit prêt à l'emploi :

— Post Insta/TikTok :
« J'ai écrit et publié un livre complet en 1 week-end avec une IA 🤯 Couverture, texte, version audio… tout y était. L'outil est en bio 👉 [ton lien] »

— Story/Reels :
« Écrire un livre te semble impossible ? Cet outil français fait 80% du boulot à ta place. Démo en story ⬆️ »

— Message à ta communauté :
« Je te partage Ebookstudio, un outil qui crée des ebooks et livres audio complets avec l'IA, prêts pour Amazon. Si tu as toujours voulu publier ton livre, c'est le moment : [ton lien] »

👉 Ton lien : ${link}

Une question ? Réponds simplement à cet email, je te réponds personnellement.

À très vite,
Georges — Ebookstudio`,
    },
    {
      key: 'preuve',
      tab: '2 · Chiffres',
      timing: 'À envoyer 3 jours après (J+3)',
      subject: 'Voici combien tu peux gagner concrètement 💰',
      body: `Salut [Prénom],

Parlons chiffres simplement. Comme la commission est à vie, chaque client reste à toi pour ses futurs achats.

• 5 ventes/mois  → ${5 * COMMISSION_NOW}€  (et ${5 * COMMISSION_V3}€ avec la V3)
• 15 ventes/mois → ${15 * COMMISSION_NOW}€ (et ${15 * COMMISSION_V3}€ avec la V3)
• 30 ventes/mois → ${30 * COMMISSION_NOW}€ (et ${30 * COMMISSION_V3}€ avec la V3)

Le produit se vend bien parce qu'il résout un vrai problème : la page blanche et la complexité de la publication Amazon.

👉 Récupère ton lien et lance-toi : ${link}

Une question sur les gains ou le suivi des ventes ? Réponds à cet email.

Georges — Ebookstudio`,
    },
    {
      key: 'urgence',
      tab: '3 · V3',
      timing: 'À envoyer 7 jours après (J+7)',
      subject: 'La V3 arrive (et tes commissions montent à ' + COMMISSION_V3 + '€) 🚀',
      body: `Salut [Prénom],

La version Publication Assistée Pro à ${PRICE_V3}€ arrive bientôt avec 12 nouveaux modules. Pour toi, ça veut dire ${COMMISSION_V3}€ de commission par vente au lieu de ${COMMISSION_NOW}€.

Les ambassadeurs qui construisent leur audience MAINTENANT sur le sujet seront les premiers à en profiter au lancement. Commence dès aujourd'hui avec l'offre actuelle à ${PRICE_NOW}€.

👉 Ton lien : ${link}

Tu veux qu'on prépare ta stratégie ensemble ? Réponds-moi, je t'aide à caler ta première campagne.

Georges — Ebookstudio`,
    },
    {
      key: 'reactivation',
      tab: '4 · Relance',
      timing: 'À envoyer J+15, uniquement aux inactifs',
      subject: 'On en est où ? (j\'ai 3 accroches pour toi) 🤔',
      body: `Salut [Prénom],

Je n'ai pas encore vu d'activité sur ton lien — pas de souci, se lancer est souvent le plus dur. Voici 3 accroches prêtes à publier :

1️⃣ « Tu as une idée de livre mais tu n'écris jamais ? Cette IA écrit, illustre et met en audio à ta place. »
2️⃣ « Publier sur Amazon KDP fait peur ? J'ai trouvé l'outil qui rend ça simple. »
3️⃣ « Un livre audio complet généré en quelques minutes, écoute le résultat 🎧 »

Et si tu préfères qu'on en parle, je te propose un appel gratuit de 15 min pour caler ta première campagne ensemble.

👉 Ton lien : ${link}

Réponds simplement à cet email, je lis tout.

Georges — Ebookstudio`,
    },
    {
      key: 'vente',
      tab: '5 · Première vente',
      timing: 'À envoyer dès la première vente détectée',
      subject: '🎉 Ta première commission Ebookstudio est validée !',
      body: `Salut [Prénom],

C'est officiel : tu viens de réaliser ta première vente via Ebookstudio ! 🎉

Ta commission de ${COMMISSION_NOW}€ est validée et sera payée sur ton compte. Et comme elle est à vie, ce client te rapportera aussi sur ses futurs achats (notamment la V3 Pro à ${PRICE_V3}€).

💡 Pour en faire une habitude, voici 2 actions simples cette semaine :

1️⃣ Partage un résultat concret : un chiffre, une timeline ou même un screenshot de ton tableau de bord.
2️⃣ Pose une question à ton audience : « Tu t'es déjà demandé combien de temps ça prend d'écrire un livre ? »

Les ambassadeurs qui postent régulièrement gagnent 3× plus. Tu as déjà prouvé que ça marche — maintenant, multiplie.

👉 Ton lien : ${link}

Tu veux qu'on ajuste ta stratégie pour viser 10 ventes ce mois-ci ? Réponds-moi, je te montre comment.

Félicitations encore,
Georges — Ebookstudio`,
    },
  ], [link]);

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    toast.success('Copié !');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#232F3E]/65">
        4 emails de relance pour convertir tes contacts intéressés en ambassadeurs actifs.
        Remplace <strong>[Prénom]</strong> et copie-colle dans ton outil d'emailing (Systeme.io, Gmail…).
      </p>
      <Tabs defaultValue={emails[0].key}>
        <TabsList className="flex flex-wrap h-auto">
          {emails.map((e) => (
            <TabsTrigger key={e.key} value={e.key}>{e.tab}</TabsTrigger>
          ))}
        </TabsList>
        {emails.map((e) => (
          <TabsContent key={e.key} value={e.key} className="mt-3 space-y-3">
            <p className="text-xs font-semibold text-[#FF9E2D]">{e.timing}</p>
            <div className="bg-[#FAFAFA] border border-[#232F3E]/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-[#008296]" />
                <span className="font-bold text-[#232F3E]">Objet :</span>
                <span className="text-[#232F3E]/80">{e.subject}</span>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-[#232F3E]/80 font-sans">{e.body}</pre>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => copy(e.body, `body-${e.key}`)}
                style={{ background: TEAL, color: 'white' }}
                className="font-semibold"
              >
                {copied === `body-${e.key}`
                  ? <><Check className="w-4 h-4 mr-1.5" /> Copié !</>
                  : <><Copy className="w-4 h-4 mr-1.5" /> Copier l'email</>}
              </Button>
              <Button
                variant="outline"
                onClick={() => copy(e.subject, `subj-${e.key}`)}
                className="border-[#008296] text-[#008296]"
              >
                {copied === `subj-${e.key}`
                  ? <><Check className="w-4 h-4 mr-1.5" /> Objet copié !</>
                  : <><Copy className="w-4 h-4 mr-1.5" /> Copier l'objet</>}
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AmbassadorEmailSequence;
