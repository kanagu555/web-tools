import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface PageProps {
  params: {
    shortCode: string;
  };
}

export default async function ShortUrlRedirect({ params }: PageProps) {
  const { shortCode } = params;

  try {
    // Fetch the long URL from Supabase
    const { data, error } = await supabase
      .from("url_shortener")
      .select("long_url")
      .eq("short_code", shortCode)
      .single();

    if (error || !data) {
      // If not found, redirect to home or show 404
      redirect("/");
    }

    // Redirect to the long URL
    redirect(data.long_url);
  } catch (error) {
    console.error("Error redirecting:", error);
    redirect("/");
  }
}
