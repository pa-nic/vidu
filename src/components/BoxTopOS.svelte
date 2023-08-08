<script>
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";
  import ListItemStats from "./ListItemStats.svelte";
  import { hitsByOSOverall, hitsByOSCurrYear, fetchingHitsByOS } from "../stores/dataStore.js";

  const thisYear = new Date().getFullYear().toString();
  let viewhitsByOSOverall= false;
  let viewHitsByOSThisYear = true;

  // Limit OS overall array to 10 objects
  let OSOverall = [];
  $: if ($hitsByOSOverall) { OSOverall = $hitsByOSOverall.slice(0,10)};

  // Limit OS current year array to 10 objects
  let OSCurrYear = [];
  $: if ($hitsByOSCurrYear) { OSCurrYear = $hitsByOSCurrYear.slice(0,10)};

  /**
   * Get sum of hits for each language
   */
   const getHitsByOSOverall = async () => {
    try {
      // Enable loading spinners
      fetchingHitsByOS.set(true);
      const response = await fetch(`/api/getHitsByOSOverall`);
      let data = await response.json();
      data = data.data.sort((a, b) => parseInt(b.hits) - parseInt(a.hits));
      // Save response in store
      hitsByOSOverall.set(data)
      // Disable loading spinners
      fetchingHitsByOS.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get sum of hits for each language by current year
   */
   const getHitsByOSByYear = async () => {
    try {
      // Enable loading spinners
      fetchingHitsByOS.set(true);
      const response = await fetch(`/api/getHitsByOSByYear?year=${thisYear}`);
      let data = await response.json();
      data = data.data.sort((a, b) => parseInt(b.hits) - parseInt(a.hits)).filter(obj => obj.hits > 0);;
      // Save response in store
      hitsByOSCurrYear.set(data)
      // Disable loading spinners
      fetchingHitsByOS.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Display overall hits for OS
   * @param event click on "all""
   */
  function handleViewOverall(event) {
    // Set tabs
		viewhitsByOSOverall = true;
    viewHitsByOSThisYear = false;
    // Only fetch if store is empty
    if (!$hitsByOSOverall) {
      getHitsByOSOverall();
    }
  }

  /**
   * Display hits by OS of current year
   * @param event click on current year
   */
  function handleViewThisYear(event) {
    // Set tabs
		viewhitsByOSOverall = false;
    viewHitsByOSThisYear = true;
    // Only fetch if store is empty
    if (!$hitsByOSCurrYear) {
      getHitsByOSByYear();
    }
  }

  onMount(async () => {
    getHitsByOSByYear();
  })
</script>

<div class="mt-4">
  <div class="w-full flex justify-between text-gray-700 bg-white">
    <h2 class="p-2">Top 10 OS</h2>
    <div class="flex flex-wrap">
      <button 
        on:click="{handleViewOverall}"
        class="{viewhitsByOSOverall ?  
          "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
          "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        All
      </button>
      <button
        on:click="{handleViewThisYear}"
        class="{viewHitsByOSThisYear ?
          "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
          "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        {thisYear}
      </button>
    </div>      
  </div>

  <div class="flex flex-col px-4 pt-4 pb-2 rounded-l-lg rounded-b-lg bg-gray-700 text-white">
    
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
        <Spinner
          size="24"
          speed="750"
          color="#FFFFFF"
          thickness="2"
          gap="40"
        />
      </div>
    {:else if viewhitsByOSOverall}
      {#each OSOverall as {os, hits}}
      <ListItemStats
        description = {os}
        values = {$hitsByOSOverall}
        value = {hits}
      />
      {/each}   
    {:else if viewHitsByOSThisYear}
      {#each OSCurrYear as {os, hits}}
      <ListItemStats
        description = {os}
        values = {$hitsByOSCurrYear}
        value = {hits}
      />
      {/each}   
    {/if} 
  </div>

</div>