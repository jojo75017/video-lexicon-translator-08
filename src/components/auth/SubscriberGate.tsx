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
      // Admins bypass subscriber validation.
      if (isAdmin) {
        if (!cancelled) {
          setAllowed(true);
          setChecking(false);
        }
        return;
      }

      // Double-check: if there's an active Supabase session, verify admin status directly via DB
      try {
        const isCurrentSessionAdmin = await getIsCurrentSessionAdmin();
        if (isCurrentSessionAdmin) {
          console.log('SubscriberGate: Admin confirmed via secure session check');
          if (!cancelled) {
            setAllowed(true);
            setChecking(false);
          }
          return;
        }
      } catch (err) {
        console.log('SubscriberGate: Session check failed, continuing with subscriber validation');
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
    // Keep it minimal to avoid any UI flash.
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
