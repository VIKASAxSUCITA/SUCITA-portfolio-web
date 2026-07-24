import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import { defaultHomeContent, mergeHomeContent } from "./homeDefaults";
import type { HomePageContent } from "./homeTypes";

const REF = ["pages", "home"] as const;

export async function loadHomeContent(): Promise<HomePageContent> {
  try {
    const snap = await getDoc(doc(getFirebaseDb(), ...REF));
    if (!snap.exists()) return structuredClone(defaultHomeContent);
    return mergeHomeContent(snap.data() as Partial<HomePageContent>);
  } catch {
    return structuredClone(defaultHomeContent);
  }
}

export async function saveHomeContent(content: HomePageContent) {
  await setDoc(
    doc(getFirebaseDb(), ...REF),
    { ...content, updatedAt: serverTimestamp() },
    { merge: true }
  );
}
