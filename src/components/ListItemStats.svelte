<script>
  import { getMaxOfArray } from "../helpers/shared";
  import { formatNumber } from "../helpers/shared"
  
  export let description;
  export let values;
  export let value;

  // Calculate bar width in % based on max value (100%) of values for item value
  let bar = 0;
  $: if(values) {
    const max = getMaxOfArray(values.map(obj => obj.hits));
    bar = max > 0 ? Math.round(100 / max * value) : 0;
  }
</script>

<div class="flex pb-2 text-sm progress">
  <div class="h-6 flex-1 relative">
    <div class="rounded bg-gray-500 h-full" style={`width: ${bar}%`}></div>
    <div class="absolute top-0 left-1 overflow-hidden">{description}</div>
  </div>
  <div class="w-12 text-right">
    {formatNumber(value)}
  </div>
</div>

<style>
  .progress {
    line-height: 24px;
  }
</style>