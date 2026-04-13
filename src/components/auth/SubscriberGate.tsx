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

    const run = async () => {
      // Admins bypass subscriber validation (already confirmed by App.tsx)
      if (isAdmin) {
        if (!cancelled) {
          setAllowed(true);
          setChecking(false);
        }
        return;
      }

      // If not yet marked admin by prop, try a quick check with timeout (5s max)
      // Uses in-memory cache so this is instant if App.tsx already checked
      try {
        const adminPromise = getIsCurrentSessionAdmin();
        const timeoutPromise = new Promise<boolean>((resolve) =>
          setTimeout(() => resolve(false), 5000)
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
      } catch {
        // Continue with subscriber validation
      }

      const email = (subscriberEmail || "").trim().toLowerCase();
      const code = (accessCode || "").trim().toUpperCase();

      if (!email || !email.includes("@") || !code) {
        if (!cancelled) {
          onInvalid();
          setAllowed(false);
          setChecking(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("validate-subscription", {
          body: { email, access_code: code },
        });

        if (cancelled) return;

        if (error || !data?.valid) {
          onInvalid();
          setAllowed(false);
          setChecking(false);
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
      } catch {
        if (cancelled) return;
        onInvalid();
        setAllowed(false);
        setChecking(false);
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
    return <Navigate to="/subscription" replace />;
  }

  return <>{children}</>;
}
