export interface ChartDataSet {
    data: Array<any>
    label: string,
    colors?: any,
}

export enum Metric {
    Feed = "feed",
    Growth = "growth",
    Sleep = "sleep",
    Poop = "poop",
    Pee = "pee",
}
