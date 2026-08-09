export interface TableColumn {
  name: string;
  type: string;
  constraints: string;
  description?: string;
}

export interface SchemaTable {
  name: string;
  type: 'table' | 'collection' | 'view';
  columns: TableColumn[];
}

export interface ApiEndpoint {
  id?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DEL' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
  sampleCurl?: string;
}

export interface ApiProject {
  id: string;
  name: string;
  version: string;
  updatedAt: string;
  status: 'READY' | 'GENERATING' | 'ARCHIVED' | 'FAILED';
  dbType: string;
  apiType: string;
  endpointsCount: number;
  modelsCount: number;
  errorRate: string;
  tags: string[];
  tables?: SchemaTable[];
  endpoints?: ApiEndpoint[];
  sampleCode?: string;
  description?: string;
}

export interface GenerationResult {
  projectName: string;
  version: string;
  description: string;
  databaseType: string;
  apiType: string;
  tables: SchemaTable[];
  endpoints: ApiEndpoint[];
  sampleCode: string;
  sampleCurl: string;
}

export interface TestExecutionResult {
  status: number;
  statusText: string;
  latencyMs: number;
  headers: Record<string, string>;
  data: any;
}
