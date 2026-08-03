import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./config";

const STORAGE_KEY = "sucita-locale";

export async function getRequestLocale(): Promise<Locale> {
  const jar = await cookies();
  const value = jar.get(STORAGE_KEY)?.value;
  return isLocale(value) ? value : defaultLocale;
}
