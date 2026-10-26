import { supabase } from "./supabaseClient";

export async function uploadLogo(userId: string, file: File) {
  if (!supabase) throw new Error("Supabase no está configurado");
  const ext = file.name.split(".").pop() || "png";
  const path = `${userId}/logo.${ext}`;
  const { error } = await supabase.storage.from("logos").upload(path, file, {
    upsert: true,
    contentType: file.type || "image/png",
  });
  if (error) throw error;
  const { data } = supabase.storage.from("logos").getPublicUrl(path);
  return data.publicUrl;
}
