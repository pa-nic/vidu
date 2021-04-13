<script>
  import { formatNumber } from "../helpers/shared"

  export let url;
  export let value;

  const oUrl = new URL(url);
  const { pathname } = oUrl;

</script>

<div class="flex pb-2 text-sm progress">
  <div class="h-6 flex-1 relative overflow-x-auto">
    <a 
      class="block text-green-500 hover:text-white"
      href="{url}" 
      target="blank">
      {pathname}
    </a>
  </div>
  <div class="w-12 text-right">
    {formatNumber(value)}
  </div>
</div>