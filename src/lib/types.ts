export interface tHitsByDay {
    day: string,
    hits: number
}

export interface tHitsByMonth {
    month: string,
    hits: number
}

export interface tHitsByYear {
    year: number,
    hits: number
}

export interface tHitsByUrl {
    url: string,
    hits: number
}

export interface tHitsByBrowser {
    browser: string,
    hits: number
}

export interface tHitsByLanguage {
    language: string,
    hits: number
}

export interface tHitsByOS {
    os: string,
    hits: number
}