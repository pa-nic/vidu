<script>
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";
  import ListItemLink from "./ListItemLink.svelte";
  import { hitsByUrlOverall, hitsByUrlCurrYear, fetchingHitsByUrls } from "../stores/dataStore.js";

  const thisYear = new Date().getFullYear().toString();
  let viewPageHitsOverall = false;
  let viewPageHitsThisYear = true;

  // Limit pages overall array to 10 objects
  let pagesOverall = [];
  $: if ($hitsByUrlOverall) { pagesOverall = $hitsByUrlOverall.slice(0,10)};

  // Limit pages current year array to 10 objects
  let pagesCurrYear = [];
  $: if ($hitsByUrlCurrYear) { pagesCurrYear = $hitsByUrlCurrYear.slice(0,10)};

  /**
   * Get sum of hits for each url
   */
   const gethitsByUrlOverall = async () => {
    try {
      // Enable loading spinners
      fetchingHitsByUrls.set(true);
      const response = await fetch(`/api/getHitsByUrlOverall`);
      let data = await response.json();
      data = data.data.sort((a, b) => parseInt(b.hits) - parseInt(a.hits));
      // Save response in store
      hitsByUrlOverall.set(data)
      // Disable loading spinners
      fetchingHitsByUrls.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get sum of hits for each url by current year
   */
   const getHitsByUrlsByYear = async () => {
    try {
      // Enable loading spinners
      fetchingHitsByUrls.set(true);
      const response = await fetch(`/api/getHitsByUrlByYear?year=${thisYear}`);
      let data = await response.json();
      data = data.data.sort((a, b) => parseInt(b.hits) - parseInt(a.hits)).filter(obj => obj.hits > 0);
      // Save response in store
      hitsByUrlCurrYear.set(data)
      // Disable loading spinners
      fetchingHitsByUrls.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Display overall hits for urls
   * @param event click on "all""
   */
  function handleViewOverall(event) {
    // Set tabs
		viewPageHitsOverall = true;
    viewPageHitsThisYear = false;
    // Only fetch if store is empty
    if (!$hitsByUrlOverall) {
      gethitsByUrlOverall();
    }
  }

  /**
   * Display hits for urls of current year
   * @param event click on current year
   */
  function handleViewThisYear(event) {
    // Set tabs
		viewPageHitsOverall = false;
    viewPageHitsThisYear = true;
    // Only fetch if store is empty
    if (!$hitsByUrlCurrYear) {
      getHitsByUrlsByYear();
    }
  }

  onMount(async () => {
    getHitsByUrlsByYear();
  })
</script>

<div class="mt-4">
  <div class="w-full flex justify-between text-gray-700 bg-white">
    <h2 class="p-2">Top 10 pages</h2>
    <div class="flex flex-wrap">
      <button 
        on:click="{handleViewOverall}"
        class="{viewPageHitsOverall ? 
          "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
          "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        All
      </button>
      <button
        on:click="{handleViewThisYear}"
        class="{viewPageHitsThisYear ? 
          "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
          "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        {thisYear}
      </button>
    </div>      
  </div>

  <div class="flex flex-col px-4 pt-4 pb-2 rounded-l-lg rounded-b-lg bg-gray-700 text-white">
    
    <div class="flex pb-2 text-xs">
      <div class="flex-1">
        Page
      </div>
      <div class="w-12 text-right">
        Hits
      </div>
    </div>
    {#if $fetchingHitsByUrls}
      <div class="flex self-center items-center box-min-height">
        <Spinner
          size="24"
          speed="750"
          color="#FFFFFF"
          thickness="2"
          gap="40"
        />
      </div>
    {:else if viewPageHitsOverall}
      {#each pagesOverall as { url, hits }}
        <ListItemLink
          url = {url}
          value = {hits}
        />
      {/each}   
    {:else if viewPageHitsThisYear}
      {#each pagesCurrYear as { url, hits }}
        <ListItemLink
          url = {url}
          value = {hits}
        />
      {/each}   
    {/if} 
  </div>

</div>