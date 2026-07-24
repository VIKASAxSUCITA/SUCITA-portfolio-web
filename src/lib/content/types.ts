import type {
  Insight,
  InsightCategory,
  InsightType,
} from "@/data/insights";
import type { EventItem, EventType } from "@/data/events";
import type { ServiceCategory } from "@/data/services";
import type { siteConfig } from "@/data/site";

export type SiteContent = typeof siteConfig;

export type CmsInsight = Insight & { id: string };

export type CmsEvent = EventItem & { id: string };

export type { InsightCategory, InsightType, EventType, ServiceCategory };
