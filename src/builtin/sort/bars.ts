export type Bar = {
    value: number,
}

export type Bars = Bar[];

export function bars(n: number): Bars {
    return Array(n).fill(0).map((_v, i) => ({value: i+1}))
}

export function cmp(a: Bar, b: Bar) {
    return a.value-b.value;
}
