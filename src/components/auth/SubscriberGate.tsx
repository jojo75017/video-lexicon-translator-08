import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
// Email admin permanent - bypass total même sans session
const PERMANENT_ADMIN_EMAIL = 'boubetgeorges@gmail.com';

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

  // Check if permanent admin via localStorage OR subscriberEmail (bypass session requirement)
  const isPermanentAdmin = useMemo(() => {
    const storedAdminEmail = localStorage.getItem('permanent_admin_email');
    const emailToCheck = storedAdminEmail || subscriberEmail;
    const isAdmin = emailToCheck?.toLowerCase() === PERMANENT_ADMIN_EMAIL.toLowerCase();
    
    // Auto-store admin email if detected
    if (isAdmin && !storedAdminEmail) {
      localStorage.setItem('permanent_admin_email', PERMANENT_ADMIN_EMAIL);
    }
    
    return isAdmin;
  }, [subscriberEmail]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Admins bypass subscriber validation (via session OR permanent email).
      if (isAdmin || isPermanentAdmin) {
        if (!cancelled) {
          setAllowed(true);
          setChecking(false);
        }
        return;
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
