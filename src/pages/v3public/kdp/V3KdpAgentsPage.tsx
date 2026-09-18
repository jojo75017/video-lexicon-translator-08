import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Copy, Loader2, MessageCircle, RotateCcw, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { callAIWriting, isAIConfigured } from '@/services/aiWritingService';
import { listerLivres, resumeBibliotheque } from '@/lib/kdp/bibliotheque';
import hectorImg from '@/assets/agent-kdp-hector.png';
import margauxImg from '@/assets/agent-kdp-margaux.png';
import biblioImg from '@/assets/agent-kdp-biblio.png';

type AgentId = 'hector' | 'margaux' | 'biblio';

interface Agent {
  id: AgentId;
  prenom: string;
  role: string;
  ton: string;
  presentation: string;
  accroche: string;
  image: string;
  exemples: string[];
  systeme: string;
}

const AGENTS: Agent[] = [
  {
    id: 'hector',
    prenom: 'Hector',
    role: 'Conseiller ventes et visibilité',
    ton: 'Direct, concret, orienté résultats',
    presentation:
      'Hector va droit au but. Il vous dit quoi corriger en premier sur votre fiche, votre titre ou votre publicité, et dans quel ordre agir cette semaine.',
    accroche: 'Vous voulez savoir quoi faire maintenant : Hector répond en priorités claires.',
    image: hectorImg,
    exemples: [
      'Mon livre ne se vend pas depuis trois semaines, par quoi je commence ?',
      'Mon titre est-il assez clair pour un lecteur qui me découvre ?',
      'Quel budget de départ raisonnable pour une première campagne Amazon ?',
    ],
    systeme:
      "Tu es Hector, conseiller Amazon KDP d'Ebookstudio. Tu écris uniquement en français simple, sans jargon, sans mot latin ni mot inventé. Ton style est direct : tu donnes 2 ou 3 priorités concrètes, dans l'ordre, avec ce que l'auteur doit écrire ou changer. Tu n'inventes jamais de chiffre de ventes, de volume de recherche, de pourcentage ni de classement : quand une donnée est inconnue, tu le dis et tu proposes comment la vérifier. Tu restes sur les sujets KDP : écriture, fiche produit, mots-clés, couverture, prix, publicité, lancement, catégories. Tes réponses tiennent en moins de 250 mots.",
  },
  {
    id: 'margaux',
    prenom: 'Margaux',
    role: 'Accompagnatrice des auteurs débutants',
    ton: 'Pédagogue, patiente, rassurante',
    presentation:
      'Margaux explique chaque étape pas à pas, sans supposer que vous connaissez déjà Amazon. Elle reformule, donne un exemple, puis la prochaine action.',
    accroche: 'Vous débutez ou vous êtes bloqué sur une étape : Margaux déroule le chemin avec vous.',
    image: margauxImg,
    exemples: [
      'Je publie mon premier livre, expliquez-moi les étapes dans l’ordre.',
      'Je ne comprends pas les 7 mots-clés KDP, aidez-moi avec mon sujet.',
      'Comment écrire une description de vente quand on n’a jamais vendu ?',
    ],
    systeme:
      "Tu es Margaux, accompagnatrice Amazon KDP d'Ebookstudio. Tu écris uniquement en français simple, sans jargon, sans mot latin ni mot inventé. Ton style est pédagogue : tu expliques pas à pas, tu donnes un exemple court, puis la prochaine action à faire. Tu n'inventes jamais de chiffre de ventes, de volume de recherche, de pourcentage ni de classement : quand une donnée est inconnue, tu le dis et tu proposes comment la vérifier. Tu restes sur les sujets KDP : écriture, fiche produit, mots-clés, couverture, prix, publicité, lancement, catégories. Tes réponses tiennent en moins de 250 mots.",
  },
  {
    id: 'biblio',
    prenom: 'Biblio',
    role: 'Gardien de votre catalogue',
    ton: 'Posé, organisé, méthodique',
    presentation:
      'Biblio connaît les livres enregistrés dans votre bibliothèque. Il vous dit lequel travailler en premier, ce qui manque sur une fiche, et dans quel ordre avancer sur votre catalogue.',
    accroche: 'Vous avez plusieurs livres en ligne : Biblio met de l’ordre dans le travail à faire.',
    image: biblioImg,
    exemples: [
      'Par quel livre de ma bibliothèque devrais-je commencer cette semaine ?',
      'Mes titres se ressemblent-ils trop entre eux ?',
      'Quel livre mérite une nouvelle description en priorité ?',
    ],
    systeme:
      "Tu es Biblio, le gardien du catalogue d'un auteur indépendant sur Ebookstudio. Tu écris uniquement en français simple, sans jargon, sans mot latin ni mot inventé. Tu raisonnes uniquement sur les livres listés dans la bibliothèque de l'auteur, telle qu'elle t'est fournie : tu ne parles jamais d'un livre absent de cette liste. Tu n'inventes jamais de chiffre de ventes, de volume de recherche, de pourcentage ni de classement : tu n'utilises que les données fournies, et quand une donnée manque tu le dis et proposes comment la vérifier. Tu organises : quel livre travailler en premier, ce qui manque sur une fiche, les répétitions ou incohérences entre les titres, l'ordre des actions. Tes réponses tiennent en moins de 250 mots.",
  },
];

