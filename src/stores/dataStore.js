import { writable } from 'svelte/store';

export const hitsTodayUnique = writable(0);
export const hitsOverall = writable(0);
export const hitsByDay = writable(0);
export const hitsByMonth = writable(0);
export const hitsByYear = writable(0);
export const hitsByUrlOverall = writable(0);
export const hitsByUrlCurrYear = writable(0);
export const hitsByBrowserOverall = writable(0);
export const hitsByBrowserCurrYear = writable(0);
export const hitsByLanguageOverall = writable(0);
export const hitsByLanguageCurrYear = writable(0);
export const hitsByOSOverall = writable(0);
export const hitsByOSCurrYear = writable(0);


// Enable/disable loading spinners
export const fetchingHitsTodayUnique = writable(false);
export const fetchingHitsOverall = writable(false);
export const fetchingHitsByDay = writable(false);
export const fetchingHitsByMonth = writable(false);
export const fetchingHitsByYear = writable(false);
export const fetchingHitsByUrls = writable(false);
export const fetchingHitsByBrowser = writable(false);
export const fetchingHitsByLanguage = writable(false);
export const fetchingHitsByOS = writable(false);