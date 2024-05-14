export type Element = {
    id: number,
    value: number,
};

export type TimelineKeyframe = {
    state: Element[],
    low: number,
    high: number,
    pivot: number | null,
    description: string | null,
    kind: 'partition' | 'select' 
};
