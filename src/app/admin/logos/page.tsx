"use client";

import { useEffect, useRef, useState } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminShell from "@/components/admin/AdminShell";
import {
  appendLogoItem,
  newLogoId,
  normalizeLogoList,
  removeLogoItem,
  subscribeLogoGroup,
  type LogoGroup,
} from "@/lib/content/logosStore";
import {
  adminDeleteBlobUrls,
  adminUploadFile,
} from "@/lib/content/adminClient";
import type { BrandLogo } from "@/data/partners";

const UPLOAD_FOLDER: Record<LogoGroup, "partner" | "client"> = {
  partners: "partner",
  clients: "client",
};

function LogoGrid({
  title,
  hint,
  items,
  onAdd,
  onDelete,
  uploading,
  busyIds,
}: {
  title: string;
  hint: string;
  items: BrandLogo[];
  onAdd: (file: File) => Promise<void>;
  onDelete: (id: string) => void;
  uploading?: boolean;
  busyIds?: Set<string>;
}) {
  return (
    <section className="admin-cms-panel admin-logos-section">
      <div className="admin-logos-head">
        <div>
          <h2 className="admin-logos-title">{title}</h2>
          <p className="admin-logos-hint">{hint}</p>
        </div>
        <label className="admin-btn admin-btn-secondary admin-logos-add">
          {uploading ? "Uploading…" : "+ Add image"}
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void onAdd(file);
            }}
          />
        </label>
      </div>

      {items.length === 0 ? (
        <p className="admin-cms-empty">No logos yet.</p>
      ) : (
        <ul className="admin-logos-grid list-unstyled">
          {items.map((item) => {
            const itemBusy = Boolean(busyIds?.has(item.id));
            return (
              <li key={item.id} className="admin-logos-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.logo} alt="" loading="eager" decoding="async" />
                <button
                  type="button"
                  className="admin-btn admin-btn-danger admin-logos-delete"
                  onClick={() => onDelete(item.id)}
                  disabled={itemBusy || uploading}
                >
                  {itemBusy ? "Removing…" : "Delete"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function AdminLogosPage() {
  const [partners, setPartners] = useState<BrandLogo[]>([]);
  const [clients, setClients] = useState<BrandLogo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingGroup, setUploadingGroup] = useState<LogoGroup | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(() => new Set());
  const [message, setMessage] = useState("");

  const partnersRef = useRef(partners);
  const clientsRef = useRef(clients);
  partnersRef.current = partners;
  clientsRef.current = clients;

  useEffect(() => {
    let gotPartners = false;
    let gotClients = false;
    const maybeDone = () => {
      if (gotPartners && gotClients) setLoading(false);
    };

    const unsubPartners = subscribeLogoGroup(
      "partners",
      (items) => {
        setPartners(items);
        gotPartners = true;
        maybeDone();
      },
      (error) => {
        setMessage(error.message);
        gotPartners = true;
        maybeDone();
      }
    );
    const unsubClients = subscribeLogoGroup(
      "clients",
      (items) => {
        setClients(items);
        gotClients = true;
        maybeDone();
      },
      (error) => {
        setMessage(error.message);
        gotClients = true;
        maybeDone();
      }
    );

    return () => {
      unsubPartners();
      unsubClients();
    };
  }, []);

  function setGroupItems(group: LogoGroup, items: BrandLogo[]) {
    const normalized = normalizeLogoList(
      items,
      group === "partners" ? "p" : "c"
    );
    if (group === "partners") {
      partnersRef.current = normalized;
      setPartners(normalized);
    } else {
      clientsRef.current = normalized;
      setClients(normalized);
    }
  }

  async function handleAdd(group: LogoGroup, file: File) {
    const previewUrl = URL.createObjectURL(file);
    const tempId = `temp_${Date.now().toString(36)}`;
    const previous =
      group === "partners" ? partnersRef.current : clientsRef.current;

    setGroupItems(group, [
      { id: tempId, name: "Logo", logo: previewUrl },
      ...previous,
    ]);
    setUploadingGroup(group);
    setMessage("");

    try {
      const logo = await adminUploadFile(file, {
        folder: UPLOAD_FOLDER[group],
      });
      const item: BrandLogo = {
        id: newLogoId(group),
        name: "Logo",
        logo,
      };
      await appendLogoItem(group, item);
      // Live listener will refresh the real list
      setMessage(
        group === "partners" ? "Partner logo added." : "Client logo added."
      );
    } catch (error) {
      setGroupItems(group, previous);
      window.alert(
        error instanceof Error ? error.message : "Could not add that image."
      );
    } finally {
      URL.revokeObjectURL(previewUrl);
      setUploadingGroup(null);
    }
  }

  async function handleDelete(group: LogoGroup, id: string) {
    const confirmed = window.confirm(
      "Remove this logo from the site and delete the file from storage?"
    );
    if (!confirmed) return;

    const previous =
      group === "partners" ? partnersRef.current : clientsRef.current;
    const target = previous.find((item) => item.id === id);
    if (!target) return;

    setGroupItems(
      group,
      previous.filter((item) => item.id !== id)
    );
    setBusyIds((prev) => new Set(prev).add(id));
    setMessage("");

    try {
      await removeLogoItem(group, id);
      if (target.logo) {
        try {
          // Strip cache-bust query before deleting the real Blob object
          const clean = target.logo.split("?")[0] ?? target.logo;
          await adminDeleteBlobUrls([clean]);
        } catch (error) {
          console.warn("Blob delete skipped:", error);
        }
      }
      setMessage(
        group === "partners" ? "Partner logo removed." : "Client logo removed."
      );
    } catch (error) {
      setGroupItems(group, previous);
      window.alert(
        error instanceof Error ? error.message : "Could not remove that logo."
      );
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <AdminGuard>
      <AdminShell pageTitle="Partners & Clients" message={message}>
        <div className="admin-cms admin-logos-page">
          {loading ? (
            <p className="admin-cms-empty">Loading logos…</p>
          ) : (
            <>
              <p className="admin-logos-intro">
                Live from Firestore. Add/delete updates instantly. Images upload
                to Blob (<code>sucita/partner</code> / <code>sucita/client</code>
                ).
              </p>
              <LogoGrid
                title="Partners"
                hint="Shown in the Partners marquee on Home and Partners pages."
                items={partners}
                uploading={uploadingGroup === "partners"}
                busyIds={busyIds}
                onAdd={(file) => handleAdd("partners", file)}
                onDelete={(id) => void handleDelete("partners", id)}
              />
              <LogoGrid
                title="Clients"
                hint="Shown in the Clients marquee on Home and Partners pages."
                items={clients}
                uploading={uploadingGroup === "clients"}
                busyIds={busyIds}
                onAdd={(file) => handleAdd("clients", file)}
                onDelete={(id) => void handleDelete("clients", id)}
              />
            </>
          )}
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
