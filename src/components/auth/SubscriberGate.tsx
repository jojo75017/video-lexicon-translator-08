import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getIsCurrentSessionAdmin } from "@/lib/adminAccess";

const corslessMessage = "Vérification de l'accès...";

type Props = {
  isAdmin: boolean;
  subscriberEmail: string;
  subscriberData: any;
  onInvalid: () => void;
  children: React.ReactNode;
};

/**
 * Security gate for subscriber access.
 *
 * Why: localStorage can be tampered with. We therefore re-validate the pair
 * (email + access_code) with the backend before granting access.
 */
export function SubscriberGate({
  isAdmin,
  subscriberEmail,
  subscriberData,
  onInvalid,
  children,
}: Props) {
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const accessCode = useMemo(() => {
    const code = subscriberData?.access_code;
    return typeof code === "string" ? code.trim() : "";
  }, [subscriberData]);

  useEffect(() => {
    let cancelled = false;

    // Explicit rejection (expired / invalid subscription, missing creds):
    // purge any lingering auth session + cached subscriber data so a stale
    // Supabase session can't re-grant access, then let the component redirect
    // to the subscriber login via <Navigate> below.
    const denyAccess = async () => {
      try {
        await Promise.race([
          supabase.auth.signOut(),
          new Promise((resolve) => setTimeout(resolve, 1500)),
        ]);
      } catch { /* ignore */ }
      try {
        localStorage.removeItem("subscriber_email");
        localStorage.removeItem("subscriber_data");
      } catch { /* ignore */ }
      if (!cancelled) {
        setAllowed(false);
        setChecking(false);
        onInvalid();
      }
    };

    const run = async () => {
      // Admins bypass subscriber validation (already confirmed by App.tsx)
      if (isAdmin) {
        if (!cancelled) {
          setAllowed(true);
          setChecking(false);
        }
        return;
      }

      // If not yet marked admin by prop, try a quick check with timeout (8s max)
      // Uses in-memory cache so this is instant if App.tsx already checked
      try {
        const adminPromise = getIsCurrentSessionAdmin();
        const timeoutPromise = new Promise<boolean>((resolve) =>
          setTimeout(() => resolve(false), 8000)
        );
        const isCurrentSessionAdmin = await Promise.race([adminPromise, timeoutPromise]);

        if (isCurrentSessionAdmin) {
          console.log('SubscriberGate: Admin confirmed via cached/session check');
          if (!cancelled) {
            setAllowed(true);
            setChecking(false);
          }
          return;
        }
        // Note: on ne se contente PAS d'une session Supabase active pour
        // autoriser l'accès — le statut de l'abonné est revérifié plus bas
        // via validate-subscription (sinon un abonné « expired » resterait
        // connecté tant que sa session est valide).
      } catch {
        // Continue with subscriber validation
      }

      const email = (subscriberEmail || "").trim().toLowerCase();
      const code = (accessCode || "").trim().toUpperCase();

      if (!email || !email.includes("@") || !code) {
        await denyAccess();
        return;
      }

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const { data, error } = await supabase.functions.invoke("validate-subscription", {
          body: { email, access_code: code },
        });

        clearTimeout(timeout);

        if (cancelled) return;

        if (error || !data?.valid) {
          // Explicit rejection from the server (e.g. expired) → deny + redirect
          await denyAccess();
          return;
        }

        // Refresh cached subscriber data from backend (prevents stale/forged data)
        localStorage.setItem("subscriber_email", email);
        localStorage.setItem("subscriber_data", JSON.stringify(data.subscriber));

        // Ensure a real auth session exists (needed for RLS-protected saves)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          try {
            const { data: authData } = await supabase.functions.invoke("subscriber-auth", {
              body: { email, access_code: code },
            });
            if (authData?.access_token && authData?.refresh_token) {
              await supabase.auth.setSession({
                access_token: authData.access_token,
                refresh_token: authData.refresh_token,
              });
              console.log("SubscriberGate: Auth session created for subscriber");
            }
          } catch (authErr) {
            console.warn("SubscriberGate: Could not create auth session:", authErr);
          }
        }

        setAllowed(true);
        setChecking(false);
      } catch (networkErr) {
        if (cancelled) return;
        console.warn("SubscriberGate: Network validation failed:", networkErr);
        await denyAccess();
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, subscriberEmail, accessCode, onInvalid]);

  if (checking) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        {corslessMessage}
      </main>
    );
  }

  if (!allowed) {
    return <Navigate to="/connexion-abonne" replace />;
  }

  return <>{children}</>;
}
