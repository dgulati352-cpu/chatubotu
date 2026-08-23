export type DatabaseType = 'postgresql' | 'sqlite' | 'mysql' | 'mongodb' | 'supabase' | 'redis';

export type ColumnType = 
  | 'String' 
  | 'Int' 
  | 'Float' 
  | 'Boolean' 
  | 'DateTime' 
  | 'Json' 
  | 'UUID' 
  | 'Enum'
  | 'Relation';

export interface DatabaseColumn {
  name: string;
  type: ColumnType;
  isPrimary?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  relationModel?: string;
  relationType?: '1:1' | '1:N' | 'N:M';
}

export interface DatabaseModel {
  id: string;
  name: string;
  tableName: string;
  description?: string;
  columns: DatabaseColumn[];
  rowsCount?: number;
}

export interface DatabaseRowData {
  id: string | number;
  [key: string]: any;
}

export interface DatabaseSchema {
  id: string;
  type: DatabaseType;
  name: string;
  connectionUri: string;
  models: DatabaseModel[];
  mockData: Record<string, DatabaseRowData[]>; // modelId -> rows
  rawQueriesHistory: {
    id: string;
    query: string;
    executedAt: number;
    rowCount: number;
    status: 'success' | 'error';
    durationMs: number;
  }[];
}
