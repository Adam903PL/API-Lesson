// api/index.ts
import serverless from "serverless-http";
import app from "../src/server"; // zakładamy, że Twój index.ts znajduje się w katalogu src

// Opakowujemy aplikację Express w funkcję serverless
export const handler = serverless(app);
