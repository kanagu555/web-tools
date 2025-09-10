"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function ShortUrlRedirect() {
  const params = useParams();
  const shortCode = params.shortCode as string;
  const [longUrl, setLongUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const result = await supabase
          .from("url_shortener")
          .select("long_url")
          .eq("short_code", shortCode)
          .single();

        if (result.error || !result.data?.long_url) {
          setError("Short URL not found");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
          return;
        }

        setLongUrl(result.data.long_url);
        // Redirect after a brief delay to show the loading state
        setTimeout(() => {
          window.location.href = result.data.long_url;
        }, 1000);
      } catch (err) {
        setError("An error occurred");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    };

    if (shortCode) {
      fetchAndRedirect();
    }
  }, [shortCode]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-600 text-3xl mb-4">⚠️</div>
          <p className="text-lg text-gray-800 mb-2 font-semibold">{error}</p>
          <p className="text-sm text-gray-600">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-80 to-indigo-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-800 mb-2 font-semibold">
          {longUrl ? "Redirecting you to your destination..." : "Loading..."}
        </p>
        <p className="text-sm text-gray-600">Please wait...</p>
      </div>
    </div>
  );
}
