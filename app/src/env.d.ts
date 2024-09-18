/// <reference path="../.astro/types.d.ts" />
declare namespace NodeJS {
	interface ProcessEnv {
		BQ_DATASET_ID: string;
		BQ_TABLE_ID: string;
		GOOGLE_APPLICATION_CREDENTIALS: string;
  }
}
