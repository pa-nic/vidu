<script>
  import { authUserStore } from '../stores/userStore';
  import LoginForm from "./Login.svelte";
  import DataOverview from "./DataOverview.svelte";
</script>

{#if $authUserStore}
  <DataOverview/>
{:else}
	<LoginForm/>
{/if}