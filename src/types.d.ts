export type Element = {
    id: number,
    value: number,
};

export type TimelineKeyframe = {
    state: Element[],
    low: number,
    high: number,
    pivot: number,
    description: string | null,
    kind: 'partition' | 'select' 
};
