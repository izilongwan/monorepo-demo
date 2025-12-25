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
