import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv, type Plugin } from "vite";

function pufferDevApiPlugin(): Plugin {
  return {
    name: "puffer-dev-api",
    configureServer(server) {
      const env = loadEnv(server.config.mode || "development", process.cwd(), "");
      if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
      }

      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] === "/api/puffer" && req.method === "POST") {
          try {
            if (env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
              process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
            }
            const chunks: Uint8Array[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
            }
            const bodyBuffer = Buffer.concat(chunks);
            const standardReq = new Request(`http://${req.headers.host || "localhost"}${req.url}`, {
              method: req.method,
              headers: req.headers as HeadersInit,
              body: bodyBuffer.length > 0 ? bodyBuffer : undefined,
            });

            const { handlePufferRequest } = await import("./api/puffer");
            const response = await handlePufferRequest(standardReq);

            if (response instanceof Response) {
              res.statusCode = response.status;
              response.headers.forEach((value, key) => {
                res.setHeader(key, value);
              });
              const responseBody = await response.text();
              res.end(responseBody);
            }
          } catch (err) {
            console.error("Vite Dev Puffer API error:", err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Internal server error" }));
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [pufferDevApiPlugin()],
  nitro: {
    preset: "vercel",
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
