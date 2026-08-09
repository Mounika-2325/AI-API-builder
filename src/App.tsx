import { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DashboardView from './components/DashboardView';
import ProjectsView from './components/ProjectsView';
import ApiGeneratorView from './components/ApiGeneratorView';
import DocumentationView from './components/DocumentationView';
import TestEndpointModal from './components/TestEndpointModal';
import NewProjectModal from './components/NewProjectModal';
import { ApiEndpoint, ApiProject, GenerationResult } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [testEndpoint, setTestEndpoint] = useState<ApiEndpoint | null>(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [projectsList, setProjectsList] = useState<ApiProject[]>([]);

  const handleSaveGenerationToProjects = (res: GenerationResult) => {
    const newProj: ApiProject = {
      id: 'proj_' + Date.now(),
      name: res.projectName,
      version: res.version || 'v1.0.0',
      updatedAt: 'Just now',
      status: 'READY',
      dbType: res.databaseType || 'PostgreSQL',
      apiType: res.apiType || 'REST',
      endpointsCount: res.endpoints ? res.endpoints.length : 8,
      modelsCount: res.tables ? res.tables.length : 3,
      errorRate: '0%',
      tags: [res.databaseType || 'PostgreSQL', 'REST'],
      description: res.description,
      tables: res.tables,
      endpoints: res.endpoints,
      sampleCode: res.sampleCode
    };

    setProjectsList((prev) => [newProj, ...prev]);
  };

  const handleSelectProject = (project: ApiProject) => {
    if (project.endpoints && project.endpoints.length > 0) {
      setTestEndpoint(project.endpoints[0]);
    } else {
      setTestEndpoint({
        method: 'GET',
        path: `/api/v1/${project.name.toLowerCase().replace(/\s+/g, '-')}`,
        description: project.description || `Retrieve data for ${project.name}`
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] font-['Inter',sans-serif] relative overflow-x-hidden">
      {/* Top Fixed Header */}
      <header>
        currentTab={currentTab}
        onSearchClick={() => setCurrentTab('projects')}
        onNewProjectClick={() => setIsNewProjectOpen(true)}
      </header>

      {/* Main View Area */}
      <main className="pt-16 pb-20 min-h-[calc(100vh-80px)]">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigateToGenerator={() => setCurrentTab('api-generator')}
            onNavigateToProjects={() => setCurrentTab('projects')}
            onSelectProject={handleSelectProject}
          />
        )}

        {currentTab === 'projects' && (
          <ProjectsView
            onSelectProject={handleSelectProject}
            onCreateProjectClick={() => setIsNewProjectOpen(true)}
          />
        )}

        {currentTab === 'api-generator' && (
          <ApiGeneratorView
            onTestEndpoint={(ep) => setTestEndpoint(ep)}
            onSaveToProjects={handleSaveGenerationToProjects}
          />
        )}

        {currentTab === 'settings' && (
          <DocumentationView
            onTestEndpoint={(ep) => setTestEndpoint(ep)}
          />
        )}
      </main>

      {/* Fixed Bottom Glass Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Interactive Endpoint Test Execution Modal */}
      {testEndpoint && (
        <TestEndpointModal
          endpoint={testEndpoint}
          onClose={() => setTestEndpoint(null)}
        />
      )}

      {/* New Project Modal */}
      {isNewProjectOpen && (
        <NewProjectModal
          onClose={() => setIsNewProjectOpen(false)}
          onCreate={(newProj) => {
            setProjectsList((prev) => [newProj, ...prev]);
            setCurrentTab('projects');
          }}
        />
      )}
    </div>
  );
}
