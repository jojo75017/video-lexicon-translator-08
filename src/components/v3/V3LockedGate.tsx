import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { getIsCurrentSessionAdmin } from "@/lib/adminAccess";
import { V3_LAUNCH_UNLOCKED } from "@/config/v3Launch";

/**
 * Verrouille une route V3 tant que `V3_LAUNCH_UNLOCKED = false`.
 * Les admins passent toujours.
 * Les autres sont redirigés vers /v3/offre avec un toast informatif.
 */
export function V3LockedGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  if (!V3_LAUNCH_UNLOCKED) {
    return <Navigate to="/v3/offre" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
}


export default V3LockedGate;
