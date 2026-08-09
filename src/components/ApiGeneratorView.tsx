import { useState } from 'react';
import { GenerationResult, ApiEndpoint } from '../types';

interface ApiGeneratorViewProps {
  onTestEndpoint: (endpoint: ApiEndpoint) => void;
  onSaveToProjects: (result: GenerationResult) => void;
}

export default function ApiGeneratorView({ onTestEndpoint, onSaveToProjects }: ApiGeneratorViewProps) {
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const defaultSampleResult: GenerationResult = {
    projectName: "Employee Management System",
    version: "v1.0.0",
    description: "Enterprise employee directory with roles, departments, and payroll mapping.",
    databaseType: "PostgreSQL",
    apiType: "RESTful API",
    tables: [
      {
        name: "Employee",
        type: "table",
        columns: [
          { name: "id", type: "uuid", constraints: "PK" },
          { name: "first_name", type: "varchar(50)", constraints: "NOT NULL" },
          { name: "last_name", type: "varchar(50)", constraints: "NOT NULL" },
          { name: "email", type: "varchar(100)", constraints: "UK, NOT NULL" },
          { name: "department_id", type: "uuid", constraints: "FK" },
        ]
      },
      {
        name: "Department",
        type: "table",
        columns: [
          { name: "id", type: "uuid", constraints: "PK" },
          { name: "name", type: "varchar(100)", constraints: "NOT NULL" },
          { name: "manager_id", type: "uuid", constraints: "FK" },
        ]
      }
    ],
    endpoints: [
      { method: "GET", path: "/api/v1/employees", description: "List all employees with pagination" },
      { method: "POST", path: "/api/v1/employees", description: "Create a new employee record", requestBody: '{\n  "first_name": "Jane",\n  "last_name": "Doe",\n  "email": "jane.doe@company.com",\n  "department_id": "d-8f2a-4b..."\n}' },
      { method: "GET", path: "/api/v1/employees/{id}", description: "Retrieve specific employee details" },
      { method: "PUT", path: "/api/v1/employees/{id}", description: "Update employee information" },
      { method: "DEL", path: "/api/v1/employees/{id}", description: "Remove employee record" }
    ],
    sampleCode: `const express = require('express');\nconst app = express();\n\napp.post('/api/v1/employees', async (req, res) => {\n  const { first_name, last_name, email } = req.body;\n  // Save to database & return created record\n  res.status(201).json({ id: 'emp_982', first_name, last_name, email });\n});`,
    sampleCurl: `curl -X POST https://api.generated.dev/v1/employees \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -d '{\n    "first_name": "Jane",\n    "last_name": "Doe",\n    "email": "jane.doe@company.com",\n    "department_id": "d-8f2a-4b..."\n  }'`
  };

  const handleGenerate = async () => {
    if (!promptInput.trim()) {
      setPromptInput("Employee Management System with Roles and Departments");
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptInput || "Employee Management System with Roles and Departments" })
      });
      const data = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setResult(defaultSampleResult);
      }
    } catch (e) {
      console.error("API generation error:", e);
      setResult(defaultSampleResult);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyEndpoint = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSave = () => {
    if (result) {
      onSaveToProjects(result);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const activeResult = result || defaultSampleResult;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-28 gap-8">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto pt-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#dae2fd] tracking-tight mb-3">
          What are we building today?
        </h1>
        <p className="text-sm sm:text-base text-[#c7c4d7] max-w-xl mx-auto mb-6">
          Describe your system in plain English. Our AI will instantly architect your database schema and RESTful API endpoints.
        </p>

        {/* Input Bar */}
        <div className="w-full relative group">
          <div className="absolute -inset-1 bg-[#c0c1ff]/20 blur-xl rounded-2xl group-hover:bg-[#c0c1ff]/35 transition-all duration-500" />
          <div className="relative bg-[#171f33] rounded-2xl shadow-xl flex flex-col sm:flex-row items-center p-2 glass border border-white/10">
            <div className="flex items-center w-full pl-3 pr-2">
              <span className="material-symbols-outlined text-[#c7c4d7] mr-3 text-[22px]">architecture</span>
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Employee Management System with Roles and Departments..."
                className="w-full bg-transparent border-none focus:ring-0 text-[#dae2fd] placeholder-[#c7c4d7]/50 text-sm sm:text-base h-12 sm:h-14 outline-none"
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto h-12 sm:h-12 px-6 bg-[#c0c1ff] hover:bg-[#e1e0ff] text-[#1000a9] font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(192,193,255,0.3)] hover:shadow-[0_0_30px_rgba(192,193,255,0.5)] flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 mt-2 sm:mt-0"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              <span>{isGenerating ? 'ARCHITECTING...' : 'GENERATE API'}</span>
            </button>
          </div>
        </div>

        {/* Example Quick Prompts */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <span className="text-xs text-[#c7c4d7]/70 py-1">Try:</span>
          {[
            "E-Commerce Payment & Order API",
            "Hospital Patient Records Schema",
            "Ride-Sharing Backend",
            "Crypto Wallet Transactions"
          ].map((promptText) => (
            <button
              key={promptText}
              onClick={() => {
                setPromptInput(promptText);
              }}
              className="text-xs bg-[#171f33]/80 hover:bg-[#222a3d] text-[#c0c1ff] px-2.5 py-1 rounded-lg border border-white/5 transition-all cursor-pointer"
            >
              {promptText}
            </button>
          ))}
        </div>
      </section>

      {/* Loading State Animation */}
      {isGenerating && (
        <section className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 relative mb-4 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-[#6366f1] to-[#3b82f6] rounded-full shadow-[0_0_35px_rgba(99,102,241,0.8)] animate-pulse-glow" />
            <div className="absolute inset-0 rounded-full border border-[#c0c1ff]/30 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-[#dae2fd] mb-1">Architecting System...</h3>
          <p className="text-xs sm:text-sm text-[#c7c4d7] animate-pulse">
            Analyzing entities, generating schemas, and mapping endpoints.
          </p>
        </section>
      )}

      {/* Results State */}
      {!isGenerating && (
        <section className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#171f33]/60 rounded-xl p-4 border border-white/5 gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#dae2fd]">{activeResult.projectName}</h2>
              <p className="text-xs text-[#c7c4d7]">{activeResult.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#4edea3]/10 text-[#4edea3] px-2.5 py-1 rounded-md font-['JetBrains_Mono']">
                {activeResult.databaseType}
              </span>
              <button
                onClick={handleSave}
                className="bg-[#c0c1ff] hover:bg-[#e1e0ff] text-[#1000a9] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-[0_0_10px_rgba(192,193,255,0.2)]"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {savedSuccess ? 'check' : 'bookmark'}
                </span>
                {savedSuccess ? 'SAVED TO PROJECTS' : 'SAVE PROJECT'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Database Schema Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#dae2fd] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4edea3]">database</span>
                  Schema
                </h2>
                <button
                  onClick={() => handleCopyCode(JSON.stringify(activeResult.tables, null, 2))}
                  className="text-[#c0c1ff] hover:text-[#e1e0ff] p-1 text-xs font-medium flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  JSON
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {activeResult.tables.map((table) => (
                  <div
                    key={table.name}
                    className="bg-[#171f33] rounded-xl p-4 shadow-md glass relative overflow-hidden border border-white/5"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#4edea3]" />
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-[#dae2fd]">{table.name}</h3>
                      <span className="bg-[#2d3449] text-[#c7c4d7] font-['JetBrains_Mono'] text-[10px] px-2 py-0.5 rounded uppercase">
                        {table.type}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 font-['JetBrains_Mono'] text-xs text-[#c7c4d7]">
                      {table.columns.map((col) => (
                        <div
                          key={col.name}
                          className="flex justify-between hover:text-[#dae2fd] transition-colors py-0.5 border-b border-white/5 last:border-none"
                        >
                          <span className="text-[#adc6ff] font-medium">{col.name}</span>
                          <span className="text-right">
                            {col.type} <span className="text-[#4edea3] text-[10px]">({col.constraints})</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Endpoints Column */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[#dae2fd] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#adc6ff]">api</span>
                  Endpoints
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => activeResult.endpoints[0] && onTestEndpoint(activeResult.endpoints[0])}
                    className="bg-[#2d3449] hover:bg-[#31394d] text-[#dae2fd] font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    TEST ALL
                  </button>
                  <button
                    onClick={() => handleCopyCode(JSON.stringify(activeResult.endpoints, null, 2))}
                    className="bg-[#c0c1ff] hover:bg-[#e1e0ff] text-[#1000a9] font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">code</span>
                    EXPORT
                  </button>
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="bg-[#171f33] rounded-xl overflow-hidden shadow-md glass border border-white/5">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#2d3449]/70 text-[#c7c4d7] font-bold text-[11px] uppercase tracking-wider">
                        <th className="p-3 w-20">Method</th>
                        <th className="p-3">Path</th>
                        <th className="p-3 hidden sm:table-cell">Description</th>
                        <th className="p-3 text-right w-16">Action</th>
                      </tr>
                    </thead>
                    <tbody className="font-['JetBrains_Mono'] text-xs">
                      {activeResult.endpoints.map((ep, idx) => {
                        const getBadge = (method: string) => {
                          switch (method) {
                            case 'GET':
                              return 'bg-[#4edea3]/20 text-[#4edea3]';
                            case 'POST':
                              return 'bg-[#c0c1ff]/20 text-[#c0c1ff]';
                            case 'PUT':
                              return 'bg-[#adc6ff]/20 text-[#adc6ff]';
                            case 'DEL':
                            case 'DELETE':
                              return 'bg-[#ffb4ab]/20 text-[#ffb4ab]';
                            default:
                              return 'bg-[#31394d] text-[#dae2fd]';
                          }
                        };

                        return (
                          <tr
                            key={ep.path + ep.method}
                            onClick={() => onTestEndpoint(ep)}
                            className="hover:bg-[#222a3d] transition-colors border-b border-white/5 last:border-none cursor-pointer group"
                          >
                            <td className="p-3">
                              <span className={`${getBadge(ep.method)} px-2 py-0.5 rounded font-bold`}>
                                {ep.method}
                              </span>
                            </td>
                            <td className="p-3 text-[#dae2fd] font-semibold">{ep.path}</td>
                            <td className="p-3 text-[#c7c4d7] hidden sm:table-cell truncate max-w-[200px] font-['Inter']">
                              {ep.description}
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyEndpoint(ep.path, idx);
                                }}
                                className="text-[#c0c1ff] hover:text-white p-1 transition-opacity cursor-pointer"
                                title="Copy endpoint path"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  {copiedIndex === idx ? 'check' : 'content_copy'}
                                </span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Code Snippet */}
              <div className="bg-[#020617] rounded-xl p-4 relative group shadow-inner border border-white/10">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/10">
                  <span className="text-xs font-['JetBrains_Mono'] text-[#4edea3] uppercase font-semibold">
                    Generated cURL Request
                  </span>
                  <button
                    onClick={() => handleCopyCode(activeResult.sampleCurl)}
                    className="text-[#c7c4d7] hover:text-[#dae2fd] text-xs flex items-center gap-1 cursor-pointer bg-white/5 px-2 py-1 rounded"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedCode ? 'check' : 'content_copy'}
                    </span>
                    {copiedCode ? 'COPIED' : 'COPY'}
                  </button>
                </div>
                <div className="font-['JetBrains_Mono'] text-xs text-[#c7c4d7] overflow-x-auto whitespace-pre p-1">
                  {activeResult.sampleCurl}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
