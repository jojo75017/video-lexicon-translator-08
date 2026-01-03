import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Shield, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  feature?: string;
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'free',
  feature,
  fallback,
}) => {
  const { isAuthenticated, isLoading, hasRole, canAccess } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/saas/login" state={{ from: location }} replace />;
  }

  const hasAccess = feature ? canAccess(feature) : hasRole(requiredRole);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-amber-500" />
            </div>
            <CardTitle>Upgrade Required</CardTitle>
            <CardDescription>
              This feature requires a {requiredRole === 'admin' ? 'Admin' : 'Pro'} plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Upgrade your account to access this feature and unlock more capabilities.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => window.history.back()}>
                Go Back
              </Button>
              <Button className="flex-1">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

interface RoleGateProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  fallback?: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({ children, requiredRole, fallback }) => {
  const { hasRole } = useAuth();

  if (!hasRole(requiredRole)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

interface FeatureGateProps {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ children, feature, fallback }) => {
  const { canAccess } = useAuth();

  if (!canAccess(feature)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
