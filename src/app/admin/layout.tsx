import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="admin-root">{children}</div>
    </AuthProvider>
  );
}
