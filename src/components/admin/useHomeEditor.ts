"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { defaultHomeContent } from "@/lib/content/homeDefaults";
import { loadHomeContent, saveHomeContent } from "@/lib/content/homeStore";
import type { HomePageContent } from "@/lib/content/homeTypes";
import {
  getServiceCategories,
  saveServiceCategories,
} from "@/lib/content/servicesStore";
import { getSiteContent, saveSiteContent } from "@/lib/content/siteStore";

export function useHomeEditor() {
  const [content, setContent] = useState<HomePageContent>(() =>
    structuredClone(defaultHomeContent)
  );
  const savedRef = useRef<HomePageContent>(structuredClone(defaultHomeContent));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [home, categories, site] = await Promise.all([
          loadHomeContent(),
          getServiceCategories(),
          getSiteContent(),
        ]);
        if (!active) return;
        const merged: HomePageContent = {
          ...home,
          services: { ...home.services, categories },
          site,
        };
        setContent(merged);
        savedRef.current = merged;
        setDirty(false);
      } catch (error) {
        console.error(error);
        if (active) setMessage("Could not load saved content. Showing defaults.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const update = useCallback((updater: (prev: HomePageContent) => HomePageContent) => {
    setContent((prev) => updater(prev));
    setDirty(true);
    setMessage("");
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setMessage("");
    try {
      await saveHomeContent(content);
      await saveServiceCategories(content.services.categories);
      await saveSiteContent(content.site);
      savedRef.current = content;
      setDirty(false);
      setMessage("Saved.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }, [content]);

  return { content, loading, saving, dirty, message, update, save };
}
