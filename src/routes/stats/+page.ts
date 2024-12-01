
import { hitsByBrowserCurrYear, hitsByLanguageCurrYear, hitsByDay, hitsByOSCurrYear, hitsByUrlCurrYear, hitsOverall, hitsTodayUnique } from "../../stores/dataStore";
import { getNameOfDay } from "$lib/helper";
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {

	const today = new Date();
	// Current Date as string "2024-04-26"
	const currDate = today.toISOString().slice(0, 10);

	try {
		/*
		* Get overall hits
		*/
		const r_overall = await fetch(`/.netlify/functions/getHitsOverall`);
		const overall_json = await r_overall.json();	
		// Save response in store
		hitsOverall.set(overall_json.data);
	
		/*
		* Get hits of today (unique)
		*/
		const r_unique = await fetch(`/.netlify/functions/getHitsByDateUnique?date=${currDate}`);
		const unique_data = (await r_unique.json()).data;	
		// Save response in store
		hitsTodayUnique.set(unique_data);

		/*
		* Get hits by day for the last 7 days
		*/ 	
		// Create array with content [0, 1, 2, 3, 4, 5, 6]
		const daysToGet = [...Array(7).keys()];
		const namesOfLastXDays: string[] = [];
		// Fetching hits for each day
		const hitsByDate = async (days: number) => {
			const date = new Date();
			date.setDate(today.getDate() - days);
			namesOfLastXDays.push(getNameOfDay(date.getDay()));
			// Extract only the date part from the ISO string
			const dateString = date.toISOString().slice(0, 10);
			const response = await fetch(`/.netlify/functions/getHitsByDate?date=${dateString}`);
			return await response.json();
		}
	
		// Await promises fetching hits for each day
		const promises = daysToGet.map(hitsByDate);
		const r_hitsByDay = await Promise.all(promises);
		const object = namesOfLastXDays.map((day: string, i: number) => {
			return {
				day: day,
				hits: r_hitsByDay[i].data
			}
		});
		// Save hits in store
		hitsByDay.set(object);

		/*
		* Get hits by browser for current year
		*/ 
		const r_browserByYear = await fetch(`/.netlify/functions/getHitsByBrowserByYear?date=${currDate}`);
		const browserByYear_data = (await r_browserByYear.json()).data;  
		// Save array of objects in store
		hitsByBrowserCurrYear.set(browserByYear_data);
	
		/*
		* Get hits by language for current year
		*/ 
		const r_languageByYear = await fetch(`/.netlify/functions/getHitsByLanguageByYear?date=${currDate}`);
		const languageByYear_data = (await r_languageByYear.json()).data;   
		// Save array of objects in store
		hitsByLanguageCurrYear.set(languageByYear_data);

		/*
		* Get hits by os for current year
		*/ 
		const r_osByYear = await fetch(`/.netlify/functions/getHitsByOSByYear?date=${currDate}`);
		const osByYear_data = (await r_osByYear.json()).data;  
		// Save array of objects in store
		hitsByOSCurrYear.set(osByYear_data);

		/*
		* Get hits by URL for current year
		*/ 
		const r_urlByYear = await fetch(`/.netlify/functions/getHitsByUrlByYear?date=${currDate}`);
		const urlByYear_data = (await r_urlByYear.json()).data;
		// Save array of objects in store
		hitsByUrlCurrYear.set(urlByYear_data);

	} catch (err) {
		console.error(err);
	}
};