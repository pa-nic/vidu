<script>
  import { onMount } from "svelte";
  import Spinner from "svelte-spinner";
  import ListItemStats from "./ListItemStats.svelte";
  import { hitsByLanguageOverall, hitsByLanguageCurrYear, fetchingHitsByLanguage } from "../stores/dataStore.js";

  const thisYear = new Date().getFullYear().toString();
  let viewhitsByLanguageOverall= false;
  let viewHitsByLanguageThisYear = true;

  // Limit languages overall array to 10 objects
  let languagesOverall = [];
  $: if ($hitsByLanguageOverall) { languagesOverall = $hitsByLanguageOverall.slice(0,10)};

  // Limit languages current year array to 10 objects
  let languagesCurrYear = [];
  $: if ($hitsByLanguageCurrYear) { languagesCurrYear = $hitsByLanguageCurrYear.slice(0,10)};

  /**
   * Get sum of hits for each language
   */
   const getHitsByLanguagesOverall = async () => {
    try {
      // Enable loading spinners
      fetchingHitsByLanguage.set(true);
      const response = await fetch(`/api/getHitsByLanguageOverall`);
      let data = await response.json();
      data = data.data.sort((a, b) => parseInt(b.hits) - parseInt(a.hits));
      // Save response in store
      hitsByLanguageOverall.set(data)
      // Disable loading spinners
      fetchingHitsByLanguage.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get sum of hits for each language by current year
   */
   const getHitsByLanguageByYear = async () => {
    try {
      // Enable loading spinners
      fetchingHitsByLanguage.set(true);
      const response = await fetch(`/api/getHitsByLanguageByYear?year=${thisYear}`);
      let data = await response.json();
      data = data.data.sort((a, b) => parseInt(b.hits) - parseInt(a.hits)).filter(obj => obj.hits > 0);;
      // Save response in store
      hitsByLanguageCurrYear.set(data)
      // Disable loading spinners
      fetchingHitsByLanguage.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Display overall hits for languages
   * @param event click on "all""
   */
  function handleViewOverall(event) {
    // Set tabs
		viewhitsByLanguageOverall = true;
    viewHitsByLanguageThisYear = false;
    // Only fetch if store is empty
    if (!$hitsByLanguageOverall) {
      getHitsByLanguagesOverall();
    }
  }

  /**
   * Display hits by languages of current year
   * @param event click on current year
   */
  function handleViewThisYear(event) {
    // Set tabs
		viewhitsByLanguageOverall = false;
    viewHitsByLanguageThisYear = true;
    // Only fetch if store is empty
    if (!$hitsByLanguageCurrYear) {
      getHitsByLanguageByYear();
    }
  }

  onMount(async () => {
    getHitsByLanguageByYear();
  })
</script>

<div class="mt-4">
  <div class="w-full flex justify-between text-gray-700 bg-white">
    <h2 class="p-2">Top 10 languages</h2>
    <div class="flex flex-wrap">
      <button 
        on:click="{handleViewOverall}"
        class="{viewhitsByLanguageOverall ?  
          "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
          "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        All
      </button>
      <button
        on:click="{handleViewThisYear}"
        class="{viewHitsByLanguageThisYear ?
          "px-4 py-2 rounded-t-lg bg-gray-700 text-white" : 
          "px-4 py-2 rounded-t-lg bg-gray-100 text-green-500 hover:text-gray-700 hover:cursor-pointer hover:bg-gray-200"}">
        {thisYear}
      </button>
    </div>      
  </div>

  <div class="flex flex-col px-4 pt-4 pb-2 rounded-l-lg rounded-b-lg bg-gray-700 text-white">
    
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
        <Spinner
          size="24"
          speed="750"
          color="#FFFFFF"
          thickness="2"
          gap="40"
        />
      </div>
    {:else if viewhitsByLanguageOverall}
      {#each languagesOverall as {language, hits}}
      <ListItemStats
        description = {language}
        values = {$hitsByLanguageOverall}
        value = {hits}
      />
      {/each}   
    {:else if viewHitsByLanguageThisYear}
      {#each languagesCurrYear as {language, hits}}
      <ListItemStats
        description = {language}
        values = {$hitsByLanguageCurrYear}
        value = {hits}
      />
      {/each}   
    {/if} 
  </div>

</div>