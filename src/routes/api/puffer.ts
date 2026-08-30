import { createAPIFileRoute } from "@tanstack/react-start/api";
import { handlePufferRequest } from "../../lib/puffer/pufferEngine";

export const APIRoute = createAPIFileRoute("/api/puffer")({
  POST: async ({ request }) => {
    return handlePufferRequest(request);
  },
});