interface ChatMessage {
  role: 'auteur' | 'agent';
  texte: string;
}

const storageKey = (id: AgentId) => `v3:kdp:agents:conversation:${id}`;

function readConversation(id: AgentId): ChatMessage[] {
  try {
    const raw = localStorage.getItem(storageKey(id));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.slice(-40) : [];
  } catch {
    return [];
  }
}

export default function V3KdpAgentsPage() {
  const [agentActif, setAgentActif] = useState<AgentId | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [enCours, setEnCours] = useState(false);
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const champRef = useRef<HTMLTextAreaElement | null>(null);

  const agent = AGENTS.find((a) => a.id === agentActif) ?? null;

  useEffect(() => {
    if (!agentActif) return;
    setMessages(readConversation(agentActif));
    setQuestion('');
    window.setTimeout(() => champRef.current?.focus(), 80);
  }, [agentActif]);

  useEffect(() => {
    if (!agentActif) return;
    try { localStorage.setItem(storageKey(agentActif), JSON.stringify(messages.slice(-40))); } catch { /* stockage indisponible */ }
    zoneRef.current?.scrollTo({ top: zoneRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, agentActif]);

  const envoyer = async (texte: string) => {
    if (!agent || enCours) return;
    const propre = texte.trim();
    if (propre.length < 3) {
      toast.error('Écrivez votre question en quelques mots.');
      return;
    }
    if (!isAIConfigured()) {
      toast.error('Ajoutez d’abord votre clé IA dans « Mes clés ».');
      return;
    }
    const suite: ChatMessage[] = [...messages, { role: 'auteur', texte: propre }];
    setMessages(suite);
    setQuestion('');
    setEnCours(true);
    try {
      const historique = suite
        .slice(-12)
        .map((m) => `${m.role === 'auteur' ? 'AUTEUR' : agent.prenom.toUpperCase()} : ${m.texte}`)
        .join('\n\n');
      const reponse = await callAIWriting(
        `Conversation en cours entre un auteur indépendant et toi.\n\n${historique}\n\nRéponds maintenant à la dernière question de l'auteur, en français, sans répéter la question.`,
        { systemPrompt: agent.systeme, temperature: 0.7, maxTokens: 1400 },
      );
      const propreReponse = (reponse || '').trim();
      if (!propreReponse) throw new Error('Réponse vide.');
      setMessages((prev) => [...prev, { role: 'agent', texte: propreReponse }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Réponse impossible pour le moment.';
      setMessages((prev) => [...prev, { role: 'agent', texte: `Je n’ai pas pu répondre : ${message}` }]);
    } finally {
      setEnCours(false);
      window.setTimeout(() => champRef.current?.focus(), 60);
    }
  };

  const copierConversation = async () => {
    if (!agent) return;
    const texte = messages.map((m) => `${m.role === 'auteur' ? 'Moi' : agent.prenom} : ${m.texte}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(texte);
      toast.success('Conversation copiée');
    } catch {
      toast.error('Copie impossible dans ce navigateur.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <Helmet>
        <title>Parler avec l’IA — vos deux conseillers KDP | Ebookstudio</title>
        <meta
          name="description"
          content="Deux conseillers IA pour vos livres Amazon KDP : Hector, direct et orienté ventes, et Margaux, pédagogue pour les débutants. Posez votre question, la réponse arrive en français."
        />
      </Helmet>

      <Link to="/v3/kdp" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>
        <ArrowLeft className="h-4 w-4" /> Retour à l’espace KDP
      </Link>

      <h1 className="text-[26px] font-black leading-tight" style={{ color: 'var(--v3-ink)' }}>
        Parler avec l’IA : choisissez votre conseiller
      </h1>
      <p className="mt-2 max-w-3xl text-[14px]" style={{ color: 'var(--v3-muted)' }}>
        Deux façons d’être aidé sur vos livres Amazon. Le même savoir-faire, deux manières de vous parler.
        Vos échanges restent dans ce navigateur, rien n’est publié.
      </p>

      <div className="mt-6 space-y-4">
        {AGENTS.map((a) => {
          const ouvert = agentActif === a.id;
          return (
            <div
              key={a.id}
              className="rounded-2xl border p-4 sm:p-5"
              style={{ borderColor: ouvert ? 'var(--v3-emerald)' : 'var(--v3-line)', background: ouvert ? 'var(--v3-cream)' : 'var(--v3-paper)' }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src={a.image}
                  alt={`${a.prenom}, conseiller IA`}
                  loading="lazy"
                  width={816}
                  height={816}
                  className="h-28 w-28 shrink-0 self-start rounded-xl object-contain sm:self-center"
                  style={{ background: 'var(--v3-cream)' }}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[19px] font-black" style={{ color: 'var(--v3-ink)' }}>{a.prenom}</p>
                  <p className="text-[12.5px] font-semibold" style={{ color: 'var(--v3-emerald)' }}>{a.role} · {a.ton}</p>
                  <p className="mt-2 text-[13.5px]" style={{ color: 'var(--v3-ink)' }}>{a.presentation}</p>
                  <p className="mt-1 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>{a.accroche}</p>
                </div>
                <Button
                  type="button"
                  onClick={() => setAgentActif(ouvert ? null : a.id)}
                  className="v3-btn h-11 shrink-0 gap-2 px-5 [background:var(--v3-action-orange)!important] [color:var(--v3-action-orange-text)!important] hover:[background:var(--v3-action-orange-hover)!important]"
                >
                  <MessageCircle className="h-4 w-4" />
                  {ouvert ? 'Fermer la discussion' : `Parler avec ${a.prenom}`}
                </Button>
              </div>

              {ouvert && agent && (
                <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--v3-line)' }}>
                  {messages.length === 0 && (
                    <div className="mb-3">
                      <p className="text-[12.5px] font-bold" style={{ color: 'var(--v3-ink)' }}>Vous pouvez demander par exemple :</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {a.exemples.map((ex) => (
                          <button
                            key={ex}
                            type="button"
                            onClick={() => void envoyer(ex)}
                            className="rounded-full border px-3 py-1.5 text-left text-[12px]"
                            style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-paper)', color: 'var(--v3-ink)' }}
                          >
                            {ex}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {messages.length > 0 && (
                    <div
                      ref={zoneRef}
                      className="max-h-[420px] space-y-3 overflow-y-auto rounded-xl border p-3"
                      style={{ borderColor: 'var(--v3-line)', background: 'var(--v3-paper)' }}
                    >
                      {messages.map((m, i) => (
                        <div key={i} className={m.role === 'auteur' ? 'flex justify-end' : ''}>
                          <div
                            className="max-w-[88%] whitespace-pre-wrap rounded-xl px-3 py-2 text-[13.5px]"
                            style={
                              m.role === 'auteur'
                                ? { background: 'var(--v3-action-orange)', color: 'var(--v3-action-orange-text)' }
                                : { background: 'var(--v3-cream)', color: 'var(--v3-ink)' }
                            }
                          >
                            {m.role === 'agent' && (
                              <span className="mb-1 block text-[11px] font-bold" style={{ color: 'var(--v3-emerald)' }}>{a.prenom}</span>
                            )}
                            {m.texte}
                          </div>
                        </div>
                      ))}
                      {enCours && (
                        <p className="inline-flex items-center gap-2 text-[12.5px]" style={{ color: 'var(--v3-muted)' }}>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> {a.prenom} rédige sa réponse…
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-3">
                    <Textarea
                      ref={champRef}
                      rows={3}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          void envoyer(question);
                        }
                      }}
                      placeholder={`Écrivez votre question à ${a.prenom}…`}
                      className="text-[13.5px]"
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        onClick={() => void envoyer(question)}
                        disabled={enCours || question.trim().length < 3}
                        className="v3-btn h-10 gap-2 [background:var(--v3-action-orange)!important] [color:var(--v3-action-orange-text)!important] hover:[background:var(--v3-action-orange-hover)!important] disabled:opacity-60"
                      >
                        {enCours ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Envoyer ma question
                      </Button>
                      {messages.length > 0 && (
                        <>
                          <Button type="button" variant="outline" onClick={() => void copierConversation()} className="gap-1.5 border-[var(--v3-emerald)] [background:var(--v3-paper)!important] [color:var(--v3-ink)!important]">
                            <Copy className="h-4 w-4" /> Copier la conversation
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setMessages([])} className="gap-1.5 border-[var(--v3-emerald)] [background:var(--v3-paper)!important] [color:var(--v3-ink)!important]">
                            <RotateCcw className="h-4 w-4" /> Recommencer
                          </Button>
                        </>
                      )}
                    </div>
                    <p className="mt-2 text-[11px]" style={{ color: 'var(--v3-muted)' }}>
                      Les conseils restent des conseils : vérifiez toujours vos chiffres réels dans votre compte KDP.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
