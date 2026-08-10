import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily or Safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (e) {
      console.error("Error initializing Gemini API client:", e);
    }
  }
  return ai;
}

// API Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Generator Endpoint
app.post("/api/generate-api", async (req, res) => {
  const { prompt, databasePreference } = req.body || {};
  const userPrompt = prompt;

  const client = getGeminiClient();

  if (client) {
    try {
      const response = await client.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are an expert system architect and API designer. Architect a complete production-ready API infrastructure and database schema based on this user request: "${userPrompt}". Database preference if any: "${databasePreference || 'PostgreSQL'}".
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
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      // Fallback to intelligent generator below
    }
  }

  // Smart fallback generator if Gemini is unavailable or errors
  const fallbackData = generateFallbackArchitecture(userPrompt, databasePreference);
  return res.json({ success: true, data: fallbackData, fallback: true });
});

// Test Endpoint Runner API
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

      const latency = Date.now() - startTime;
      if (response.text) {
        let jsonRes;
        try {
          jsonRes = JSON.parse(response.text);
        } catch {
          jsonRes = { message: response.text };
        }
        return res.json({
          status: method === 'POST' ? 201 : 200,
          statusText: method === 'POST' ? 'Created' : 'OK',
          latencyMs: latency,
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

  // Fallback test runner response
  const latency = Math.floor(Math.random() * 45) + 18;
  return res.json({
    status: method === 'POST' ? 201 : 200,
    statusText: method === 'POST' ? 'Created' : 'OK',
    latencyMs: latency,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-ratelimit-remaining": "999",
      "x-powered-by": "Lumina-Nexus-Engine/4.2"
    },
    data: {
      success: true,
      timestamp: new Date().toISOString(),
      endpoint: endpointPath,
      method: method,
      result: {
        id: "res_" + Math.random().toString(36).substring(2, 9),
        status: "active",
        processed_at: new Date().toISOString(),
        items_count: 1
      }
    }
  });
});

function generateFallbackArchitecture(prompt: string, dbPref?: string) {
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
      sampleCode: `const express = require('express');\nconst app = express();\n\napp.post('/api/v1/auth/token', async (req, res) => {\n  const { email, password } = req.body;\n  // Verify credentials & return JWT\n  res.json({ token: 'eyJhbGciOiJIUzI1Ni...' });\n});`,
      sampleCurl: `curl -X POST https://api.generated.dev/v1/auth/token \\\n  -H "Content-Type: application/json" \\\n  -d '{"email":"dev@company.com","password":"secret"}'`
    };
  }

  // Default Employee / General fallback
  return {
    projectName: prompt ? prompt.charAt(0).toUpperCase() + prompt.slice(1) : "Employee Management Infrastructure",
    version: "v1.0.0",
    description: `Automated database schema and API endpoints generated for ${prompt || 'Employee Management System'}.`,
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
    sampleCode: `const express = require('express');\nconst app = express();\n\napp.get('/api/v1/employees', async (req, res) => {\n  // Fetch employees from database\n  res.json({ employees: [] });\n});`,
    sampleCurl: `curl -X POST https://api.generated.dev/v1/employees \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -d '{\n    "first_name": "Jane",\n    "last_name": "Doe",\n    "email": "jane.doe@company.com",\n    "department_id": "d-8f2a-4b..."\n  }'`
  };
}

// Vite Server Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
