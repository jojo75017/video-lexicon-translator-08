import { isPaymentsTestMode } from "@/lib/stripe";

export function PaymentTestModeBanner() {
  if (!isPaymentsTestMode()) return null;
  return (
    <div className="w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800">
      Paiement en mode <strong>test</strong> — utilisez la carte <code className="font-mono">4242 4242 4242 4242</code>, date future, n'importe quel CVC.
    </div>
  );
}
