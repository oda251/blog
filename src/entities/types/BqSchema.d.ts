type Mode = 'NULLABLE' | 'REQUIRED' | 'REPEATED';
type Type = 'STRING' | 'INT64' | 'FLOAT' | 'BOOLEAN' | 'TIMESTAMP' | 'RECORD';
export type BqColumnDefinition = {name: string, type: Type, mode: Mode};
export type DqDefinition = Array<BqColumnDefinition>;

export type BqSchema = Record<string, BqColumnDefinition>;
