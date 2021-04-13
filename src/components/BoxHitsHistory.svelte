<script>
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";
  import ListItemStats from "./ListItemStats.svelte";
  import { hitsByDay, hitsByMonth, hitsByYear, fetchingHitsByDay, fetchingHitsByMonth,
  fetchingHitsByYear } from "../stores/dataStore.js";
  import { getNamesOfLastXDays, getNamesOfLastXMonths } from "../helpers/shared";
  
  let viewHitsHistoryByDay = true;
  let viewHitsHistoryByMonth = false;
  let viewHitsHistoryByYear = false;

  // UTC time object
  const currDate = new Date(new Date().toUTCString());
  // Get number of current day of week (starting with Sunday = 0)
  const today = currDate.getDay();
  // Get number of current month of year (starting with January = 0)
  const currMonth = currDate.getMonth();
  // Get current year
  const currYear = currDate.getYear() + 1900;
  // Array of week day names going back x days from today
  let namesOfLastXDays = [];
  let hitsHistoryByDays = [];
  $: if ($hitsByDay) { hitsHistoryByDays = $hitsByDay};
  // Array of month names going back x months from this mmoth
  let namesOfLastXMonths = [];
  let hitsHistoryByMonth = [];
  $: if ($hitsByMonth) { hitsHistoryByMonth = $hitsByMonth};
  // Array of last x years
  let lastXYears = [];
  let hitsHistoryByYears = [];
  $: if ($hitsByYear) { hitsHistoryByYears = $hitsByYear};

  /**
   * Get sum of hits for each of the last "x" days
   * @param days For how many days?
   */
  async function gethitsByDay(days) {
    // Create array of "days" length with content [0, 1, 2, 3 ...]
    const daysToGet = [...Array(days).keys()];
    // Get week day names going back x days from today
    namesOfLastXDays = getNamesOfLastXDays(today, days);

    // Fetching sum of hits for each day
    const getHitsByDay = async days => {
      const response = await fetch(`/api/getHitsXDaysAgo?days=${days}`);
      return await response.json();
    }

    try {
      // Enable loading spinners
      fetchingHitsByDay.set(true);
      // Awayit promises fetching sum for each day
      const promises = daysToGet.map(getHitsByDay);
      const response = await Promise.all(promises);
      const object = namesOfLastXDays.map((day, i) => {
        return {
          day: day,
          hits: response[i]
        }
      });
      // Save hits in store
      hitsByDay.set(object);
      // Disable loading spinners
      fetchingHitsByDay.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get sum of hits for each of the last "x" months
   * @param month For how many months?
   */
   async function gethitsByMonth(months) {
    // Create array of "months" length sarting with current month:
    // i.e. May = 4 => [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3]
    const monthsToGet = Array.from({length: months}, (_, i) => (currMonth + (12 * Math.ceil(months / 12)) - i ) % 12);
    // Get month names going back x months from this mmoth
    namesOfLastXMonths = getNamesOfLastXMonths(currMonth, months);

    // Fetching sum of hits for each month
    const getHitsByMonth = async month => {
      // ToDo: Make it possible to go back further than 12 month
      let year = month > currMonth ? currYear - 1 : currYear;
      month = month + 1;
      
      const response = await fetch(`/api/getHitsByYearByMonth?year=${year}&month=${month}`);
      return await response.json();
    }

    try {
      // Enable loading spinners
      fetchingHitsByMonth.set(true);
      // Awayit promises fetching sum for each month
      const promises = monthsToGet.map(getHitsByMonth);
      const response = await Promise.all(promises);
      const object = namesOfLastXMonths.map((month, i) => {
        return {
          month: month,
          hits: response[i]
        }
      });
      // Save hits in store
      hitsByMonth.set(object);
      // Disable loading spinners
      fetchingHitsByMonth.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get sum of hits for each of the last "x" years
   * @param year For how many months?
   */
   async function gethitsByYear(years) {
    // Create array of "years" length sarting with current year:
    // i.e. [2021, 2020, 2019, ...]
    lastXYears = Array.from({length: years}, (_, i) => (currYear - i ));

    // Fetching sum of hits for each year
    const getHitsByYear = async year => {
      const response = await fetch(`/api/getHitsByYear?year=${year}`);
      return await response.json();
    }

    try {
      // Enable loading spinners
      fetchingHitsByYear.set(true);
      // Awayit promises fetching sum for each year
      const promises = lastXYears.map(getHitsByYear);
      const response = await Promise.all(promises);
      const object = lastXYears.map((year, i) => {
        return {
          year: year,
          hits: response[i]
        }
      });
      // Save hits in store
      hitsByYear.set(object);
      // Disable loading spinners
      fetchingHitsByYear.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Display hits history by years
   * @param event click on "Y""
   */
  function handleViewYears(event) {
    // Set tabs
		viewHitsHistoryByDay = false;
    viewHitsHistoryByMonth = false;
    viewHitsHistoryByYear = true;
    // Only fetch if store is empty
    if (!$hitsByYear) {
      gethitsByYear(8);
    }
  }

  /**
   * Display hits history by months
   * @param event click on "M"
   */
  function handleViewMonths(event) {
    // Set tabs
		viewHitsHistoryByDay = false;
    viewHitsHistoryByMonth = true;
    viewHitsHistoryByYear = false;
    // Only fetch if store is empty
    if (!$hitsByMonth) {
      gethitsByMonth(12);
    }
  }

  /**
   * Display hits history by days
   * @param event click on "D"
   */
  function handleViewDays(event) {
    // Set tabs
		viewHitsHistoryByDay = true;
    viewHitsHistoryByMonth = false;
    viewHitsHistoryByYear = false;
    // Only fetch if store is empty
    if (!$hitsByDay) {
      gethitsByDay(7);
    }
  }

  onMount(async () => {
    gethitsByDay(7);
  })
</script>

<div class="mt-4">
  <div class="w-full flex justify-between text-gray-700 bg-white">
    <h2 class="p-2">Hits history</h2>
    <div class="flex flex-wrap">
      <button 
        on:click="{handleViewYears}"
        class="{viewHitsHistoryByYear ? 
          "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
          "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        Y
      </button>
      <button 
        on:click="{handleViewMonths}"
        class="{$viewHitsHistoryByMonth ? 
          "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
          "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        M
      </button>
      <button
      on:click="{handleViewDays}"
      class="{$viewHitsHistoryByDay ?
        "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
        "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        D
      </button>
    </div>      
  </div>

  <div class="flex flex-col px-4 pt-4 pb-2 rounded-l-lg rounded-b-lg bg-gray-700 text-white">
    
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
    {#if viewHitsHistoryByDay}
      {#if $fetchingHitsByDay}
        <div class="flex self-center items-center box-min-height">
          <Spinner
            size="24"
            speed="750"
            color="#FFFFFF"
            thickness="2"
            gap="40"
          />
        </div>
      {:else}
        {#each hitsHistoryByDays as {day, hits}}
        <ListItemStats
          description = {day}
          values = {$hitsByDay}
          value = {hits}
        />
        {/each}   
    {/if}  
    {:else if viewHitsHistoryByMonth}
      {#if $fetchingHitsByMonth}
        <div class="flex self-center items-center box-min-height">
          <Spinner
            size="24"
            speed="750"
            color="#FFFFFF"
            thickness="2"
            gap="40"
          />
        </div>
      {:else}
        {#each hitsHistoryByMonth as {month, hits}}
        <ListItemStats
          description = {month}
          values = {$hitsByMonth}
          value = {hits}
        />
        {/each}
      {/if}   
    {:else if viewHitsHistoryByYear}
      {#if $fetchingHitsByYear}
        <div class="flex self-center items-center box-min-height">
          <Spinner
            size="24"
            speed="750"
            color="#FFFFFF"
            thickness="2"
            gap="40"
          />
        </div>
      {:else}
        {#each hitsHistoryByYears as {year, hits}}
          <ListItemStats
            description = {year}
            values = {$hitsByYear}
            value = {hits}
          />
        {/each}   
      {/if}
    {/if} 
  </div>

</div>