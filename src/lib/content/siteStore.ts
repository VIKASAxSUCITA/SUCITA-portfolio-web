import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { siteConfig as defaultSite } from "@/data/site";
import type { SiteContent } from "./types";

const REF = ["pages", "site"] as const;

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const snap = await getDoc(doc(getFirebaseDb(), ...REF));
    if (!snap.exists()) return { ...defaultSite };
    const data = snap.data() as Partial<SiteContent>;
    return {
      name: String(data.name ?? defaultSite.name),
      tagline: String(data.tagline ?? defaultSite.tagline),
      email: String(data.email ?? defaultSite.email),
      phone: String(data.phone ?? defaultSite.phone),
      whatsapp: String(data.whatsapp ?? defaultSite.whatsapp),
      telegram: String(data.telegram ?? defaultSite.telegram),
      officeHours: String(data.officeHours ?? defaultSite.officeHours),
      address: String(data.address ?? defaultSite.address),
      footerCopy: String(data.footerCopy ?? defaultSite.footerCopy),
    };
  } catch {
    return { ...defaultSite };
  }
}

export async function saveSiteContent(content: SiteContent) {
  await setDoc(
    doc(getFirebaseDb(), ...REF),
    { ...content, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
