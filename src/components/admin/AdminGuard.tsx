"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

type AdminGuardProps = {
  children: React.ReactNode;
  guestOnly?: boolean;
};

export default function AdminGuard({
  children,
  guestOnly = false,
}: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (guestOnly) {
      if (user) router.replace("/admin");
      return;
    }
    if (!user) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, guestOnly, router, pathname]);

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Loading…</p>
      </div>
    );
  }

  if (guestOnly && user) return null;
  if (!guestOnly && !user) return null;

  return <>{children}</>;
}
