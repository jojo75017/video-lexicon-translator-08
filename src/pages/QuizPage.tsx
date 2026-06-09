import { useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  QUIZ_QUESTIONS,
  PROFILES,
  computeProfile,
  type ProfileKey,
} from "@/data/authorQuiz";
import { BookOpen, ArrowRight, CheckCircle2, Sparkles, Loader2 } from "lucide-react";

type Step = "intro" | "questions" | "capture" | "result";

const QuizPage = () => {
  const [searchParams] = useSearchParams();
  const quizSource = searchParams.get("source") || "direct";
  const [step, setStep] = useState<Step>("intro");
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<ProfileKey, number>>({
    methodique: 0,
    createur: 0,
    pragmatique: 0,
    perfectionniste: 0,
  });
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);

  const profileKey = useMemo(() => computeProfile(scores), [scores]);
  const profile = PROFILES[profileKey];

  const handleAnswer = (optionIdx: number) => {
    const q = QUIZ_QUESTIONS[current];
    const opt = q.options[optionIdx];
    setScores((prev) => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(opt.scores)) {
        next[k as ProfileKey] = (next[k as ProfileKey] || 0) + (v || 0);
      }
      return next;
    });
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setStep("capture");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email invalide", { description: "Vérifiez votre adresse email." });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("quiz-lead", {
        body: {
          email: email.trim().toLowerCase(),
          first_name: firstName.trim(),
          profile_key: profile.key,
          profile_title: profile.title,
          tag: profile.tag,
          website,
          landing_url: window.location.href,
        },
      });
      if (error) throw error;
      setStep("result");
    } catch (err) {
      console.error(err);
      // On affiche quand même le résultat pour ne pas frustrer le prospect
      toast("Voici votre résultat !");
      setStep("result");
    } finally {
      setSubmitting(false);
    }
  };

  const progress =
    step === "questions"
      ? ((current + 1) / QUIZ_QUESTIONS.length) * 100
      : step === "capture"
      ? 100
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Quiz : Quel auteur êtes-vous ? | EbookStudio</title>
        <meta
          name="description"
          content="Découvrez en 2 minutes votre profil d'auteur et la méthode idéale pour enfin écrire et publier votre livre avec EbookStudio."
        />
        <link rel="canonical" href="https://www.ebookstudio.fr/quiz" />
      </Helmet>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link to="/offres" className="flex items-center gap-2 text-primary font-bold mb-8">
          <BookOpen className="h-6 w-6" />
          EbookStudio
        </Link>

        {step !== "intro" && step !== "result" && (
          <Progress value={progress} className="mb-8 h-2" />
        )}

        {step === "intro" && (
          <Card className="p-8 text-center">
            <Sparkles className="mx-auto h-12 w-12 text-primary" />
            <h1 className="mt-4 text-3xl font-bold">Quel auteur êtes-vous ?</h1>
            <p className="mt-3 text-muted-foreground">
              Répondez à 6 questions rapides et découvrez votre profil d'auteur unique —
              ainsi que la méthode idéale pour enfin écrire et publier votre livre.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">⏱️ Moins de 2 minutes</p>
            <Button size="lg" className="mt-6" onClick={() => setStep("questions")}>
              Démarrer le quiz <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Card>
        )}

        {step === "questions" && (
          <Card className="p-8">
            <p className="text-sm font-medium text-primary">
              Question {current + 1} / {QUIZ_QUESTIONS.length}
            </p>
            <h2 className="mt-2 text-2xl font-bold">{QUIZ_QUESTIONS[current].question}</h2>
            <div className="mt-6 space-y-3">
              {QUIZ_QUESTIONS[current].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary hover:bg-accent/10"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === "capture" && (
          <Card className="p-8">
            <CheckCircle2 className="h-10 w-10 text-primary" />
            <h2 className="mt-3 text-2xl font-bold">Votre profil est prêt ! 🎉</h2>
            <p className="mt-2 text-muted-foreground">
              Indiquez votre prénom et email pour découvrir votre profil d'auteur
              et recevoir vos conseils personnalisés.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                placeholder="Votre prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={80}
              />
              <Input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
              />
              {/* Honeypot anti-bot */}
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calcul du résultat…</>
                ) : (
                  <>Découvrir mon profil <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Vos données restent confidentielles. Aucun spam.
              </p>
            </form>
          </Card>
        )}

        {step === "result" && (
          <Card className="p-8 text-center">
            <div className="text-5xl">{profile.emoji}</div>
            <p className="mt-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Votre profil d'auteur
            </p>
            <h2 className="mt-1 text-3xl font-bold">{profile.title}</h2>
            <p className="mt-2 text-lg text-primary">{profile.tagline}</p>
            <p className="mt-4 text-left text-muted-foreground">{profile.description}</p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {profile.strengths.map((s) => (
                <span key={s} className="rounded-full bg-accent/15 px-3 py-1 text-sm font-medium text-accent-foreground">
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-primary/30 bg-primary/5 p-5 text-left">
              <p className="font-semibold text-primary">La méthode faite pour vous</p>
              <p className="mt-1 text-muted-foreground">{profile.advice}</p>
            </div>

            <Button asChild size="lg" className="mt-8 w-full">
              <Link to="/offres">
                Découvrir EbookStudio <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
