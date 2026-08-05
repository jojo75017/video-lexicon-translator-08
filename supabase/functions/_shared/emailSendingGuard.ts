export const EMAIL_SENDING_ENABLED = Deno.env.get("EMAIL_SENDING_ENABLED") === "true";

export function emailSendingBlockedResult() {
  return {
    success: false,
    sent: 0,
    blocked: true,
    reason: "domain_pending_validation",
    message: "Envoi suspendu : le domaine email n'est pas encore validé.",
  };
}