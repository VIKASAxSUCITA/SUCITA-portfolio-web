"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <AdminGuard guestOnly>
      <div className="admin-login-page">
        <AdminLoginForm />
      </div>
    </AdminGuard>
  );
}
