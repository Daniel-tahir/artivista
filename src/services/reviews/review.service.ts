import { supabase } from "@/integrations/supabase/client";

const TABLE = "testimonials_images";

export async function getReviewImages(): Promise<string[]> {
  console.log("[testimonials] Fetching image URLs for marquee...");

  const { data, error } = await supabase
    .from(TABLE)
    .select("image_url")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[testimonials] FETCH ERROR — full object:", error);
    return [];
  }

  const urls = (data ?? []).map((row) => row.image_url).filter(Boolean);
  console.log(`[testimonials] Fetched ${urls.length} images.`);
  return urls;
}
