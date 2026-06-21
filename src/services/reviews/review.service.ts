import { supabase } from "@/integrations/supabase/client";
import { devlog } from "@/utils/security";

const TABLE = "testimonials_images";

export async function getReviewImages(): Promise<string[]> {
  devlog("log", "[testimonials] Fetching image URLs for marquee...");

  const { data, error } = await supabase
    .from(TABLE)
    .select("image_url")
    .order("created_at", { ascending: false });

  if (error) {
    devlog("error", "[testimonials] FETCH ERROR — full object:", error);
    return [];
  }

  const urls = (data ?? []).map((row) => row.image_url).filter(Boolean);
  devlog("log", `[testimonials] Fetched ${urls.length} images.`);
  return urls;
}
