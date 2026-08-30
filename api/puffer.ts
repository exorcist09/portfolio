import { handlePufferRequest } from "../src/lib/puffer/pufferEngine";

export default async function handler(req: Request) {
  return handlePufferRequest(req);
}