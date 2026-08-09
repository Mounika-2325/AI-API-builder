import { useState } from 'react';
import { ApiProject } from '../types';

interface ProjectsViewProps {
  onSelectProject: (project: ApiProject) => void;
  onCreateProjectClick: () => void;
}

export default function ProjectsView({ onSelectProject, onCreateProjectClick }: ProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All Projects' | 'Active' | 'Archived' | 'Templates'>('All Projects');

  const initialProjects: ApiProject[] = [
    {
      id: 'p-crm',
      name: 'CRM Backend Core',
      version: 'v2.4.1',
      updatedAt: 'Updated 2h ago',
      status: 'READY',
      dbType: 'MongoDB',
      apiType: 'GraphQL',
      endpointsCount: 45,
      modelsCount: 12,
      errorRate: '0%',
      tags: ['Express.js', 'MongoDB', 'GraphQL'],
      description: 'Enterprise CRM server handling leads, sales pipelines, contacts, and deal stages.'
    },
    {
      id: 'p-ecom',
      name: 'E-commerce Auth API',
      version: 'v1.0.3',
      updatedAt: 'Updated 1d ago',
      status: 'READY',
      dbType: 'PostgreSQL',
      apiType: 'REST',
      endpointsCount: 18,
      modelsCount: 4,
      errorRate: '1.2%',
      tags: ['Fastify', 'PostgreSQL', 'Redis'],
      description: 'High-throughput authentication service with rate-limiting and session caching.'
    },
    {
      id: 'p-[#4edea3]',
      name: 'Legacy Fitness Tracker',
      version: 'v0.9.8',
      updatedAt: 'Archived',
      status: 'ARCHIVED',
      dbType: 'Node.js',
      apiType: 'REST',
      endpointsCount: 22,
      modelsCount: 8,
      errorRate: '4.5%',
      tags: ['Node.js'],
      description: 'Archived fitness workout and calorie logging backend.'
    }
  ];

  const filteredProjects = initialProjects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (activeFilter === 'Active') return p.status === 'READY';
    if (activeFilter === 'Archived') return p.status === 'ARCHIVED';
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-28 gap-6">
      {/* Sticky Search & Filter Bar */}
      <div className="flex flex-col gap-3 sticky top-16 z-40 bg-[#0b1326]/85 backdrop-blur-xl py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-white/5">
        <div className="flex flex-row items-center gap-2">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-[#908fa0] group-focus-within:text-[#c0c1ff] transition-colors">
                search
              </span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#171f33] rounded-xl text-[#dae2fd] placeholder-[#c7c4d7]/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0c1ff]/50 transition-all"
            />
          </div>
          <button className="flex items-center justify-center w-11 h-11 bg-[#171f33] rounded-xl text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors cursor-pointer">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-row overflow-x-auto no-scrollbar gap-2 pb-1">
          {(['All Projects', 'Active', 'Archived', 'Templates'] as const).map((chip) => {
            const isActive = activeFilter === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#c0c1ff]/10 text-[#c0c1ff] border border-[#c0c1ff]/30 shadow-[0_0_10px_rgba(192,193,255,0.15)]'
                    : 'bg-[#171f33] text-[#c7c4d7] border border-transparent hover:bg-[#222a3d]'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Bento */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#171f33] rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden shadow-sm border border-white/5">
          <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-[48px] text-[#4edea3]">data_object</span>
          </div>
          <span className="text-[#c7c4d7] font-semibold text-[11px] uppercase tracking-wider mb-5">
            Total Endpoints
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#dae2fd]">142</span>
            <span className="text-[#4edea3] text-xs font-bold flex items-center">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>+12%
            </span>
          </div>
        </div>

        <div className="bg-[#171f33] rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden shadow-sm border border-white/5">
          <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
            <span className="material-symbols-outlined text-[48px] text-[#adc6ff]">memory</span>
          </div>
          <span className="text-[#c7c4d7] font-semibold text-[11px] uppercase tracking-wider mb-5">
            API Calls (30d)
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#dae2fd]">2.4M</span>
          </div>
        </div>
      </div>

      {/* Project Cards Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#dae2fd]">Recent Projects</h2>
          <button className="text-[#c0c1ff] text-xs font-bold uppercase tracking-wider flex items-center gap-1">
            VIEW ALL <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className={`bg-[#171f33] rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden shadow-sm border border-white/5 transition-all cursor-pointer ${
                project.status === 'ARCHIVED' ? 'opacity-70' : 'hover:border-[#c0c1ff]/30'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#c0c1ff]/10 to-transparent rounded-bl-full pointer-events-none" />

              <div className="flex justify-between items-start z-10">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        project.status === 'READY'
                          ? 'bg-[#4edea3] animate-pulse'
                          : 'bg-[#908fa0]'
                      }`}
                    />
                    <h3
                      className={`text-base font-bold text-[#dae2fd] ${
                        project.status === 'ARCHIVED' ? 'line-through text-[#c7c4d7]' : ''
                      }`}
                    >
                      {project.name}
                    </h3>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#c7c4d7]">
                    {project.version} • {project.updatedAt}
                  </span>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-[#c7c4d7] hover:text-[#dae2fd] transition-colors p-1"
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>

              {project.status !== 'ARCHIVED' && (
                <div className="flex flex-row items-center gap-4 bg-[#0b1326] rounded-xl p-3 z-10 border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[#c7c4d7] text-[10px] font-bold tracking-wider uppercase">ENDPOINTS</span>
                    <span className="text-[#dae2fd] text-sm font-bold">{project.endpointsCount}</span>
                  </div>
                  <div className="w-px h-8 bg-[#222a3d]" />
                  <div className="flex flex-col">
                    <span className="text-[#c7c4d7] text-[10px] font-bold tracking-wider uppercase">MODELS</span>
                    <span className="text-[#dae2fd] text-sm font-bold">{project.modelsCount}</span>
                  </div>
                  <div className="w-px h-8 bg-[#222a3d]" />
                  <div className="flex flex-col">
                    <span className="text-[#c7c4d7] text-[10px] font-bold tracking-wider uppercase">ERRORS</span>
                    <span className={`text-sm font-bold ${project.errorRate === '0%' ? 'text-[#4edea3]' : 'text-[#ffb4ab]'}`}>
                      {project.errorRate}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 z-10 flex-wrap">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-[#31394d]/50 text-[#adc6ff] font-['JetBrains_Mono'] text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state or CTA card */}
        <div className="mt-4 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden bg-[#171f33] border border-[#c0c1ff]/20 shadow-md">
          <div className="w-14 h-14 bg-[#c0c1ff]/15 rounded-full flex items-center justify-center z-10 text-[#c0c1ff]">
            <span className="material-symbols-outlined text-[30px]">rocket_launch</span>
          </div>
          <div className="z-10 flex flex-col gap-1.5">
            <h3 className="text-lg font-bold text-[#dae2fd]">Initialize New Project</h3>
            <p className="text-xs sm:text-sm text-[#c7c4d7] max-w-sm">
              Generate a production-ready API skeleton with database schemas and auth in seconds.
            </p>
          </div>
          <button
            onClick={onCreateProjectClick}
            className="mt-1 z-10 w-full py-3 bg-[#c0c1ff] hover:bg-[#e1e0ff] text-[#1000a9] rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(192,193,255,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
