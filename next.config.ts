import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Never print server function arguments (email, policy number) in the terminal.
  logging: { serverFunctions: false },
};

export default nextConfig;
