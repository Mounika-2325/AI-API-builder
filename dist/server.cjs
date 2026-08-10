var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_genai = require("@google/genai");
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
var ai = null;
function getGeminiClient() {
  if (!ai && process.env.GEMINI_API_KEY) {
    try {
      ai = new import_genai.GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    } catch (e) {
      console.error("Error initializing Gemini API client:", e);
    }
  }
  return ai;
}
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/generate-api", async (req, res) => {
  const { prompt, databasePreference } = req.body || {};
  const userPrompt = prompt || "Employee Management System with Roles and Departments";
  const client = getGeminiClient();
  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are an expert system architect and API designer. Architect a complete production-ready API infrastructure and database schema based on this user request: "${userPrompt}". Database preference if any: "${databasePreference || "PostgreSQL"}".
Provide the response strictly as valid JSON with the following structure:
{
  "projectName": "Name of project",
  "version": "v1.0.0",
  "description": "Short explanation of the architecture",
  "databaseType": "PostgreSQL" or "MongoDB" or "MySQL",
  "apiType": "RESTful & GraphQL",
  "tables": [
    {
      "name": "TableName",
      "type": "table",
      "columns": [
        { "name": "id", "type": "uuid", "constraints": "PK" },
        { "name": "first_name", "type": "varchar(50)", "constraints": "NOT NULL" }
      ]
    }
  ],
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/resource",
      "description": "Description of what it does",
      "requestBody": "{ ... }",
      "responseBody": "{ ... }"
    }
  ],
  "sampleCode": "const express = require('express'); ...",
  "sampleCurl": "curl -X GET https://api.example.com/v1/resource"
}`,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ success: true, data: parsed });
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
    }
  }
  const fallbackData = generateFallbackArchitecture(userPrompt, databasePreference);
  return res.json({ success: true, data: fallbackData, fallback: true });
});
app.post("/api/test-endpoint", async (req, res) => {
  const { method, path: endpointPath, requestBody, headers } = req.body || {};
  const client = getGeminiClient();
  const startTime = Date.now();
  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Act as a live mock server endpoint for HTTP ${method} ${endpointPath}.
Request Headers: ${JSON.stringify(headers || {})}
Request Body: ${JSON.stringify(requestBody || {})}

Return a realistic HTTP 200/201 JSON response payload representing a successful API execution with sample real or realistic domain data. Response must be strictly JSON.`,
        config: {
          responseMimeType: "application/json"
        }
      });
      const latency2 = Date.now() - startTime;
      if (response.text) {
        let jsonRes;
        try {
          jsonRes = JSON.parse(response.text);
        } catch {
          jsonRes = { message: response.text };
        }
        return res.json({
          status: method === "POST" ? 201 : 200,
          statusText: method === "POST" ? "Created" : "OK",
          latencyMs: latency2,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "x-ratelimit-remaining": "998",
            "x-powered-by": "Lumina-Nexus-Engine/4.2"
          },
          data: jsonRes
        });
      }
    } catch (e) {
      console.error("Test endpoint error:", e);
    }
  }
  const latency = Math.floor(Math.random() * 45) + 18;
  return res.json({
    status: method === "POST" ? 201 : 200,
    statusText: method === "POST" ? "Created" : "OK",
    latencyMs: latency,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-ratelimit-remaining": "999",
      "x-powered-by": "Lumina-Nexus-Engine/4.2"
    },
    data: {
      success: true,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      endpoint: endpointPath,
      method,
      result: {
        id: "res_" + Math.random().toString(36).substring(2, 9),
        status: "active",
        processed_at: (/* @__PURE__ */ new Date()).toISOString(),
        items_count: 1
      }
    }
  });
});
function generateFallbackArchitecture(prompt, dbPref) {
  const cleanPrompt = prompt.toLowerCase();
  if (cleanPrompt.includes("auth") || cleanPrompt.includes("user")) {
    return {
      projectName: "User Authentication & Authorization Service",
      version: "v1.2.0",
      description: "Secure, high-performance JWT based authentication microservice with RBAC permissions.",
      databaseType: dbPref || "PostgreSQL",
      apiType: "RESTful & GraphQL",
      tables: [
        {
          name: "users",
          type: "table",
          columns: [
            { name: "id", type: "uuid", constraints: "PK, NOT NULL" },
            { name: "email", type: "varchar(255)", constraints: "UNIQUE, NOT NULL" },
            { name: "password_hash", type: "varchar(255)", constraints: "NOT NULL" },
            { name: "role", type: "varchar(50)", constraints: "DEFAULT 'user'" },
            { name: "created_at", type: "timestamp", constraints: "NOW()" }
          ]
        },
        {
          name: "sessions",
          type: "table",
          columns: [
            { name: "id", type: "uuid", constraints: "PK" },
            { name: "user_id", type: "uuid", constraints: "FK -> users.id" },
            { name: "refresh_token", type: "text", constraints: "NOT NULL" },
            { name: "expires_at", type: "timestamp", constraints: "NOT NULL" }
          ]
        }
      ],
      endpoints: [
        { method: "POST", path: "/api/v1/auth/register", description: "Register a new user account", requestBody: '{\n  "email": "user@company.com",\n  "password": "SecretPassword123!"\n}' },
        { method: "POST", path: "/api/v1/auth/token", description: "Generate JWT access token", requestBody: '{\n  "email": "user@company.com",\n  "password": "SecretPassword123!"\n}' },
        { method: "GET", path: "/api/v1/auth/me", description: "Fetch current authenticated profile" },
        { method: "POST", path: "/api/v1/auth/logout", description: "Revoke active user session token" }
      ],
      sampleCode: `const express = require('express');
const app = express();

app.post('/api/v1/auth/token', async (req, res) => {
  const { email, password } = req.body;
  // Verify credentials & return JWT
  res.json({ token: 'eyJhbGciOiJIUzI1Ni...' });
});`,
      sampleCurl: `curl -X POST https://api.generated.dev/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{"email":"dev@company.com","password":"secret"}'`
    };
  }
  return {
    projectName: prompt ? prompt.charAt(0).toUpperCase() + prompt.slice(1) : "Employee Management Infrastructure",
    version: "v1.0.0",
    description: `Automated database schema and API endpoints generated for ${prompt || "Employee Management System"}.`,
    databaseType: dbPref || "PostgreSQL",
    apiType: "RESTful API",
    tables: [
      {
        name: "employees",
        type: "table",
        columns: [
          { name: "id", type: "uuid", constraints: "PK" },
          { name: "first_name", type: "varchar(50)", constraints: "NOT NULL" },
          { name: "last_name", type: "varchar(50)", constraints: "NOT NULL" },
          { name: "email", type: "varchar(100)", constraints: "UNIQUE, NOT NULL" },
          { name: "department_id", type: "uuid", constraints: "FK -> departments.id" }
        ]
      },
      {
        name: "departments",
        type: "table",
        columns: [
          { name: "id", type: "uuid", constraints: "PK" },
          { name: "name", type: "varchar(100)", constraints: "NOT NULL" },
          { name: "manager_id", type: "uuid", constraints: "FK -> employees.id" }
        ]
      }
    ],
    endpoints: [
      { method: "GET", path: "/api/v1/employees", description: "List all employees with pagination & filters" },
      { method: "POST", path: "/api/v1/employees", description: "Create a new employee record", requestBody: '{\n  "first_name": "Jane",\n  "last_name": "Doe",\n  "email": "jane.doe@company.com",\n  "department_id": "d-8f2a-4b..."\n}' },
      { method: "GET", path: "/api/v1/employees/{id}", description: "Retrieve specific employee details" },
      { method: "PUT", path: "/api/v1/employees/{id}", description: "Update employee information" },
      { method: "DEL", path: "/api/v1/employees/{id}", description: "Remove employee record" }
    ],
    sampleCode: `const express = require('express');
const app = express();

app.get('/api/v1/employees', async (req, res) => {
  // Fetch employees from database
  res.json({ employees: [] });
});`,
    sampleCurl: `curl -X POST https://api.generated.dev/v1/employees \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane.doe@company.com",
    "department_id": "d-8f2a-4b..."
  }'`
  };
}
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
