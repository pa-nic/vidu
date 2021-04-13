<script>
  import Spinner from "svelte-spinner";
  import { formatNumber } from "../helpers/shared"

  export let heading;
  export let data;
  export let isFetching;
  let classes=$$props.class
</script>

<div class={classes}>
  <div class="flex flex-col text-gray-100">
    <div class="text-sm mb-1">
      {heading}
    </div>
    {#if isFetching}
        <div class="self-center">
          <Spinner
            size="24"
            speed="750"
            color="#FFFFFF"
            thickness="2"
            gap="40"
          />
        </div>
      {:else}
        <div>
          <span class="text-2xl text-white">
            {formatNumber(data)}
          </span>
          <span class="text-xs">
            hits
          </span>
        </div>
      {/if}
  </div>
</div>