import { ApiProject } from '../types';

interface DashboardViewProps {
  onNavigateToGenerator: () => void;
  onNavigateToProjects: () => void;
  onSelectProject: (project: ApiProject) => void;
}

export default function DashboardView({
  onNavigateToGenerator,
  onNavigateToProjects,
  onSelectProject,
}: DashboardViewProps) {
  const recentGenerations: ApiProject[] = [
    {
      id: 'proj-1',
      name: 'E-Commerce Backend',
      version: 'v1.2.0',
      updatedAt: '5 mins ago',
      status: 'READY',
      dbType: 'PostgreSQL',
      apiType: 'GraphQL',
      endpointsCount: 32,
      modelsCount: 14,
      errorRate: '0%',
      tags: ['PostgreSQL', 'GraphQL'],
      description: 'Complete e-commerce backend schema with cart, orders, inventory, and payment integration.'
    },
    {
      id: 'proj-2',
      name: 'User Auth Service',
      version: 'v1.0.0',
      updatedAt: 'Building schema...',
      status: 'GENERATING',
      dbType: 'PostgreSQL',
      apiType: 'REST',
      endpointsCount: 8,
      modelsCount: 3,
      errorRate: '0%',
      tags: ['PostgreSQL', 'REST'],
      description: 'JWT OAuth2 authentication service with session revocation and RBAC roles.'
    },
    {
      id: 'proj-3',
      name: 'Inventory Tracker',
      version: 'v0.9.1',
      updatedAt: '2 hrs ago',
      status: 'READY',
      dbType: 'MongoDB',
      apiType: 'REST',
      endpointsCount: 16,
      modelsCount: 6,
      errorRate: '0.1%',
      tags: ['MongoDB', 'REST'],
      description: 'Real-time stock inventory tracking system with supplier webhooks.'
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-28 gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#dae2fd] tracking-tight">
          Welcome back, Developer
        </h1>
        <p className="text-sm sm:text-base text-[#c7c4d7]">
          Here's an overview of your AI-generated API infrastructure.
        </p>
        <button
          onClick={onNavigateToGenerator}
          className="mt-3 bg-[#c0c1ff] hover:bg-[#e1e0ff] text-[#1000a9] font-bold text-xs tracking-wider uppercase py-3.5 px-6 rounded-xl w-full flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(192,193,255,0.25)] hover:shadow-[0_0_30px_rgba(192,193,255,0.45)] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          NEW API PROJECT
        </button>
      </div>

      {/* Statistics Bento Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Stat Card 1: Total APIs */}
        <div className="col-span-2 bg-[#171f33]/60 backdrop-blur-xl rounded-2xl p-5 border border-white/5 relative overflow-hidden group hover:border-[#c0c1ff]/30 transition-all shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c0c1ff]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold tracking-wider text-[#c7c4d7] uppercase">TOTAL APIS</span>
              <span className="text-4xl font-extrabold text-[#dae2fd]">14</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#c0c1ff]/20 flex items-center justify-center border border-[#c0c1ff]/30 text-[#c0c1ff]">
              <span className="material-symbols-outlined">api</span>
            </div>
          </div>
          {/* Sparkline curve */}
          <div className="mt-4 h-9 w-full relative z-10">
            <svg className="w-full h-full stroke-[#c0c1ff] opacity-80 fill-none" preserveAspectRatio="none" strokeWidth="2.5" viewBox="0 0 100 20">
              <path d="M0,18 Q15,14 30,17 T60,8 T80,14 T100,2" />
            </svg>
          </div>
        </div>

        {/* Stat Card 2: Tables */}
        <div className="bg-[#171f33]/60 backdrop-blur-xl rounded-2xl p-5 border border-white/5 flex flex-col gap-3 hover:border-white/10 transition-all shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#4edea3]">table_chart</span>
            <span className="text-xs font-semibold tracking-wider text-[#c7c4d7] uppercase">TABLES</span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#dae2fd]">42</span>
        </div>

        {/* Stat Card 3: Endpoints */}
        <div className="bg-[#171f33]/60 backdrop-blur-xl rounded-2xl p-5 border border-white/5 flex flex-col gap-3 hover:border-white/10 transition-all shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#adc6ff]">route</span>
            <span className="text-xs font-semibold tracking-wider text-[#c7c4d7] uppercase">ENDPOINTS</span>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#dae2fd]">128</span>
        </div>

        {/* Stat Card 4: System Uptime */}
        <div className="col-span-2 bg-[#171f33]/60 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-white/5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4edea3]"></span>
            </div>
            <span className="text-sm sm:text-base font-medium text-[#dae2fd]">System Uptime</span>
          </div>
          <span className="font-['JetBrains_Mono'] text-sm sm:text-base font-bold text-[#4edea3]">99.99%</span>
        </div>
      </div>

      {/* Recent Generations */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#dae2fd] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#c0c1ff]">history</span>
            Recent Generations
          </h2>
          <button 
            onClick={onNavigateToProjects}
            className="text-xs text-[#c0c1ff] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            SEE ALL
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {recentGenerations.map((item) => (
            <div
              key={item.id}
              onClick={() => item.status === 'READY' && onSelectProject(item)}
              className={`bg-[#131b2e] rounded-xl p-4 border border-white/5 flex flex-col gap-3 relative overflow-hidden transition-all shadow-sm ${
                item.status === 'READY' ? 'hover:border-[#c0c1ff]/30 cursor-pointer' : ''
              }`}
            >
              {item.status === 'GENERATING' && (
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-0"></div>
              )}

              <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-[#dae2fd]">{item.name}</span>
                  <span className="font-['JetBrains_Mono'] text-xs text-[#c7c4d7]/70">
                    {item.version} • {item.updatedAt}
                  </span>
                </div>

                {item.status === 'READY' ? (
                  <span className="bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20 px-2 py-1 rounded text-[10px] font-bold tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span> READY
                  </span>
                ) : (
                  <span className="bg-[#adc6ff]/10 text-[#adc6ff] border border-[#adc6ff]/20 px-2 py-1 rounded text-[10px] font-bold tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] animate-spin">sync</span> GENERATING
                  </span>
                )}
              </div>

              {item.status === 'GENERATING' ? (
                <div className="w-full bg-[#31394d] rounded-full h-1.5 mt-1 relative z-10 overflow-hidden">
                  <div className="bg-[#adc6ff] h-full rounded-full w-2/3 animate-pulse"></div>
                </div>
              ) : (
                <div className="flex gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="bg-[#31394d]/60 text-[#dae2fd] font-['JetBrains_Mono'] text-[11px] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
