<script lang="ts">
	import { fade } from "svelte/transition";
    import BoxTopRow from "$lib/components/BoxTopRow.svelte";
    import ListItemBarChart from "$lib/components/ListItemBarChart.svelte";
    import ListItemLink from "$lib/components/ListItemLink.svelte";
    import { getNameOfMonth } from "$lib/helper";
    import { Pulse } from 'svelte-loading-spinners';
	import logo from "$lib/images/logo.png";
    import { hitsByBrowserCurrYear, hitsByBrowserOverall, hitsByLanguageCurrYear, hitsByLanguageOverall, hitsByDay, hitsByMonth, hitsByOSCurrYear, hitsByOSOverall, hitsByUrlCurrYear, hitsByUrlOverall, hitsByYear, hitsOverall, hitsTodayUnique, fetchingHitsByDate, fetchingHitsByUrl, fetchingHitsByBrowser, fetchingHitsByOS, fetchingHitsByLanguage } from "../../stores/dataStore";

    const today = new Date();
    const currYear = today.getFullYear();

    let viewHitsHistoryByDay = true;
    let viewHitsHistoryByMonth = false;
    let viewHitsHistoryByYear = false;

    let viewPageHitsThisYear = true;
    let viewPageHitsOverall = false;

    let viewBrowserHitsThisYear = true;
    let viewBrowserHitsOverall = false;

    let viewOSHitsThisYear = true;
    let viewOSHitsOverall = false;

    let viewLanguageHitsThisYear = true;
    let viewLanguageHitsOverall = false;

    /**
     * Get sum of hits for each of the last 7 months
     */
     async function getHitsByMonth() {
        const monthsToGet = [...Array(7).keys()];
		const namesOfLast7Month: string[] = [];
		// Fetching hits for each Month
		const fetchHitsByMonth = async (months: number) => {
			const date = new Date();
			date.setMonth(today.getMonth() - months);
			namesOfLast7Month.push(getNameOfMonth(date.getMonth()));
			const response = await fetch(`/.netlify/functions/getHitsByYearByMonth?year=${date.getFullYear()}&month=${date.getMonth()}`);
			return await response.json();
		}
	
        try {
        // Enable loading spinners
        fetchingHitsByDate.set(true);
            // Await promises fetching hits for each day
            const promises = monthsToGet.map(fetchHitsByMonth);
            const r_hitsByMonth = await Promise.all(promises);
            const objHitsByMonth = namesOfLast7Month.map((month: string, i: number) => {
                return {
                    month: month,
                    hits: r_hitsByMonth[i].data
                }
            });
            // Save hits in store
            hitsByMonth.set(objHitsByMonth);
            // Disable loading spinners
            fetchingHitsByDate.set(false);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Get sum of hits for each of the last 7 years
     */
    async function getHitsByYear() {
        // Create array of "years" length sarting with current year:
        // i.e. [2021, 2020, 2019, ...]
        const last7Years = Array.from({length: 7}, (_, i) => (currYear - i ));

        // Fetching sum of hits for each year
        const getHitsByYear = async (year: number) => {
            const response = await fetch(`/.netlify/functions/getHitsByYear?year=${year}`);
            return await response.json();
        }

        try {
            // Enable loading spinners
            fetchingHitsByDate.set(true);
            // Awayit promises fetching sum for each year
            const promises = last7Years.map(getHitsByYear);
            const r_hitsByYear = await Promise.all(promises);
            const objHitsByYear = last7Years.map((year: number, i:number) => {
                return {
                    year: year,
                    hits: r_hitsByYear[i].data
                }
            });
            // Save hits in store
            hitsByYear.set(objHitsByYear);
            // Disable loading spinners
            fetchingHitsByDate.set(false);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Get sum of hits for each URL of the top 10 URLs
     */
     async function getHitsByUrlOverall() {
        try {
            // Enable loading spinners
            fetchingHitsByUrl.set(true);
            // Awayit promises fetching data
            const r_hitsByUrlOverall = await fetch(`/.netlify/functions/getHitsByUrlOverall`);
            const objHitsByUrlOverall = (await r_hitsByUrlOverall.json()).data;
            // Save hits in store
            hitsByUrlOverall.set(objHitsByUrlOverall);
            // Disable loading spinners
            fetchingHitsByUrl.set(false);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Get sum of hits for each browser of the top 10 browsers
     */
     async function getHitsByBrowserOverall() {
        try {
            // Enable loading spinners
            fetchingHitsByBrowser.set(true);
            // Awayit promises fetching data
            const r_hitsByBrowserOverall = await fetch(`/.netlify/functions/getHitsByBrowserOverall`);
            const objHitsByBrowserOverall = (await r_hitsByBrowserOverall.json()).data;
            // Save hits in store
            hitsByBrowserOverall.set(objHitsByBrowserOverall);
            // Disable loading spinners
            fetchingHitsByBrowser.set(false);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Get sum of hits for each OS of the top 10 OS
     */
     async function getHitsByOSOverall() {
        try {
            // Enable loading spinners
            fetchingHitsByOS.set(true);
            // Awayit promises fetching data
            const r_hitsByOSOverall = await fetch(`/.netlify/functions/getHitsByOSOverall`);
            const objHitsByOSOverall = (await r_hitsByOSOverall.json()).data;
            // Save hits in store
            hitsByOSOverall.set(objHitsByOSOverall);
            // Disable loading spinners
            fetchingHitsByOS.set(false);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Get sum of hits for each Language of the top 10 OS
     */
     async function getHitsByLanguageOverall() {
        try {
            // Enable loading spinners
            fetchingHitsByLanguage.set(true);
            // Awayit promises fetching data
            const r_hitsByLanguageOverall = await fetch(`/.netlify/functions/getHitsByLanguageOverall`);
            const objHitsByLanguageOverall = (await r_hitsByLanguageOverall.json()).data;
            // Save hits in store
            hitsByLanguageOverall.set(objHitsByLanguageOverall);
            // Disable loading spinners
            fetchingHitsByLanguage.set(false);
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Display hits history by years
     */
    function handleHitsHistoryByYear() {
        // Set tabs
        viewHitsHistoryByDay = false;
        viewHitsHistoryByMonth = false;
        viewHitsHistoryByYear = true;
        // Only fetch if store is empty
        if (!$hitsByYear) {
            getHitsByYear();
        }
    }

    /**
     * Display hits history by months
     */
    function handleHitsHistoryByMonth() {
        // Set tabs
        viewHitsHistoryByDay = false;
        viewHitsHistoryByMonth = true;
        viewHitsHistoryByYear = false;
        // Only fetch if store is empty
        if (!$hitsByUrlOverall) {
            getHitsByMonth();
        }
    }

    /**
     * Display hits history by days
     */
    function handleHitsHistoryByDay() {
        // Set tabs
        viewHitsHistoryByDay = true;
        viewHitsHistoryByMonth = false;
        viewHitsHistoryByYear = false;
    }

    /**
     * Display page hits overall
     */
     function handlePageHitsOverall() {
        // Set tabs
        viewPageHitsThisYear = false;
        viewPageHitsOverall = true;
        // Only fetch if store is empty
        if (!$hitsByUrlOverall) {
            getHitsByUrlOverall();
        }
    }

    /**
     * Display page hits this year
     */
     function handlePageHitsThisYear() {
        // Set tabs
        viewPageHitsThisYear = true;
        viewPageHitsOverall = false;
    }

    /**
     * Display browser hits overall
     */
     function handleBrowserHitsOverall() {
        // Set tabs
        viewBrowserHitsThisYear = false;
        viewBrowserHitsOverall = true;
        // Only fetch if store is empty
        if (!$hitsByBrowserOverall) {
            getHitsByBrowserOverall();
        }
    }

    /**
     * Display browser hits this year
     */
     function handleBrowserHitsThisYear() {
        // Set tabs
        viewBrowserHitsThisYear = true;
        viewBrowserHitsOverall = false;
    }

    /**
     * Display OS hits overall
     */
     function handleOSHitsOverall() {
        // Set tabs
        viewOSHitsThisYear = false;
        viewOSHitsOverall = true;
        // Only fetch if store is empty
        if (!$hitsByOSOverall) {
            getHitsByOSOverall();
        }
    }

    /**
     * Display OS hits this year
     */
     function handleOSHitsThisYear() {
        // Set tabs
        viewOSHitsThisYear = true;
        viewOSHitsOverall = false;
    }

    /**
     * Display Language hits overall
     */
     function handleLanguageHitsOverall() {
        // Set tabs
        viewLanguageHitsThisYear = false;
        viewLanguageHitsOverall = true;
        // Only fetch if store is empty
        if (!$hitsByLanguageOverall) {
            getHitsByLanguageOverall();
        }
    }

    /**
     * Display Language hits this year
     */
     function handleLanguageHitsThisYear() {
        // Set tabs
        viewLanguageHitsThisYear = true;
        viewLanguageHitsOverall = false;
    }
</script>

<nav class="flex items-center w-full mb-4 justify-between">
    <a href="/" data-sveltekit-reload>
        <img src={logo} alt="logo" width="75" height="75" />
    </a>
    <form action="/logout" method="POST">
        <button	class="border border-gray-400 hover:border-gray-700 inline-block text-gray-400 hover:text-gray-700 py-2 px-4 rounded-lg">
            Logout
        </button>
    </form>
</nav>

<div class="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2" in:fade>

    <BoxTopRow 
        heading="Today"
        data={$hitsByDay[0].hits}
        class="p-4 rounded-lg bg-emerald-500 text-white"
    />
    <BoxTopRow 
        heading="Today (unique)"
        data={$hitsTodayUnique}
        class="p-4 rounded-lg bg-gray-700 text-white"
    />

    <BoxTopRow 
        heading="Last 7 days"
        data={$hitsByDay.map(o => o.hits).reduce((sum, n) => sum + n, 0)}
        class="p-4 rounded-lg bg-gray-700 text-white"
    />

    <BoxTopRow 
        heading="Overall"
        data={$hitsOverall}
        class="p-4 rounded-lg bg-gray-700 text-white"
    />

</div>
<div class="w-full grid gap-2 grid-cols-1 sm:grid-cols-2" in:fade>
    <div>
        <div class="mt-4 text-white">
            <div class="w-full flex justify-between">
                <h2 class="p-2 text-gray-700">Hits history</h2>
                <div class="flex flex-wrap">
                    <button 
                        on:click="{handleHitsHistoryByYear}"
                        class="{viewHitsHistoryByYear ? 
                        "px-4 py-2 rounded-t-lg bg-gray-700" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        Y
                    </button>
                    <button 
                        on:click="{handleHitsHistoryByMonth}"
                        class="{viewHitsHistoryByMonth ? 
                        "px-4 py-2 rounded-t-lg bg-gray-700" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        M
                    </button>
                    <button
                        on:click="{handleHitsHistoryByDay}"
                        class="{viewHitsHistoryByDay ?
                        "px-4 py-2 rounded-t-lg bg-gray-700" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        D
                    </button>
                </div>      
            </div>
        
            <div class="flex flex-col px-4 pt-4 pb-2 rounded-l-lg rounded-b-lg bg-gray-700">
                <div class="flex pb-2 text-xs">
                    <div class="flex-1">
                        {#if viewHitsHistoryByDay}
                            Day
                        {:else if viewHitsHistoryByMonth}
                            Month
                        {:else if viewHitsHistoryByYear}
                            Year
                        {/if} 
                    </div>
                    <div class="w-12 text-right">
                        Hits
                    </div>
                </div>
                {#if $fetchingHitsByDate}
                    <div class="flex self-center items-center box-min-height">
                        <Pulse size="24" color="#10B981" unit="px" duration="1s" />
                    </div>
                {:else}
                    {#if viewHitsHistoryByDay}
                        {#each $hitsByDay as {day, hits}}
                            <ListItemBarChart
                                description = {day}
                                values = {$hitsByDay}
                                value = {hits}
                            />
                        {/each}
                    {:else if viewHitsHistoryByMonth}
                        {#each $hitsByMonth as {month, hits}}
                            <ListItemBarChart
                                description = {month}
                                values = {$hitsByMonth}
                                value = {hits}
                            />
                        {/each}
                    {:else if viewHitsHistoryByYear}
                        {#each $hitsByYear as {year, hits}}
                            <ListItemBarChart
                                description = {year}
                                values = {$hitsByYear}
                                value = {hits}
                            />
                        {/each}
                    {/if}
                {/if}
            </div>       
        </div>

        <div class="mt-4 text-white">
            <div class="w-full flex justify-between">
                <h2 class="p-2 text-gray-700">Top 10 pages</h2>
                <div class="flex flex-wrap">
                    <button 
                        on:click="{handlePageHitsOverall}"
                        class="{viewPageHitsOverall ? 
                        "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        Overall
                    </button>
                    <button
                        on:click="{handlePageHitsThisYear}"
                        class="{viewPageHitsThisYear ? 
                        "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        {currYear}
                    </button>
                </div>      
            </div>
        
            <div class="flex flex-col px-4 pt-4 pb-2 rounded-l-lg rounded-b-lg bg-gray-700">
                <div class="flex pb-2 text-xs">
                    <div class="flex-1">
                        Page
                    </div>
                    <div class="w-12 text-right">
                        Hits
                    </div>
                </div>
                {#if $fetchingHitsByUrl}
                    <div class="flex self-center items-center box-min-height">
                        <Pulse size="24" color="#10B981" unit="px" duration="1s" />
                    </div>
                {:else}
                    {#if viewPageHitsThisYear}
                        {#each $hitsByUrlCurrYear as { url, hits }}
                            <ListItemLink
                                url = {url}
                                value = {hits}
                            />
                        {/each}
                    {:else if viewPageHitsOverall}
                        {#each $hitsByUrlOverall as { url, hits }}
                            <ListItemLink
                                url = {url}
                                value = {hits}
                            />
                        {/each}
                    {/if}
                {/if}
            </div>
        
        </div>

        <div class="mt-4 text-white">
            <div class="w-full flex justify-between">
                <h2 class="p-2 text-gray-700">Top 10 browsers</h2>
                <div class="flex flex-wrap">
                    <button 
                        on:click="{handleBrowserHitsOverall}"
                        class="{viewBrowserHitsOverall ? 
                        "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        Overall
                    </button>
                    <button
                        on:click="{handleBrowserHitsThisYear}"
                        class="{viewBrowserHitsThisYear ? 
                        "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        {currYear}
                    </button>
                </div>      
            </div>
            
            <div class="flex flex-col px-4 pt-4 pb-2 rounded-l-lg rounded-b-lg bg-gray-700">
                <div class="flex pb-2 text-xs">
                    <div class="flex-1">
                        Browser
                    </div>
                    <div class="w-12 text-right">
                        Hits
                    </div>
                </div>
                {#if $fetchingHitsByBrowser}
                    <div class="flex self-center items-center box-min-height">
                        <Pulse size="24" color="#10B981" unit="px" duration="1s" />
                    </div>
                {:else}
                    {#if viewBrowserHitsThisYear}
                        {#each $hitsByBrowserCurrYear as {browser, hits}}
                            <ListItemBarChart
                                description = {browser}
                                values = {$hitsByBrowserCurrYear}
                                value = {hits}
                            />
                        {/each}
                    {:else if viewBrowserHitsOverall}
                        {#each $hitsByBrowserOverall as {browser, hits}}
                            <ListItemBarChart
                                description = {browser}
                                values = {$hitsByBrowserOverall}
                                value = {hits}
                            />
                        {/each}
                    {/if}
                {/if}
            </div>

        </div>

    </div>

    <div>
        <div class="mt-4 text-white">
            <div class="w-full flex justify-between">
                <h2 class="p-2 text-gray-700">Top 10 OS</h2>
                <div class="flex flex-wrap">
                    <button 
                        on:click="{handleOSHitsOverall}"
                        class="{viewOSHitsOverall ? 
                        "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        Overall
                    </button>
                    <button
                        on:click="{handleOSHitsThisYear}"
                        class="{viewOSHitsThisYear ? 
                        "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        {currYear}
                    </button>
                </div>      
            </div>
            
            <div class="flex flex-col px-4 pt-4 pb-2 rounded-l-lg rounded-b-lg bg-gray-700">
                <div class="flex pb-2 text-xs">
                    <div class="flex-1">
                        OS
                    </div>
                    <div class="w-12 text-right">
                        Hits
                    </div>
                </div>
                {#if $fetchingHitsByOS}
                    <div class="flex self-center items-center box-min-height">
                        <Pulse size="24" color="#10B981" unit="px" duration="1s" />
                    </div>
                {:else}
                    {#if viewOSHitsThisYear}
                        {#each $hitsByOSCurrYear as {os, hits}}
                            <ListItemBarChart
                                description = {os}
                                values = {$hitsByOSCurrYear}
                                value = {hits}
                            />
                        {/each}
                    {:else if viewOSHitsOverall}
                        {#each $hitsByOSOverall as {os, hits}}
                            <ListItemBarChart
                                description = {os}
                                values = {$hitsByOSOverall}
                                value = {hits}
                            />
                        {/each}
                    {/if}
                {/if}
            </div>

        </div>

        <div class="mt-4 text-white">
            <div class="w-full flex justify-between">
                <h2 class="p-2 text-gray-700">Top 10 languages</h2>
                <div class="flex flex-wrap">
                    <button 
                        on:click="{handleLanguageHitsOverall}"
                        class="{viewLanguageHitsOverall ? 
                        "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        Overall
                    </button>
                    <button
                        on:click="{handleLanguageHitsThisYear}"
                        class="{viewLanguageHitsThisYear ? 
                        "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
                        "px-4 py-2 rounded-t-lg bg-gray-100 text-emerald-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
                        {currYear}
                    </button>
                </div>      
            </div>
            
            <div class="flex flex-col px-4 pt-4 pb-2 rounded-l-lg rounded-b-lg bg-gray-700">
                <div class="flex pb-2 text-xs">
                    <div class="flex-1">
                        Language
                    </div>
                    <div class="w-12 text-right">
                        Hits
                    </div>
                </div>
                {#if $fetchingHitsByLanguage}
                    <div class="flex self-center items-center box-min-height">
                        <Pulse size="24" color="#10B981" unit="px" duration="1s" />
                    </div>
                {:else}
                    {#if viewLanguageHitsThisYear}
                        {#each $hitsByLanguageCurrYear as {language, hits}}
                            <ListItemBarChart
                                description = {language}
                                values = {$hitsByLanguageCurrYear}
                                value = {hits}
                            />
                        {/each}
                    {:else if viewLanguageHitsOverall}
                        {#each $hitsByLanguageOverall as {language, hits}}
                            <ListItemBarChart
                                description = {language}
                                values = {$hitsByLanguageOverall}
                                value = {hits}
                            />
                        {/each}
                    {/if}
                {/if}
            </div>

        </div>
    </div>
</div>
