import V3PricingOverview from '@/components/v3public/V3PricingOverview';
import { usePageMeta } from '@/hooks/usePageMeta';
import mockup from '@/assets/vente-mockup-3d.jpg';
import cuervo from '@/assets/vente-el-cuervo.jpg';

/* Page de vente longue façon Book Machine : police droite, contrastes francs. */
const NUIT = '#0b1120', NUIT2 = '#111a2e', OR = '#ff9e2d', BLANC = '#fefefe', ENCRE = '#0f172a', GRIS = '#334155';
const FONT = { fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif', fontStyle: 'normal' as const };

type C = { children: React.ReactNode };
const Cta = ({ label = 'Je choisis ma formule' }: { label?: string }) => (
  <a href="#formules" className="inline-block rounded-xl px-8 py-4 text-lg font-extrabold shadow-xl transition hover:scale-105" style={{ background: OR, color: NUIT, ...FONT }}>{label} →</a>
);
const Dark = ({ children }: C) => <section className="px-5 py-20" style={{ background: NUIT, color: BLANC }}><div className="mx-auto max-w-6xl">{children}</div></section>;
const Light = ({ children }: C) => <section className="px-5 py-20" style={{ background: BLANC, color: ENCRE }}><div className="mx-auto max-w-6xl">{children}</div></section>;
const Kicker = ({ children }: C) => <div className="mb-3 text-center text-sm font-bold uppercase tracking-widest" style={{ color: OR, ...FONT }}>{children}</div>;
const H2 = ({ children }: C) => <h2 className="mx-auto mb-6 max-w-4xl text-center text-3xl font-extrabold leading-tight md:text-5xl" style={{ color: 'inherit', ...FONT }}>{children}</h2>;
const Lead = ({ children, dark }: C & { dark?: boolean }) => <div className="mx-auto mb-12 max-w-3xl text-center text-lg md:text-xl" style={{ color: dark ? '#e2e8f0' : GRIS, ...FONT }}>{children}</div>;
const H3 = ({ children, color }: C & { color?: string }) => <h3 className="mb-2 text-xl font-bold" style={{ color: color ?? 'inherit', ...FONT }}>{children}</h3>;
const P = ({ children, dark }: C & { dark?: boolean }) => <div className="text-base leading-relaxed" style={{ color: dark ? '#e2e8f0' : GRIS, ...FONT }}>{children}</div>;

const douleurs = [
  ['😩 La page blanche', 'Vous avez l’idée depuis des années, mais vous ne savez pas par où commencer.'],
  ['⏳ Des mois perdus', 'Écriture, relecture, mise en page : 6 mois de travail en moyenne, souvent abandonnés en route.'],
  ['💸 Une facture salée', 'Correcteur, graphiste, maquettiste : comptez 1 500 € à 3 000 € pour un seul livre.'],
  ['❌ Le refus d’Amazon', 'Une marge mal réglée, un dos de couverture faux d’un millimètre, et le fichier est rejeté.'],
  ['🌀 Les incohérences', 'Avec les IA classiques : chapitres qui se répètent, personnages qui changent, « Acte I » oubliés dans le texte.'],
  ['🧩 Trop d’outils', 'Un outil d’écriture, Canva, DeepL, un formateur… quatre abonnements pour un résultat bricolé.'],
];
const modules: [string, string, string][] = [
  ['1','Bienvenue et opportunité Amazon KDP','Comprendre pourquoi publier avec l’IA n’a jamais été aussi accessible, comment fonctionne Amazon KDP et pourquoi un livre devient un actif que l’on peut multiplier.'],
  ['2','Idée rentable et validation','Trouver un sujet que les lecteurs recherchent déjà, comprendre les mots-clés et valider la niche avant d’écrire, pour ne plus créer au hasard.'],
  ['3','Écrire son livre avec l’IA','ChatGPT et Gemini, les 16 agents et la correction éditoriale transforment votre idée en manuscrit cohérent, humain et agréable à lire.'],
  ['4','Couverture, design et mise en page','Une couverture qui donne envie de cliquer, un intérieur propre au format Amazon, et des visuels qui renforcent la valeur de votre livre.'],
  ['5','Publication sur Amazon KDP','Votre fiche Amazon prête : description, mots-clés, catégories, versions Kindle et brochée, avec la checklist KDP étape par étape.'],
  ['6','Lancement du livre','Un calendrier de lancement de 30 jours pour obtenir vos premiers lecteurs, vos premiers avis et une vraie dynamique de départ.'],
  ['7','Publicité Amazon Ads','Préparer des campagnes Sponsored Products à petit budget, sans lancement automatique ni dépense surprise. Facultatif, mais un vrai accélérateur.'],
  ['8','Aller plus loin','Livre audio, traductions, séries, livres illustrés : penser catalogue et revenus durables à partir de chaque livre.'],
];
const bonus: [string, string, string, number][] = [
  ['⭐ Séance d’accueil privée de 30 min avec Georges','Toutes les formules','En visioconférence individuelle : nous configurons vos clés IA, cadrons votre premier livre et levons chaque blocage. Vous démarrez tout de suite.',150],
  ['🗺️ La Bible des 600 niches rentables Amazon KDP','Toutes les formules','600 micro-niches analysées (romance, thriller, santé, finances, jeunesse…) avec classement, concurrence et potentiel. Fini les semaines à chercher un sujet.',197],
  ['🎨 Studio Couvertures professionnel','Dès la formule Auteur','Première, dos et quatrième aux dimensions exactes d’Amazon. Économie : 100 € à 250 € de graphiste par livre.',147],
  ['🎧 Studio Audio et voix off','Dès la formule Auteur','Votre manuscrit transformé en livre audio avec des voix naturelles, pour doubler vos sources de revenus.',147],
  ['📅 Pack lancement et calendrier Amazon Ads 30 jours','Toutes les formules','La méthode testée sur « Le Fils d’El Cuervo » : planning jour par jour, premiers avis et campagne à 2 €/jour sans risque.',97],
  ['✍️ Pack 100 modèles de textes Amazon','Toutes les formules','Titres accrocheurs, sous-titres, descriptions qui donnent envie d’acheter et contenu A+ prêts à adapter.',67],
  ['📖 Atelier roman et fiction longue','Toutes les formules','Intrigues cohérentes jusqu’à 240 pages et plus : mémoire des personnages, aucune scène rejouée, aucune scorie.',97],
  ['🧸 Album illustré jeunesse 3–6 ans','Toutes les formules','La méthode pas à pas pour l’une des niches les plus vendues et les plus fidèles d’Amazon.',67],
];
const bonusTotal = bonus.reduce((t, x) => t + x[3], 0);
const profils = [
  ['Profil 1', 'Vous cherchez un complément de revenu', 'Décorrélez votre temps de votre argent. En publiant régulièrement sur des thématiques porteuses, vous créez de véritables « actifs numériques » qui travaillent pour vous sur Amazon, même pendant que vous dormez.'],
  ['Profil 2', 'Vous êtes coach, consultant, thérapeute ou pro', 'Le livre est la meilleure carte de visite au monde. Il assoit votre crédibilité, justifie vos tarifs et attire des clients qualifiés. EbookStudio transforme votre expertise en livre sans y passer vos week-ends.'],
  ['Profil 3', 'Vous avez une histoire à raconter', 'Un roman qui vous trotte dans la tête, l’histoire de votre vie ou un livre pour enfants. L’IA devient votre plume personnelle : elle ne remplace pas votre créativité, elle lui donne des ailes.'],
];
const revenus = [
  ['Vente en direct', 'Vendez aussi sur votre propre site, sans intermédiaire, en gardant la totalité des revenus.'],
  ['Livre audio', 'Transformez le même texte en audiolivre avec voix off, inclus dès la formule Auteur.'],
  ['Liste d’emails', 'Vos lecteurs deviennent une audience fidèle pour vos prochains livres.'],
  ['Affiliation et services', 'Recommandez des outils, proposez un accompagnement ou une formation à vos lecteurs.'],
];
const atouts = [
  ['Double moteur ChatGPT + Gemini', 'Gemini construit l’architecture et la mémoire de votre livre, ChatGPT rédige chaque chapitre avec une vraie plume.'],
  ['16 agents qui travaillent pour vous', 'Idée, plan, personnages, rédaction, style, humanisation, relecture, couverture, fiche Amazon : chacun son métier.'],
  ['Correction éditoriale intégrée', 'Vos chapitres sont relus, les incohérences repérées et corrigées, comme chez un éditeur professionnel.'],
  ['Écriture blindée', 'Notre moteur éditorial retire les « Acte », « Partie » et répétitions, et interdit les découvertes rejouées d’un chapitre à l’autre.'],
  ['Mockups 3D intégrés', 'Votre livre posé sur une vraie table en bois ou un bureau : des visuels prêts pour Amazon et Facebook.'],
  ['Audio et voix off', 'Transformez vos textes en livre audio avec des voix naturelles (dès la formule Auteur).'],
  ['Traduction multilingue', 'Vendez sur tous les marchés Amazon : texte et couverture traduits.'],
  ['100 % vos droits', 'Vous publiez sous votre nom et vous gardez toutes vos redevances.'],
  ['Vos clés IA', 'Utilisez vos clés gratuites ou celles que vous avez déjà : meilleure qualité, aucun frais caché.'],
];
const comparatif = [
  ['Temps pour sortir un livre', '6 mois et plus', 'Quelques jours'],
  ['Coût correction + couverture', '1 500 € à 3 000 €', 'Inclus dès 19 €/mois'],
  ['Couverture au format KDP', 'Graphiste à payer', 'Calcul automatique'],
  ['Cohérence des chapitres', 'Relecture manuelle', 'Mémoire + nettoyage auto'],
  ['Fiche Amazon et mots-clés', 'À faire seul', 'Préparés pour vous'],
  ['Accompagnement', 'Aucun', 'Séance d’accueil de 30 min'],
];
const faq = [
  ['Faut-il savoir écrire ?', 'Non. Vous apportez l’idée, EbookStudio vous accompagne à chaque étape et vous gardez la main sur chaque chapitre.'],
  ['Amazon accepte-t-il les livres créés avec l’IA ?', 'Oui. Amazon demande simplement de déclarer l’usage de l’IA au moment de la publication.'],
  ['À qui appartiennent mes livres ?', 'À vous, entièrement. Vous publiez sous votre nom et touchez vos redevances.'],
  ['Pourquoi mettre mes propres clés ?', 'Avec vos clés gratuites (ou celles que vous avez déjà), les résultats sont bien meilleurs. Nous vous montrons comment faire lors de la séance d’accueil.'],
  ['Puis-je arrêter quand je veux ?', 'Oui, les formules mensuelles sont sans engagement.'],
  ['Faut-il installer un logiciel ?', 'Non, tout fonctionne dans votre navigateur, sur ordinateur ou tablette.'],
  ['Comment publier sur Amazon ?', 'EbookStudio prépare vos fichiers et votre fiche, et une checklist vous guide jusqu’à la mise en ligne.'],
];

export default function FormulesPubliquesPage() {
  usePageMeta({ title: 'EbookStudio — Écrivez et publiez votre livre sur Amazon', description: 'De l’idée au livre publié sur Amazon KDP : rédaction cohérente, couverture, mockups 3D. Formules dès 19 €/mois, sans engagement.' });
  return <main className="min-h-screen" style={{ background: NUIT, color: BLANC, ...FONT }}>
    {/* HERO */}
    <section className="px-5 pb-20 pt-16" style={{ background: `radial-gradient(circle at 70% 20%, #1e3a5f 0%, ${NUIT} 60%)` }}>
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <span className="mb-5 inline-block rounded-full px-4 py-1.5 text-sm font-bold" style={{ background: OR, color: NUIT }}>✨ L’atelier français pour publier sur Amazon KDP</span>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl" style={FONT}>Créez, publiez et générez un revenu avec des livres IA, <span style={{ color: OR }}>même si vous n’avez jamais écrit une ligne de votre vie</span></h1>
          <div className="mb-4 text-xl font-semibold leading-relaxed" style={{ color: BLANC }}>L’intelligence artificielle fait 90 % du travail à votre place et Amazon se charge de vendre vos livres pendant que vous dormez.</div>
          <div className="mb-8 text-lg leading-relaxed" style={{ color: '#e2e8f0' }}>La méthode complète pas à pas pour transformer une simple idée en livre publié et en source de revenus durable.</div>
          <Cta />
          <div className="mt-6 grid gap-2 text-base font-semibold" style={{ color: BLANC }}>
            <div>✅ Paiement sécurisé Stripe</div><div>✅ Sans engagement, dès 19 €/mois</div><div>✅ Séance d’accueil de 30 min avec Georges</div>
          </div>
        </div>
        <img src={mockup} alt="Livre EbookStudio présenté en mockup 3D" className="w-full rounded-3xl shadow-2xl" width={1080} height={1080} />
      </div>
    </section>

    {/* TOUT A CHANGÉ */}
    <Dark>
      <Kicker>Une époque totalement folle</Kicker>
      <H2>Aujourd’hui, tout a changé avec l’intelligence artificielle</H2>
      <Lead dark>Pour la première fois dans l’histoire, une personne ordinaire peut créer un livre de manière beaucoup plus simple… et surtout infiniment plus rapide qu’avant (vraiment… c’est le jour et la nuit). Ce qui demandait autrefois des mois, parfois des années, peut aujourd’hui avancer à une vitesse complètement différente.</Lead>
      <Lead dark>Pourquoi ? Parce qu’avec les bons outils, la bonne méthode et les bonnes étapes, l’intelligence artificielle permet d’accélérer tout ce qui bloquait la majorité des gens.</Lead>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        {['Trouver une idée porteuse','Valider un sujet avant de perdre du temps','Structurer un plan clair','Rédiger beaucoup plus vite','Améliorer le style','Rendre le texte plus humain','Créer une couverture convaincante','Mettre le livre en page','Le publier sur Amazon','Et recommencer avec d’autres livres'].map((t, i) => <div key={t} className="rounded-2xl p-5 text-center" style={{ background: NUIT2, border: '1px solid #334155' }}>
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full font-extrabold" style={{ background: OR, color: NUIT }}>{i + 1}</div>
          <div className="text-base font-bold" style={{ color: BLANC, ...FONT }}>{t}</div></div>)}
      </div>
    </Dark>

    {/* DOULEUR */}
    <Light>
      <Kicker>Le vrai problème</Kicker>
      <H2>Pourquoi 9 livres sur 10 ne voient jamais le jour</H2>
      <Lead>Ce n’est pas un manque de talent. C’est un parcours semé d’obstacles que personne ne vous explique.</Lead>
      <div className="grid gap-6 md:grid-cols-3">
        {douleurs.map(([t, d]) => <div key={t} className="rounded-2xl border-2 p-7" style={{ borderColor: '#e2e8f0', background: '#f8fafc' }}><H3 color={ENCRE}>{t}</H3><P>{d}</P>
          <div className="mt-4 text-base font-extrabold" style={{ color: ENCRE }}>Valeur : <span style={{ textDecoration: 'line-through', color: '#b91c1c' }}>{v} €</span> <span style={{ color: '#047857' }}>OFFERT</span></div></div>)}
      </div>
      <div className="mt-10 rounded-2xl p-8 text-center shadow-xl" style={{ background: NUIT, border: `3px solid ${OR}` }}>
        <div className="text-2xl md:text-3xl font-extrabold" style={{ color: BLANC }}>Valeur totale des bonus : <span style={{ textDecoration: 'line-through', color: OR }}>{bonusTotal} €</span> → <span style={{ color: OR }}>0 €</span> avec votre abonnement</div>
        <div className="mt-3 text-lg" style={{ color: '#e2e8f0' }}>En rejoignant EbookStudio aujourd’hui, vous recevez {bonusTotal} € d’outils, de ressources et d’accompagnement offerts.</div>
      </div>
    </Light>

    {/* SOLUTION */}
    <Dark>
      <Kicker>Le programme complet</Kicker>
      <H2>De l’idée au livre vendu sur Amazon : 8 étapes guidées</H2>
      <Lead dark>Un seul atelier remplace le correcteur, le graphiste, le maquettiste et les abonnements dispersés. Chaque étape est accompagnée.</Lead>
      <div className="grid gap-6 md:grid-cols-2">
        {modules.map(([n, t, d]) => <div key={n} className="flex gap-5 rounded-2xl p-7" style={{ background: NUIT2, border: '1px solid #334155' }}>
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-extrabold" style={{ background: OR, color: NUIT }}>{n}</div>
          <div><div className="mb-1 text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>Étape {n}</div><H3 color={BLANC}>{t}</H3><P dark>{d}</P></div></div>)}
      </div>
      <div className="mt-12 text-center"><Cta label="Je commence mon livre" /></div>
    </Dark>


    {/* WHAOUH */}
    <Light>
      <Kicker>Jamais vu ailleurs</Kicker>
      <H2>Tout, de A à Z, dans un seul atelier</H2>
      <Lead>Nous vous facilitons 90 % du travail : vous gardez le plaisir de créer, nos agents s’occupent du reste.</Lead>
      <div className="grid gap-6 md:grid-cols-3">
        {[['🤖 ChatGPT + Gemini','Les deux meilleures intelligences artificielles du moment travaillent ensemble sur votre livre.'],['👥 16 agents spécialisés','Une vraie équipe éditoriale virtuelle : de l’idée jusqu’à la mise en ligne sur Amazon.'],['✍️ Correction éditoriale','Répétitions, incohérences, personnages qui changent : tout est repéré et corrigé.']].map(([t,d])=><div key={t} className="rounded-2xl border-2 p-7" style={{ borderColor: OR, background: '#fff7ed' }}><H3 color={ENCRE}>{t}</H3><P>{d}</P>
          <div className="mt-4 text-base font-extrabold" style={{ color: ENCRE }}>Valeur : <span style={{ textDecoration: 'line-through', color: '#b91c1c' }}>{v} €</span> <span style={{ color: '#047857' }}>OFFERT</span></div></div>)}
      </div>
      <div className="mt-10 rounded-2xl p-8 text-center shadow-xl" style={{ background: NUIT, border: `3px solid ${OR}` }}>
        <div className="text-2xl md:text-3xl font-extrabold" style={{ color: BLANC }}>Valeur totale des bonus : <span style={{ textDecoration: 'line-through', color: OR }}>{bonusTotal} €</span> → <span style={{ color: OR }}>0 €</span> avec votre abonnement</div>
        <div className="mt-3 text-lg" style={{ color: '#e2e8f0' }}>En rejoignant EbookStudio aujourd’hui, vous recevez {bonusTotal} € d’outils, de ressources et d’accompagnement offerts.</div>
      </div>
      <div className="mx-auto mt-12 max-w-3xl rounded-2xl p-8" style={{ background: NUIT, color: BLANC }}>
        <div className="mb-3 text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>Le mot de Georges, fondateur</div>
        <div className="text-lg leading-relaxed" style={{ color: '#e2e8f0', ...FONT }}>« Chez nos confrères, vous trouverez des logiciels qui font à peu près le travail. J’ai fait le tour du marché : un outil comme celui-ci, je n’en ai jamais vu. Avoir tout dedans, de A à Z, c’est du jamais vu. J’ai moi-même publié mon roman de 241 pages avec EbookStudio, et je vous accompagne personnellement lors de votre séance d’accueil. »</div>
        <div className="mt-4 font-bold" style={{ color: OR }}>— Georges Boubet</div>
      </div>
    </Light>

    {/* POUR QUI */}
    <Light>
      <Kicker>Pour qui ?</Kicker>
      <H2>À qui s’adresse EbookStudio ?</H2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {profils.map(([n, t, d]) => <div key={t} className="rounded-2xl p-8 shadow-lg" style={{ background: BLANC, borderTop: `5px solid #008296` }}><div className="mb-2 text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>{n}</div><H3 color="#008296">{t}</H3><P>{d}</P></div>)}
      </div>
    </Light>

    {/* GAINS */}
    <Dark>
      <Kicker>Parlons vrai</Kicker>
      <H2>Combien pouvez-vous réellement gagner ?</H2>
      <div className="mx-auto mt-8 max-w-3xl space-y-5 text-lg leading-relaxed" style={{ color: '#e2e8f0', ...FONT }}>
        <div>Personne ne peut vous garantir un revenu. Tout dépend de vos sujets, de la qualité de vos livres, de votre régularité et de votre capacité à répondre à une vraie demande.</div>
        <div>Oui, certains gagnent 0 ou 50 € par mois. Ce sont ceux qui publient des livres génériques, écrits vite fait avec une IA basique, dans des niches saturées, avec une couverture bâclée. <strong style={{ color: BLANC }}>Ce n’est pas ce que nous vous proposons.</strong></div>
        <div>La différence entre un livre qui fait 30 €/mois et un livre qui fait 800 €/mois, ce n’est pas le talent d’écriture : c’est <strong style={{ color: OR }}>le choix de la thématique et la qualité du livre</strong>. C’est exactement ce que nos 16 agents et la correction éditoriale vous apportent.</div>
      </div>
      <div className="mx-auto mt-10 max-w-3xl rounded-2xl p-8" style={{ background: NUIT2, border: `2px solid ${OR}` }}>
        <H3 color={OR}>Un exemple concret</H3>
        <P dark>Un livre bien positionné rapporte 300 € par mois, soit environ 3 000 € par an. S’il se vend tranquillement pendant 3 ans, il vous rapporte <strong style={{ color: BLANC }}>environ 8 000 à 12 000 €</strong>.</P>
      </div>
      <div className="mx-auto mt-10 max-w-4xl">
        <H3 color={BLANC}>Et si vous publiez un livre par mois ?</H3>
        <div className="mt-6 flex h-48 items-end gap-2">
          {Array.from({ length: 12 }, (_, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-md" style={{ height: `${(i + 1) * 8.3}%`, background: OR }} /><div className="text-sm font-bold" style={{ color: '#e2e8f0' }}>{i + 1}</div></div>)}
        </div>
        <div className="mt-6 space-y-4 text-lg leading-relaxed" style={{ color: '#e2e8f0', ...FONT }}>
          <div>Le mois 1, vous avez 1 livre en ligne. Le mois 6, vous en avez 6. Chaque nouveau livre s’ajoute aux autres. Rien ne disparaît, tout se cumule.</div>
          <div>Tous ne seront pas des best-sellers, c’est normal. Mais si sur 12 livres, 3 tournent bien, 2 décollent et les autres font de petits revenus réguliers, vous terminez l’année avec un vrai complément de revenu mensuel, construit brique par brique.</div>
          <div className="text-sm" style={{ color: '#94a3b8' }}>Exemple illustratif, sans garantie de résultat.</div>
        </div>
      </div>
    </Dark>

    {/* AU-DELA D'AMAZON */}
    <Light>
      <Kicker>Revenus multiples</Kicker>
      <H2>Un livre peut rapporter bien plus que des ventes Amazon</H2>
      <div className="mx-auto mt-6 max-w-3xl text-center text-lg leading-relaxed" style={{ color: '#334155', ...FONT }}>Ce que vous vendez, ce n’est pas « un livre » : c’est une solution à un problème. Et votre ouvrage devient une porte d’entrée vers d’autres sources de revenus.</div>
      <div className="mt-10 grid gap-6 md:grid-cols-4">
        {revenus.map(([t, d]) => <div key={t} className="rounded-2xl p-7 shadow-lg" style={{ background: BLANC, borderTop: `5px solid ${OR}` }}><H3 color={ENCRE}>{t}</H3><P>{d}</P>
          <div className="mt-4 text-base font-extrabold" style={{ color: ENCRE }}>Valeur : <span style={{ textDecoration: 'line-through', color: '#b91c1c' }}>{v} €</span> <span style={{ color: '#047857' }}>OFFERT</span></div></div>)}
      </div>
      <div className="mt-10 rounded-2xl p-8 text-center shadow-xl" style={{ background: NUIT, border: `3px solid ${OR}` }}>
        <div className="text-2xl md:text-3xl font-extrabold" style={{ color: BLANC }}>Valeur totale des bonus : <span style={{ textDecoration: 'line-through', color: OR }}>{bonusTotal} €</span> → <span style={{ color: OR }}>0 €</span> avec votre abonnement</div>
        <div className="mt-3 text-lg" style={{ color: '#e2e8f0' }}>En rejoignant EbookStudio aujourd’hui, vous recevez {bonusTotal} € d’outils, de ressources et d’accompagnement offerts.</div>
      </div>
    </Light>

    {/* ATOUTS */}
    <Dark>
      <Kicker>Exclusivités</Kicker>
      <H2>Ce que vous ne trouverez nulle part ailleurs</H2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {atouts.map(([t, d]) => <div key={t} className="rounded-2xl p-7" style={{ background: NUIT2, border: '1px solid #334155' }}><H3 color={OR}>✓ {t}</H3><P dark>{d}</P></div>)}
      </div>
    </Dark>

    {/* PREUVE */}
    <Light>
      <div className="grid items-center gap-12 md:grid-cols-2">
        <img src={cuervo} alt="Le Fils d’El Cuervo, roman publié avec EbookStudio" className="w-full rounded-3xl shadow-2xl" loading="lazy" />
        <div>
          <div className="mb-3 text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>Preuve réelle</div>
          <h2 className="mb-5 text-3xl font-extrabold md:text-4xl" style={{ color: ENCRE, ...FONT }}>« Le Fils d’El Cuervo » : un vrai roman, en vente sur Amazon</h2>
          <P>241 pages, publié en Kindle et en broché, accepté par Amazon. Rédigé, mis en page et habillé avec EbookStudio.</P>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="https://www.amazon.fr/dp/B0HLL8PZB6" target="_blank" rel="noopener noreferrer" className="rounded-xl px-6 py-3 font-bold" style={{ background: ENCRE, color: BLANC }}>Voir le Kindle</a>
            <a href="https://www.amazon.fr/dp/B0HRVVYL49" target="_blank" rel="noopener noreferrer" className="rounded-xl border-2 px-6 py-3 font-bold" style={{ borderColor: ENCRE, color: ENCRE }}>Voir le broché</a>
          </div>
        </div>
      </div>
    </Light>

    {/* COMPARATIF */}
    <Dark>
      <Kicker>Comparez</Kicker>
      <H2>Méthode classique ou EbookStudio ?</H2>
      <div className="mt-10 overflow-x-auto rounded-2xl" style={{ background: BLANC }}>
        <table className="w-full text-left text-base" style={{ color: ENCRE, ...FONT }}>
          <thead><tr style={{ background: '#f1f5f9' }}><th className="p-5"></th><th className="p-5 font-bold">Méthode classique</th><th className="p-5 font-extrabold" style={{ color: '#008296' }}>EbookStudio</th></tr></thead>
          <tbody>{comparatif.map(([l, a, b]) => <tr key={l} className="border-t" style={{ borderColor: '#e2e8f0' }}>
            <td className="p-5 font-bold">{l}</td><td className="p-5" style={{ color: '#b91c1c' }}>✗ {a}</td><td className="p-5 font-semibold" style={{ color: '#047857' }}>✓ {b}</td></tr>)}</tbody>
        </table>
      </div>
    </Dark>

    {/* BONUS */}
    <Light>
      <Kicker>Vos bonus</Kicker>
      <H2>Vos bonus exclusifs, offerts avec votre abonnement</H2>
      <Lead>La partie que tout le monde adore : des outils et un accompagnement qui font gagner des semaines de travail.</Lead>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {bonus.map(([t, f, d, v], i) => <div key={t} className="rounded-2xl p-7 shadow-lg" style={{ background: i === 0 ? '#fff7ed' : BLANC, border: `2px solid ${i === 0 ? OR : '#e2e8f0'}` }}>
          <div className="mb-2 text-sm font-bold uppercase tracking-widest" style={{ color: '#008296' }}>Bonus {i + 1} · {f}</div>
          <H3 color={ENCRE}>{t}</H3><P>{d}</P>
          <div className="mt-4 text-base font-extrabold" style={{ color: ENCRE }}>Valeur : <span style={{ textDecoration: 'line-through', color: '#b91c1c' }}>{v} €</span> <span style={{ color: '#047857' }}>OFFERT</span></div></div>)}
      </div>
      <div className="mt-10 rounded-2xl p-8 text-center shadow-xl" style={{ background: NUIT, border: `3px solid ${OR}` }}>
        <div className="text-2xl md:text-3xl font-extrabold" style={{ color: BLANC }}>Valeur totale des bonus : <span style={{ textDecoration: 'line-through', color: OR }}>{bonusTotal} €</span> → <span style={{ color: OR }}>0 €</span> avec votre abonnement</div>
        <div className="mt-3 text-lg" style={{ color: '#e2e8f0' }}>En rejoignant EbookStudio aujourd’hui, vous recevez {bonusTotal} € d’outils, de ressources et d’accompagnement offerts.</div>
      </div>
    </Light>

    {/* TARIFS */}
    <section id="formules" className="px-5 py-20" style={{ background: NUIT2, color: BLANC }}>
      <div className="mx-auto max-w-6xl">
        <Kicker>Nos formules</Kicker>
        <H2>Choisissez votre formule</H2>
        <Lead dark>Starter 19 €, Auteur 29 €, Édition 59 € par mois. Sans engagement. Séance d’accueil de 30 minutes offerte.</Lead>
        <V3PricingOverview hideExistingCustomers />
        <div className="mx-auto mt-14 max-w-3xl rounded-3xl p-8 text-center md:p-10" style={{ background: '#0b1120', border: `2px solid ${OR}`, boxShadow: '0 0 40px rgba(255,158,45,.25)', ...FONT }}>
          <div className="mb-3 text-sm font-bold uppercase tracking-widest" style={{ color: OR }}>🧪 Vous hésitez encore avant de choisir une formule ?</div>
          <h3 className="mb-4 text-2xl font-extrabold md:text-3xl" style={{ color: BLANC }}>Testez la puissance de notre atelier en 2 minutes chrono</h3>
          <div className="mb-7 text-lg leading-relaxed" style={{ color: '#e2e8f0' }}>Pas besoin de carte bancaire. Saisissez une simple idée et découvrez immédiatement le plan complet et les premières lignes rédigées par nos agents IA. Vous jugerez sur pièce la qualité du texte.</div>
          <a href="/essai?utm_source=formules&utm_medium=encart" className="inline-flex items-center justify-center rounded-xl px-8 py-4 text-lg font-bold" style={{ background: OR, color: '#0b1120' }}>✨ Tester gratuitement en 1 clic (sans carte) →</a>
        </div>
      </div>
    </section>

    {/* FAQ */}
    <Light>
      <Kicker>Questions fréquentes</Kicker>
      <H2>Vous vous demandez sûrement…</H2>
      <div className="mx-auto mt-10 max-w-3xl space-y-4">
        {faq.map(([q, r]) => <details key={q} className="rounded-2xl border-2 p-6" style={{ borderColor: '#e2e8f0', background: BLANC }}>
          <summary className="cursor-pointer text-lg font-bold" style={{ color: ENCRE }}>{q}</summary>
          <div className="mt-3"><P>{r}</P></div></details>)}
      </div>
    </Light>

    {/* CTA FINAL */}
    <Dark>
      <div className="text-center">
        <H2>Votre livre mérite d’exister. Commencez aujourd’hui.</H2>
        <Lead dark>Choisissez votre formule, puis réservez votre séance d’accueil de 30 minutes : nous configurons ensemble vos clés et lançons votre premier livre.</Lead>
        <Cta label="Je publie mon livre" />
      </div>
    </Dark>
  </main>;
}
