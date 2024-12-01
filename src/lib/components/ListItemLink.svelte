<script lang="ts">
    import { formatNumber } from "$lib/helper"
  
    export let url: string;
    export let value: number;
  
    const oUrl = new URL(url);
    const { pathname } = oUrl;
  
</script>
  
  <div class="flex pb-2 text-sm progress">
    <div class="h-6 flex-1 relative overflow-x-auto">
        <a 
            class="block text-emerald-500 hover:text-white"
            href="{url}" 
            target="blank">
            {pathname}
        </a>
    </div>
    <div class="w-12 text-right">
        {formatNumber(value)}
    </div>
</div>