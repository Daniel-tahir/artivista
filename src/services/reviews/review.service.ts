import { supabase } from "@/integrations/supabase/client";

const TABLE = "review_images";

export async function getReviewImages(): Promise<string[]> {
  console.log("[review] Fetching active review images...");

  const { data, error } = await supabase
    .from(TABLE)
    .select("image_url")
    .eq("is_active", true)
    .order("position", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[review] FETCH ERROR — full object:", error);
    return [];
  }

  const urls = (data ?? []).map((row) => row.image_url).filter(Boolean);
  console.log(`[review] Fetched ${urls.length} active images.`);
  return urls;
}
