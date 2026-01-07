export interface MainTrend {
	info: string;
	data: MainTrendItem[];
	type: string;
}

export interface MainTrendItem {
	date: string;
	amount: number;
	type: string;
}

export interface MainApi {
	uri: string;
	amount: number;
	date: string;
}
