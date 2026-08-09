import { useState, FormEvent } from 'react';
import { ApiProject } from '../types';

interface NewProjectModalProps {
  onClose: () => void;
  onCreate: (project: ApiProject) => void;
}

export default function NewProjectModal({ onClose, onCreate }: NewProjectModalProps) {
  const [name, setName] = useState('');
  const [dbType, setDbType] = useState('PostgreSQL');
  const [apiType, setApiType] = useState('REST & GraphQL');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: ApiProject = {
      id: 'proj_' + Date.now(),
      name: name.trim(),
      version: 'v1.0.0',
      updatedAt: 'Just now',
      status: 'READY',
      dbType,
      apiType,
      endpointsCount: 12,
      modelsCount: 4,
      errorRate: '0%',
      tags: [dbType, apiType.includes('GraphQL') ? 'GraphQL' : 'REST'],
      description: description || 'New AI generated API infrastructure project.'
    };

    onCreate(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#171f33] border border-white/10 rounded-2xl w-full max-w-lg p-6 flex flex-col gap-5 shadow-2xl glass">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-lg font-bold text-[#dae2fd] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff]">add_box</span>
            Initialize API Project
          </h3>
          <button
            onClick={onClose}
            className="text-[#c7c4d7] hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#c7c4d7] uppercase tracking-wider">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Healthcare Patient Portal API"
              className="w-full bg-[#131b2e] text-[#dae2fd] text-sm rounded-xl px-3.5 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c0c1ff]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c7c4d7] uppercase tracking-wider">
                Database Engine
              </label>
              <select
                value={dbType}
                onChange={(e) => setDbType(e.target.value)}
                className="w-full bg-[#131b2e] text-[#dae2fd] text-sm rounded-xl px-3 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c0c1ff]/50"
              >
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="MongoDB">MongoDB</option>
                <option value="MySQL">MySQL</option>
                <option value="Redis">Redis Cache</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#c7c4d7] uppercase tracking-wider">
                Architecture
              </label>
              <select
                value={apiType}
                onChange={(e) => setApiType(e.target.value)}
                className="w-full bg-[#131b2e] text-[#dae2fd] text-sm rounded-xl px-3 py-2.5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c0c1ff]/50"
              >
                <option value="REST & GraphQL">REST & GraphQL</option>
                <option value="RESTful API">RESTful API</option>
                <option value="GraphQL Only">GraphQL Only</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#c7c4d7] uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of the API scope and models..."
              className="w-full bg-[#131b2e] text-[#dae2fd] text-sm rounded-xl p-3 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#c0c1ff]/50"
            />
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#c7c4d7] hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#c0c1ff] hover:bg-[#e1e0ff] text-[#1000a9] text-xs font-bold shadow-[0_0_15px_rgba(192,193,255,0.3)] transition-all cursor-pointer"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
