import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const { longUrl, customCode } = await request.json();

    if (!longUrl) {
      return NextResponse.json(
        { error: "Long URL is required" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(longUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    let shortCode = customCode;

    if (!shortCode) {
      // Generate random short code
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      shortCode = "";
      for (let i = 0; i < 6; i++) {
        shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }

    // Check if short code already exists
    const { data: existing } = await supabase
      .from("url_shortener")
      .select("id")
      .eq("short_code", shortCode)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Short code already exists" },
        { status: 409 }
      );
    }

    // Insert into database
    const { data, error } = await supabase
      .from("url_shortener")
      .insert([
        {
          short_code: shortCode,
          long_url: longUrl,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create short URL" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kodekit.in";
    const shortUrl = `${baseUrl}/s/${shortCode}`;

    return NextResponse.json({
      id: data.id,
      shortCode,
      longUrl,
      shortUrl,
      createdAt: data.created_at,
    });
  } catch (error) {
    console.error("Error in shorten API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
