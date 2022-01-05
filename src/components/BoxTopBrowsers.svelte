<script>
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";
  import ListItemStats from "./ListItemStats.svelte";
  import { hitsByBrowserOverall, hitsByBrowserCurrYear, fetchingHitsByBrowser } from "../stores/dataStore.js";

  const thisYear = new Date().getFullYear().toString();
  let viewHitsByBrowserOverall= true;
  let viewHitsByBrowserThisYear = false;

  // Limit browsers overall array to 10 objects
  let browsersOverall = [];
  $: if ($hitsByBrowserOverall) { browsersOverall = $hitsByBrowserOverall.slice(0,10)};

  // Limit browsers current year array to 10 objects
  let browsersCurrYear = [];
  $: if ($hitsByBrowserCurrYear) { browsersCurrYear = $hitsByBrowserCurrYear.slice(0,10)};

  /**
   * Get sum of hits for each browser
   */
   const gethitsByBrowserOverall = async () => {
    try {
      // Enable loading spinners
      fetchingHitsByBrowser.set(true);
      const response = await fetch(`/api/getHitsByBrowserOverall`);
      let data = await response.json();
      data = data.data.sort((a, b) => parseInt(b.hits) - parseInt(a.hits));
      // Save response in store
      hitsByBrowserOverall.set(data)
      // Disable loading spinners
      fetchingHitsByBrowser.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get sum of hits for each browser by current year
   */
   const getHitsByBrowsersByYear = async () => {
    try {
      // Enable loading spinners
      fetchingHitsByBrowser.set(true);
      const response = await fetch(`/api/getHitsByBrowserByYear?year=${thisYear}`);
      let data = await response.json();
      data = data.data.sort((a, b) => parseInt(b.hits) - parseInt(a.hits)).filter(obj => obj.hits > 0);;
      // Save response in store
      hitsByBrowserCurrYear.set(data)
      // Disable loading spinners
      fetchingHitsByBrowser.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Display overall hits for browsers
   * @param event click on "all""
   */
  function handleViewOverall(event) {
    // Set tabs
		viewHitsByBrowserOverall = true;
    viewHitsByBrowserThisYear = false;
    // Only fetch if store is empty
    if (!$hitsByBrowserOverall) {
      getHitsByBrowserssOverall();
    }
  }

  /**
   * Display hits by browsers of current year
   * @param event click on current year
   */
  function handleViewThisYear(event) {
    // Set tabs
		viewHitsByBrowserOverall = false;
    viewHitsByBrowserThisYear = true;
    // Only fetch if store is empty
    if (!$hitsByBrowserCurrYear) {
      getHitsByBrowsersByYear();
    }
  }

  onMount(async () => {
    gethitsByBrowserOverall();
  })
</script>

<div class="mt-4">
  <div class="w-full flex justify-between text-gray-700 bg-white">
    <h2 class="p-2">Top 10 browsers</h2>
    <div class="flex flex-wrap">
      <button 
        on:click="{handleViewThisYear}"
        class="{viewHitsByBrowserThisYear ? 
          "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
          "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        {thisYear}
      </button>
      <button
        on:click="{handleViewOverall}"
        class="{viewHitsByBrowserOverall ? 
        "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
        "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        All
      </button>
    </div>      
  </div>

  <div class="flex flex-col px-4 pt-4 pb-2 rounded-l-lg rounded-b-lg bg-gray-700 text-white">
    
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
        <Spinner
          size="24"
          speed="750"
          color="#FFFFFF"
          thickness="2"
          gap="40"
        />
      </div>
    {:else if viewHitsByBrowserOverall}
      {#each browsersOverall as {browser, hits}}
      <ListItemStats
        description = {browser}
        values = {$hitsByBrowserOverall}
        value = {hits}
      />
      {/each}   
    {:else if viewHitsByBrowserThisYear}
      {#each browsersCurrYear as {browser, hits}}
      <ListItemStats
        description = {browser}
        values = {$hitsByBrowserCurrYear}
        value = {hits}
      />
      {/each}   
    {/if} 
  </div>

</div>
