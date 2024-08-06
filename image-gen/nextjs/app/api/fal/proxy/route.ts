import { route } from "@fal-ai/serverless-proxy/nextjs";
import type { NextRequest } from "next/server";
 
// Let's add some custom logic to POST requests - i.e. when the request is
// submitted for processing
export const POST = (req: NextRequest) => {
  // Add some analytics
  console.log(process.env.FAL_KEY)
  console.log(process.env.TEST_KEY)
  return route.POST(req);
};
 
// For GET requests we will just use the built-in proxy handler
// But you could also add some custom logic here if you need
export const GET = route.GET;