import { createServiceClient } from "./supabase";
import { DEFAULT_CONTENT } from "./defaultContent";
import type { SiteContent } from "./types";

const TABLE = "site_content";
const ROW_KEY = "vip_portal";

export async function getContent(): Promise<SiteContent> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("content")
      .eq("key", ROW_KEY)
      .single();

    if (error || !data) return DEFAULT_CONTENT;
    return { ...DEFAULT_CONTENT, ...data.content } as SiteContent;
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function saveContent(content: SiteContent): Promise<boolean> {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from(TABLE)
      .upsert({ key: ROW_KEY, content, updated_at: new Date().toISOString() });
    return !error;
  } catch {
    return false;
  }
}
