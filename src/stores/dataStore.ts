import type { tHitsByBrowser, tHitsByDay, tHitsByLanguage, tHitsByMonth, tHitsByYear, tHitsByOS, tHitsByUrl } from "$lib/types";
import { writable } from 'svelte/store';

export const hitsTodayUnique = writable<number>(0);
export const hitsOverall = writable<number>(0);
export const hitsByDay = writable<Array<tHitsByDay>>();
export const hitsByMonth = writable<Array<tHitsByMonth>>();
export const hitsByYear = writable<Array<tHitsByYear>>();
export const hitsByUrlOverall = writable<Array<tHitsByUrl>>();
export const hitsByUrlCurrYear = writable<Array<tHitsByUrl>>();
export const hitsByBrowserOverall = writable<Array<tHitsByBrowser>>();
export const hitsByBrowserCurrYear = writable<Array<tHitsByBrowser>>();
export const hitsByLanguageOverall = writable<Array<tHitsByLanguage>>();
export const hitsByLanguageCurrYear = writable<Array<tHitsByLanguage>>();
export const hitsByOSOverall = writable<Array<tHitsByOS>>();
export const hitsByOSCurrYear = writable<Array<tHitsByOS>>();


// Enable/disable loading spinners
export const fetchingHitsByDate = writable<boolean>(false);
export const fetchingHitsByUrl = writable<boolean>(false);
export const fetchingHitsByBrowser = writable<boolean>(false);
export const fetchingHitsByLanguage = writable<boolean>(false);
export const fetchingHitsByOS = writable<boolean>(false);