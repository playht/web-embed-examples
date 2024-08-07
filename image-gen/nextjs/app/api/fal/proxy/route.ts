import { route } from "@fal-ai/serverless-proxy/nextjs";
import type { NextRequest } from "next/server";
 
export const POST = (req: NextRequest) => {
  // this is a great place to add debug logging if you run into issues connecting to the fal proxy
  // console.log("POST request received", req)
  return route.POST(req);
};
 
export const GET = route.GET;