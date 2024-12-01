<script lang="ts">
    import { formatNumber } from "$lib/helper"
	export let heading: string;
	export let data: number;
	let classes = $$props.class;
</script>

<div class={classes}>
    <h2 class="text-sm mb-1">{heading}</h2>
    <p>
        <span class="text-2xl">{formatNumber(data)}</span>
        <span class="text-xs"> hits</span>
    </p>
</div>
