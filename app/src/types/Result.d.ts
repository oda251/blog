export interface Result<T> {
	data: T;
	status: number;
	error?: string;
}