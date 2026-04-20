/**
 * Centralized client-side error logger.
 * Sends errors to the log-client-error edge function.
 * Fails silently — never throws to avoid cascading errors.
 */
import { supabase } from "@/integrations/supabase/client";

type Severity = "info" | "warning" | "error" | "critical";

interface LogErrorParams {
  type: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  severity?: Severity;
}

// Local rate limit: max 1 same error / 30s to avoid spamming the backend
const recentErrors = new Map<string, number>();
const DEDUPE_WINDOW_MS = 30_000;

export async function logError(params: LogErrorParams): Promise<void> {
  try {
    const key = `${params.type}::${params.message}`.slice(0, 300);
    const now = Date.now();
    const last = recentErrors.get(key);
    if (last && now - last < DEDUPE_WINDOW_MS) return;
    recentErrors.set(key, now);

    // Best-effort cleanup
    if (recentErrors.size > 100) {
      for (const [k, t] of recentErrors.entries()) {
        if (now - t > DEDUPE_WINDOW_MS) recentErrors.delete(k);
      }
    }

    const subscriberEmail =
      typeof window !== "undefined" ? localStorage.getItem("subscriber_email") : null;

    await supabase.functions.invoke("log-client-error", {
      body: {
        error_type: params.type,
        error_message: params.message,
        error_stack: params.stack,
        context: params.context || {},
        url: typeof window !== "undefined" ? window.location.href : null,
        user_email: subscriberEmail,
        severity: params.severity || "error",
      },
    });
  } catch {
    // never throw from a logger
  }
}

/**
 * Install global handlers to capture unhandled errors and promise rejections.
 * Called once at app boot.
 */
export function installGlobalErrorHandlers(): void {
  if (typeof window === "undefined") return;
  if ((window as any).__errorHandlersInstalled) return;
  (window as any).__errorHandlersInstalled = true;

  window.addEventListener("error", (event) => {
    logError({
      type: "window.error",
      message: event.message || "Unknown error",
      stack: event.error?.stack,
      context: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
      severity: "error",
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    logError({
      type: "unhandledrejection",
      message: reason?.message || String(reason).slice(0, 500) || "Unhandled rejection",
      stack: reason?.stack,
      severity: "error",
    });
  });
}
