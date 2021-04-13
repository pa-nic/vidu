<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import BoxTopRow from "./BoxTopRow.svelte";
  import BoxHitsHistory from "./BoxHitsHistory.svelte";
  import BoxTopBrowsers from "./BoxTopBrowsers.svelte";
  import BoxTopPages from "./BoxTopPages.svelte";
  import BoxTopOS from "./BoxTopOS.svelte";
  import BoxTopLanguages from "./BoxTopLanguages.svelte";
  import { hitsOverall, hitsTodayUnique , hitsByDay,
    fetchingHitsOverall, fetchingHitsTodayUnique, fetchingHitsByDay 
    } from "../stores/dataStore.js";

  // Todyas hits
  let hitsToday = 0;
  // Sum hits of last seven days
  let hitsLastSevenDays = 0;

  $: if($hitsByDay) {
    hitsToday = $hitsByDay[0].hits;
    hitsLastSevenDays = $hitsByDay.slice(0,7).map(o => o.hits).reduce((sum, n) => sum + n, 0);
  }

  /**
   * Get unique hits for today
   */
  const getHitsTodayUnique = async () => {
    try {
      // Enable loading spinners
      fetchingHitsTodayUnique.set(true);
      const response = await fetch(`/api/getHitsByDateUnique`);
      const data = await response.json();
      // Save response in store
      hitsTodayUnique.set(data)
      // Disable loading spinners
      fetchingHitsTodayUnique.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Get sum of all hits (ever logged)
   */
  const getHitsOverall = async () => {
    try {
      // Enable loading spinners
      fetchingHitsOverall.set(true);
      const response = await fetch(`/api/getHitsOverall`);
      const data = await response.json();
      // Save response in store
      hitsOverall.set(data)
      // Disable loading spinners
      fetchingHitsOverall.set(false);
    } catch (err) {
      console.error(err);
    }
  }

  onMount(async () => {
    getHitsTodayUnique();
    getHitsOverall();
  })
</script>

<div class="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2" in:fade>

  <BoxTopRow 
    heading="Today"
    data={hitsToday}
    isFetching={$fetchingHitsByDay}
    class="p-4 rounded-lg bg-green-500"
  />

  <BoxTopRow 
    heading="Today (unique)"
    data={$hitsTodayUnique}
    isFetching={$fetchingHitsTodayUnique}
    class="p-4 rounded-lg bg-gray-700"
  />

  <BoxTopRow 
    heading={"Last 7 days"}
    data={hitsLastSevenDays}
    isFetching={$fetchingHitsByDay}
    class="p-4 rounded-lg bg-gray-700"
  />

  <BoxTopRow 
    heading={"Overall"}
    data={$hitsOverall}
    isFetching={$fetchingHitsOverall}
    class="p-4 rounded-lg bg-gray-700"
  />

</div>

<div class="w-full grid gap-2 grid-cols-1 sm:grid-cols-2" in:fade>
  <div>
    <BoxHitsHistory />

    <BoxTopPages />

    <BoxTopBrowsers />
  </div>
  <div>
    <BoxTopOS />

    <BoxTopLanguages />
  </div>

</div>

<style>
  :global(.box-min-height) {
    min-height: 200px;
  }
</style>