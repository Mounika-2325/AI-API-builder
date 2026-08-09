import { useState } from 'react';
import { ApiEndpoint } from '../types';

interface DocumentationViewProps {
  onTestEndpoint: (endpoint: ApiEndpoint) => void;
}

export default function DocumentationView({ onTestEndpoint }: DocumentationViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openGenPanel, setOpenGenPanel] = useState(true);
  const [openAuthPanel, setOpenAuthPanel] = useState(false);
  const [openModelsPanel, setOpenModelsPanel] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const docEndpoints = [
    {
      category: 'Authentication',
      method: 'POST',
      badgeClass: 'bg-[#c0c1ff]/20 text-[#c0c1ff]',
      path: '/api/v1/auth/token',
      title: 'Generate Access Token',
      description: 'Exchanges API key for a short-lived JWT token required for subsequent requests.',
      requestBody: `{\n  "apiKey": "lumina_live_key_9831a2"\n}`,
      codeSnippet: `const response = await fetch('/api/v1/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  }
});
const data = await response.json();
// returns { "token": "eyJhbG..." }`
    },
    {
      category: 'Inference',
      method: 'POST',
      badgeClass: 'bg-[#0566d9]/30 text-[#adc6ff]',
      path: '/api/v1/generate/text',
      title: 'Generate Text',
      description: 'Stream or generate text completions based on the provided prompt and model.',
      requestBody: `{\n  "model": "neural-v4",\n  "messages": [\n    {"role": "user", "content": "Explain quantum computing."}\n  ],\n  "temperature": 0.7,\n  "stream": true\n}`,
      codeSnippet: `const axios = require('axios');

app.post('/generate', async (req, res) => {
  try {
    const aiResponse = await axios.post('https://api.example.com/v1/generate/text', {
        model: 'neural-v4',
        messages: [{role: 'user', content: req.body.prompt}]
    }, {
        headers: { 'Authorization': \`Bearer \${process.env.API_TOKEN}\` }
    });
    res.json(aiResponse.data);
  } catch (error) {
    res.status(500).json({error: 'Generation failed'});
  }
});`
    },
    {
      category: 'Inference',
      method: 'GET',
      badgeClass: 'bg-[#00885d]/30 text-[#4edea3]',
      path: '/api/v1/models',
      title: 'List Available Models',
      description: 'Retrieve list of all active neural AI models and capabilities.',
      requestBody: '',
      codeSnippet: `fetch('/api/v1/models').then(r => r.json());`
    },
    {
      category: 'Inference',
      method: 'DEL',
      badgeClass: 'bg-[#93000a]/30 text-[#ffb4ab]',
      path: '/api/v1/sessions/:id',
      title: 'Delete Session',
      description: 'Revoke and delete active chat/inference session memory.',
      requestBody: '',
      codeSnippet: `fetch('/api/v1/sessions/sess_123', { method: 'DELETE' });`
    }
  ];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const filteredDocs = docEndpoints.filter(d => 
    d.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-28 gap-6">
      {/* Documentation Header Card */}
      <div className="bg-[#171f33] rounded-2xl p-5 flex flex-col gap-4 border border-white/5 shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#dae2fd]">API Documentation</h1>
            <p className="text-sm text-[#c7c4d7]">Explore and test the AI API endpoints.</p>
          </div>
          <button
            onClick={() => handleCopy('postman', JSON.stringify(docEndpoints, null, 2))}
            className="bg-[#c0c1ff] text-[#1000a9] font-bold text-xs px-4 py-2 rounded-full hover:shadow-[0_0_15px_rgba(192,193,255,0.3)] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span className="hidden sm:inline">
              {copiedSection === 'postman' ? 'COPIED' : 'POSTMAN'}
            </span>
          </button>
        </div>

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search endpoints..."
            className="w-full bg-[#222a3d] text-[#dae2fd] text-sm rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#c0c1ff]/50 transition-all border border-white/5"
          />
        </div>
      </div>

      {/* Authentication Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-[#dae2fd] px-1">Authentication</h2>
        
        <div className="bg-[#171f33] rounded-2xl overflow-hidden glass border border-white/5 shadow-md">
          <div
            onClick={() => setOpenAuthPanel(!openAuthPanel)}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors gap-2 border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="bg-[#c0c1ff]/20 text-[#c0c1ff] font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded font-bold">
                POST
              </span>
              <span className="font-['JetBrains_Mono'] text-xs sm:text-sm text-[#dae2fd] break-all">
                /api/v1/auth/token
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#c7c4d7] w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs sm:text-sm">Generate Access Token</span>
              <span className={`material-symbols-outlined text-[#c0c1ff] transition-transform ${openAuthPanel ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </div>
          </div>

          {openAuthPanel && (
            <div className="p-4 flex flex-col gap-4 bg-[#131b2e]">
              <p className="text-xs sm:text-sm text-[#c7c4d7]">
                Exchanges API key for a short-lived JWT token required for subsequent requests.
              </p>
              <div className="bg-[#2d3449] rounded-xl p-3 relative font-['JetBrains_Mono'] text-xs text-[#c7c4d7] overflow-x-auto">
                <button
                  onClick={() => handleCopy('auth', docEndpoints[0].codeSnippet)}
                  className="absolute top-2 right-2 text-[#c7c4d7] hover:text-[#dae2fd] p-1 bg-white/5 rounded"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedSection === 'auth' ? 'check' : 'content_copy'}
                  </span>
                </button>
                <pre className="whitespace-pre">{docEndpoints[0].codeSnippet}</pre>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => onTestEndpoint({
                    method: 'POST',
                    path: '/api/v1/auth/token',
                    description: 'Generate Access Token',
                    requestBody: docEndpoints[0].requestBody
                  })}
                  className="bg-[#31394d] hover:bg-[#2d3449] text-[#dae2fd] font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  TRY IT OUT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inference Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-[#dae2fd] px-1">Inference</h2>

        {/* Inference Endpoint 1: Generate Text */}
        <div className="bg-[#171f33] rounded-2xl overflow-hidden glass border border-white/5 shadow-md">
          <div
            onClick={() => setOpenGenPanel(!openGenPanel)}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors gap-2 border-b border-white/5"
          >
            <div className="flex items-center gap-3">
              <span className="bg-[#0566d9]/40 text-[#adc6ff] font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded font-bold">
                POST
              </span>
              <span className="font-['JetBrains_Mono'] text-xs sm:text-sm text-[#dae2fd] break-all">
                /api/v1/generate/text
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#c7c4d7] w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs sm:text-sm">Generate Text</span>
              <span className={`material-symbols-outlined text-[#c0c1ff] transition-transform ${openGenPanel ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </div>
          </div>

          {openGenPanel && (
            <div className="p-4 sm:p-5 flex flex-col gap-4 bg-[#131b2e]">
              <p className="text-xs sm:text-sm text-[#c7c4d7]">
                Stream or generate text completions based on the provided prompt and model.
              </p>

              <div className="flex flex-col gap-2">
                <h4 className="font-semibold text-xs text-[#c7c4d7] tracking-wider uppercase font-['Inter']">
                  REQUEST BODY
                </h4>
                <div className="bg-[#2d3449] rounded-xl p-3 font-['JetBrains_Mono'] text-xs text-[#adc6ff] overflow-x-auto">
                  <pre>{docEndpoints[1].requestBody}</pre>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="font-semibold text-xs text-[#c7c4d7] tracking-wider uppercase font-['Inter']">
                  EXPRESS.JS EXAMPLE
                </h4>
                <div className="bg-[#2d3449] rounded-xl p-3 relative font-['JetBrains_Mono'] text-xs text-[#c7c4d7] overflow-x-auto">
                  <button
                    onClick={() => handleCopy('express', docEndpoints[1].codeSnippet)}
                    className="absolute top-2 right-2 text-[#c7c4d7] hover:text-[#dae2fd] p-1 bg-white/5 rounded cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {copiedSection === 'express' ? 'check' : 'content_copy'}
                    </span>
                  </button>
                  <pre className="whitespace-pre">{docEndpoints[1].codeSnippet}</pre>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  onClick={() => onTestEndpoint({
                    method: 'POST',
                    path: '/api/v1/generate/text',
                    description: 'Generate Text Completion',
                    requestBody: docEndpoints[1].requestBody
                  })}
                  className="bg-[#31394d] hover:bg-[#2d3449] text-[#dae2fd] font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  TRY IT OUT
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Inference Endpoint 2: List Available Models */}
        <div className="bg-[#171f33] rounded-2xl overflow-hidden glass border border-white/5 shadow-md">
          <div
            onClick={() => setOpenModelsPanel(!openModelsPanel)}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors gap-2"
          >
            <div className="flex items-center gap-3">
              <span className="bg-[#00885d]/30 text-[#4edea3] font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded font-bold">
                GET
              </span>
              <span className="font-['JetBrains_Mono'] text-xs sm:text-sm text-[#dae2fd] break-all">
                /api/v1/models
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#c7c4d7] w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs sm:text-sm">List Available Models</span>
              <span className={`material-symbols-outlined text-[#c0c1ff] transition-transform ${openModelsPanel ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </div>
          </div>

          {openModelsPanel && (
            <div className="p-4 flex flex-col gap-3 bg-[#131b2e]">
              <p className="text-xs text-[#c7c4d7]">{docEndpoints[2].description}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => onTestEndpoint({
                    method: 'GET',
                    path: '/api/v1/models',
                    description: 'List Available Models'
                  })}
                  className="bg-[#31394d] hover:bg-[#2d3449] text-[#dae2fd] font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  TRY IT OUT
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Inference Endpoint 3: Delete Session */}
        <div className="bg-[#171f33] rounded-2xl overflow-hidden glass border border-white/5 shadow-md">
          <div
            onClick={() => onTestEndpoint({
              method: 'DEL',
              path: '/api/v1/sessions/:id',
              description: 'Delete Session'
            })}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors gap-2"
          >
            <div className="flex items-center gap-3">
              <span className="bg-[#93000a]/30 text-[#ffb4ab] font-['JetBrains_Mono'] text-xs px-2.5 py-1 rounded font-bold">
                DEL
              </span>
              <span className="font-['JetBrains_Mono'] text-xs sm:text-sm text-[#dae2fd] break-all">
                /api/v1/sessions/:id
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#c7c4d7] w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs sm:text-sm">Delete Session</span>
              <span className="material-symbols-outlined text-[#c0c1ff]">play_arrow</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
