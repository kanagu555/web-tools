import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") || "^NSEI";
  const interval = searchParams.get("interval") || "1d";
  const range = searchParams.get("range");
  const period1 = searchParams.get("period1");
  const period2 = searchParams.get("period2");
  const useCustom = searchParams.get("useCustom") === "true";

  try {
    let url: string;
    if (useCustom && period1 && period2) {
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        symbol
      )}?interval=${interval}&period1=${period1}&period2=${period2}`;
    } else {
      url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
        symbol
      )}?interval=${interval}&range=${range || "3mo"}`;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // cache 5 min
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from Yahoo Finance" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
