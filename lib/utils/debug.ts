// Debug utility for production debugging
export const debug = {
  log: (...args: any[]) => {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_DEBUG === "true"
    ) {
      console.log("[DEBUG]", ...args);
    }
  },
  info: (...args: any[]) => {
    console.info("[INFO]", ...args);
  },
  warn: (...args: any[]) => {
    console.warn("[WARN]", ...args);
  },
  error: (...args: any[]) => {
    console.error("[ERROR]", ...args);
  },
};

// Environment info helper
export const logEnvironmentInfo = () => {
  debug.info("Environment:", process.env.NODE_ENV);
  debug.info("Build time:", new Date().toISOString());
  debug.info("Next.js version:", process.env.NEXT_RUNTIME || "unknown");
};
