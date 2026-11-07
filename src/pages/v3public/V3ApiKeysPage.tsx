import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { KeyRound, ShieldCheck, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import BackButton from '@/components/v3/BackButton';
import { EbookSettingsPanel } from '@/components/ebook/EbookSettingsPanel';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import guideImage from '@/assets/cles-api-v3-guide.jpg';

const guides = [
  {
    id: 'gemini', title: 'Créer votre clé Gemini', subtitle: 'Votre point de départ avec Google AI Studio',
    url: 'https://aistudio.google.com/apikey', action: 'Ouvrir Google AI Studio',
    steps: [
      ['Connectez-vous à votre compte Google', 'Ouvrez Google AI Studio avec le bouton ci-dessous. Connectez-vous à votre propre compte Google et acceptez les conditions si elles vous sont proposées. Vous ne devez pas utiliser le compte de Georges.'],
      ['Ouvrez la rubrique des clés API', 'Le lien mène à la rubrique « API keys ». Selon la langue de Google, le bouton peut porter le nom « Create API key » ou « Créer une clé API ».'],
      ['Créez une clé dans votre projet', 'Cliquez sur le bouton de création. Si Google vous demande un projet, choisissez votre projet existant ou créez-en un depuis les options proposées. Donnez-lui un nom facile à reconnaître, par exemple « EbookStudio personnel ». Les étapes et les conditions peuvent varier selon votre compte.'],
      ['Copiez la clé complète', 'Utilisez le bouton de copie de Google. Copiez uniquement la clé, sans guillemets, sans espace ajouté et sans texte autour. Gardez-la privée : ne la mettez ni dans un email, ni dans une capture d’écran, ni dans votre livre.'],
      ['Collez-la dans EbookStudio', 'Dans « Mes réglages » plus bas, choisissez Gemini dans la liste « Provider », puis collez votre clé dans « Clé API Gemini ». La saisie est masquée et enregistrée automatiquement sur ce navigateur.'],
      ['Vérifiez puis commencez', 'Cliquez sur « Tester » à côté du champ. Si le test est accepté, vous pouvez ouvrir « Commence ici ». Un test accepté ne supprime pas les limites de Google : le modèle et votre volume disponible restent à vérifier en cas de blocage.'],
    ],
    note: 'Google propose un niveau gratuit pour certains modèles, sous conditions et avec des limites. Ne confondez pas création d’une clé et utilisation illimitée gratuite. Consultez les quotas et la facturation de votre projet avant d’activer une offre payante.',
  },
  {
    id: 'openai', title: 'Ajouter votre clé OpenAI', subtitle: 'Pour les ateliers qui utilisent ChatGPT via l’API',
    url: 'https://platform.openai.com/api-keys', action: 'Ouvrir les clés OpenAI',
    steps: [
      ['Ouvrez la plateforme OpenAI', 'Connectez-vous à votre propre compte sur la plateforme OpenAI, puis ouvrez la page des clés API. La clé n’est pas votre mot de passe ChatGPT et elle ne se récupère pas dans une conversation.'],
      ['Créez une clé secrète', 'Cliquez sur « Create new secret key », choisissez le projet demandé et donnez un nom à cette clé. Copiez-la au moment de sa création : OpenAI n’affiche généralement la clé complète qu’une seule fois.'],
      ['Vérifiez la facturation API', 'Votre abonnement ChatGPT, même payant, ne comprend pas automatiquement les appels API. Vérifiez le solde ou la facturation de votre compte OpenAI et configurez les alertes et limites disponibles. Les frais éventuels sont réglés à OpenAI, séparément de votre abonnement EbookStudio.'],
      ['Collez puis testez votre clé', 'Dans « Mes réglages », choisissez OpenAI / ChatGPT dans « Provider ». Collez la clé dans le champ correspondant et cliquez sur « Tester ». Votre clé Gemini déjà saisie reste conservée : changer le fournisseur ne l’efface pas.'],
    ],
    note: 'Le Studio Pro hybride utilise Gemini et ChatGPT pour des rôles distincts. Gardez vos deux clés si vous utilisez cet atelier. Ajouter une clé ne débloque pas un atelier absent de votre formule.',
  },
  {
    id: 'openrouter', title: 'Ajouter votre clé OpenRouter', subtitle: 'Un accès à plusieurs modèles depuis votre compte OpenRouter',
    url: 'https://openrouter.ai/keys', action: 'Ouvrir les clés OpenRouter',
    steps: [
      ['Connectez-vous à OpenRouter', 'Ouvrez le site officiel avec le bouton ci-dessous. Créez votre compte si nécessaire, puis rendez-vous dans « Keys ».'],
      ['Créez votre clé et encadrez les dépenses', 'Cliquez sur « Create Key », donnez-lui un nom et définissez une limite de crédit adaptée à votre utilisation si cette option vous est proposée. Vérifiez votre solde et les paramètres de recharge automatique avant de lancer des générations.'],
      ['Copiez et collez la clé', 'Copiez la clé complète. Revenez à « Mes réglages », choisissez OpenRouter dans « Provider » et collez-la dans « Clé API OpenRouter ». N’utilisez pas ce champ pour une clé OpenAI ou Gemini.'],
      ['Choisissez votre modèle et testez', 'Sélectionnez un modèle dans « Modèle OpenRouter », puis cliquez sur « Tester ». Les tarifs et disponibilités diffèrent selon les modèles. La validation de la clé ne garantit pas que chaque modèle soit disponible pour votre compte.'],
    ],
    note: 'OpenRouter est un fournisseur distinct d’OpenAI et de Google. Préparez vos propres clés Gemini et OpenAI pour leurs ateliers respectifs, puis ajoutez OpenRouter lorsque l’atelier le demande. Aucun fournisseur n’est remplacé automatiquement par la clé de Georges.',
  },
];

const questions = [
  ['Qu’est-ce qu’une clé API, exactement ?', 'C’est un identifiant secret créé chez votre fournisseur d’IA. Il autorise EbookStudio à lui transmettre votre demande avec votre compte. Ce n’est ni votre code d’accès EBK, ni votre mot de passe, ni une clé fournie par Georges. Votre abonnement donne accès aux ateliers ; votre clé sert à appeler votre fournisseur d’IA.'],
  ['Dois-je créer les trois clés avant de commencer ?', 'Préparez vos propres clés Gemini et OpenAI : le Studio Pro hybride utilise les deux pour des rôles distincts. Ajoutez OpenRouter pour les ateliers qui l’utilisent. Chaque atelier indique la clé nécessaire ; sans elle, sa génération ne démarre pas. Vous pouvez conserver plusieurs clés dans les réglages, sans utiliser les clés de Georges.'],
  ['Faut-il cliquer sur un bouton Enregistrer ?', 'Pour les clés et le fournisseur de rédaction, non : les changements sont enregistrés automatiquement lorsque vous saisissez la clé ou changez la sélection. « Tester » vérifie la clé auprès du fournisseur, ce n’est pas un bouton d’enregistrement. Revenez sur cette page pour retrouver vos réglages dans le même navigateur.'],
  ['Pourquoi ma clé n’apparaît-elle pas sur mon autre ordinateur ?', 'Les réglages actuels des clés sont conservés dans le navigateur utilisé. Ils ne sont pas automatiquement synchronisés entre vos appareils ou navigateurs. Sur un nouvel appareil, renseignez à nouveau vos propres clés. Effacer les données du site ou utiliser une fenêtre privée peut aussi faire disparaître ces réglages.'],
  ['Le test est accepté mais une génération échoue : pourquoi ?', 'Le test contrôle la connexion et la reconnaissance de la clé. Une génération peut néanmoins rencontrer un quota atteint, un solde insuffisant, un modèle indisponible ou une limite temporaire du fournisseur. Lisez le message de l’atelier, vérifiez votre compte chez le fournisseur et réessayez après avoir corrigé la cause.'],
  ['Ma clé est refusée : que vérifier ?', 'Vérifiez d’abord que vous avez choisi le bon fournisseur et copié la clé complète, sans espace ni guillemets. Vérifiez ensuite que la clé est active, que son projet autorise l’API concernée et que votre compte dispose des autorisations et du volume nécessaires. Une clé révoquée doit être remplacée par une nouvelle clé créée chez le fournisseur. Ne transmettez jamais la clé à l’assistance.'],
  ['Qui paie l’utilisation de l’IA ?', 'Les éventuels frais d’API sont liés à votre compte Gemini, OpenAI ou OpenRouter et sont réglés directement au fournisseur. Ils sont distincts du prix de votre abonnement EbookStudio. Les limites de votre formule EbookStudio restent applicables : connecter votre clé ne les supprime pas. Consultez les tarifs officiels avant d’utiliser un modèle payant.'],
  ['Que faire si j’ai montré ma clé par erreur ?', 'Révoquez immédiatement la clé depuis le site de son fournisseur, créez-en une nouvelle et remplacez l’ancienne dans vos réglages. Contrôlez aussi l’utilisation et les dépenses de votre compte. Masquez toujours le champ avant une capture d’écran et ne publiez aucune clé dans un document partagé.'],
];

/** Paramétrage des clés IA (BYOK) en page plein écran. */
export default function V3ApiKeysPage() {
  return (
    <div className="v3-api-guide mx-auto w-full max-w-5xl px-4 py-8 text-foreground">
      <Helmet>
        <title>Clés API : votre première étape V3 — EbookStudio</title>
        <meta
          name="description"
          content="Enregistrez votre clé Gemini, OpenAI ou OpenRouter pour faire tourner l'écriture, la correction et l'humaniseur avec votre propre moteur."
        />
      </Helmet>

      <BackButton to="/v3" label="Retour à l’accueil V3" />
      <header className="mb-8 mt-4">
        <img src={guideImage} alt="Bureau d’auteur lumineux avec une clé sur un carnet, pour préparer ses clés IA" width={1536} height={768} className="mb-6 aspect-[2/1] w-full rounded-lg object-cover" />
        <p className="mb-3 flex items-center gap-2 font-semibold text-primary"><KeyRound className="h-5 w-5" /> Première phase : préparer vos clés personnelles</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Clés API : branchez votre IA</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Avant « Commence ici », préparez vos propres clés Gemini et OpenAI. Ce guide explique comment les créer et les coller, puis ajouter OpenRouter pour les ateliers concernés. Chaque atelier utilise la clé de son fournisseur : sans la clé personnelle nécessaire, sa rédaction ne démarre pas. Les clés de Georges ne remplacent jamais les vôtres.</p>
      </header>
      <nav aria-label="Sommaire du guide des clés API" className="mb-10 flex flex-wrap gap-2">
        {guides.map(guide => <Button key={guide.id} asChild variant="outline"><a href={`#${guide.id}`}>{guide.id === 'gemini' ? '1. Gemini' : guide.id === 'openai' ? '2. OpenAI' : '3. OpenRouter'}</a></Button>)}
        <Button asChild><a href="#mes-reglages"><KeyRound className="mr-2 h-4 w-4" /> Coller mes clés</a></Button>
      </nav>
      <section className="border-y border-border bg-secondary px-5 py-6">
        <h2 className="text-xl font-bold">Votre abonnement et vos clés : deux choses différentes</h2>
        <p className="mt-3 leading-7">EbookStudio vous donne accès aux ateliers de votre formule. Les clés sont les vôtres : vous les créez sur votre compte chez Google, OpenAI ou OpenRouter. Ce ne sont pas les clés de Georges. Les éventuels frais d’utilisation de l’IA restent à votre charge auprès du fournisseur.</p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Prévoyez votre compte fournisseur, l’accès à cette page dans un autre onglet et un endroit sûr pour conserver vos clés. Aucun paiement EbookStudio ni changement de formule n’est nécessaire pour renseigner vos réglages.</p>
      </section>
      {guides.map((guide, index) => (
        <section key={guide.id} id={guide.id} className="scroll-mt-32 border-b border-border py-10">
          <p className="mb-2 font-semibold text-primary">Étape {index + 1}</p>
          <h2 className="text-2xl font-bold">{guide.title}</h2>
          <p className="mt-2 text-muted-foreground">{guide.subtitle}</p>
          <Button asChild className="my-5 h-auto whitespace-normal py-3"><a href={guide.url} target="_blank" rel="noopener noreferrer">{guide.action}<ExternalLink className="ml-2 h-4 w-4 shrink-0" /></a></Button>
          <ol className="space-y-3">
            {guide.steps.map(([title, description], step) => (
              <li key={title} className="flex gap-4 rounded-lg border border-border bg-card p-4 sm:p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary font-bold text-primary">{step + 1}</span>
                <div className="min-w-0"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p></div>
              </li>
            ))}
          </ol>
          <p className="mt-5 border-l-4 border-primary bg-secondary p-4 text-sm leading-7">{guide.note}</p>
        </section>
      ))}
      <section id="mes-reglages" className="scroll-mt-32 py-10">
        <h2 className="text-2xl font-bold">Mes réglages : coller mes propres clés</h2>
        <p className="mb-6 mt-3 leading-7 text-muted-foreground">Choisissez votre fournisseur dans « Provider », puis collez sa clé dans le champ masqué. Pour ajouter une autre clé, sélectionnez cet autre fournisseur : la précédente reste enregistrée. Revenez ensuite au fournisseur que vous voulez utiliser pour la rédaction. Les autres réglages de mise en page déjà disponibles restent inchangés.</p>
        <EbookSettingsPanel />
        <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-muted-foreground"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" /> L’enregistrement est automatique dans ce navigateur. « Tester » contacte le fournisseur ; certains tests peuvent consommer son quota. Il ne lance ni livre ni paiement EbookStudio.</p>
      </section>
      <section className="border-y border-border bg-secondary px-5 py-6">
        <h2 className="flex items-center gap-2 text-xl font-bold"><ShieldCheck className="h-5 w-5 text-primary" /> Gardez vos clés privées</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7">
          <li>Les clés sont conservées dans votre navigateur. Évitez les ordinateurs partagés et protégez votre session : une personne ayant accès à ce navigateur pourrait accéder à ces réglages.</li>
          <li>Votre clé est transmise au fournisseur ou au service de génération concerné quand un atelier l’utilise. Les demandes et contenus sont alors soumis aux conditions de ce fournisseur.</li>
          <li>Ne communiquez jamais une clé à Georges ou à l’assistance. Pour demander de l’aide, envoyez le message d’erreur en masquant toute donnée secrète.</li>
          <li>Contrôlez les limites de dépenses, les quotas et les alertes chez votre fournisseur. Si une clé a été divulguée, révoquez-la et remplacez-la.</li>
        </ul>
      </section>
      <section className="py-10">
        <h2 className="mb-5 text-2xl font-bold">Questions fréquentes et dépannage</h2>
        <Accordion type="multiple" className="rounded-lg border border-border bg-card px-5">
          {questions.map(([question, answer], index) => <AccordionItem key={question} value={`question-${index}`}><AccordionTrigger className="text-left text-base">{question}</AccordionTrigger><AccordionContent className="text-sm leading-7 text-muted-foreground">{answer}</AccordionContent></AccordionItem>)}
        </Accordion>
      </section>
      <section className="border-t border-border py-8">
        <h2 className="text-2xl font-bold">Vos clés sont prêtes ? Place à votre livre.</h2>
        <p className="mt-3 leading-7 text-muted-foreground">Après avoir renseigné et vérifié la clé utile à votre atelier, choisissez votre type de livre dans « Commence ici ». Vous pourrez revenir sur cette page à tout moment pour remplacer une clé ou changer de fournisseur.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild className="h-auto whitespace-normal py-3"><Link to="/v3/commence-ici">Ouvrir Commence ici<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          <Button asChild variant="outline"><Link to="/v3/discuter-ia">Discuter avec mon IA</Link></Button>
          <Button asChild variant="outline"><Link to="/assistance">Besoin d’aide ?</Link></Button>
        </div>
      </section>
    </div>
  );
}
