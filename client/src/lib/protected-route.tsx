import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { Route, Redirect } from "wouter";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType<any>;
}

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  
  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }
        
        if (!user) {
          return <Redirect to="/auth" />;
        }
        
        // If user is a family member attempting to access non-family routes
        if (user.role === "family" && path !== "/family-portal" && path !== "/") {
          return <Redirect to="/family-portal" />;
        }
        
        // If user is a physician attempting to access family routes
        if (user.role === "physician" && path === "/family-portal") {
          return <Redirect to="/" />;
        }
        
        return <Component />;
      }}
    </Route>
  );
}