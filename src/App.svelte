<script>
	import { Router, Route, Link } from "svelte-routing";
	import Notifications from 'svelte-notifications';
  import Signup from "./components/Signup.svelte";
	import Recover from "./components/Recover.svelte";
	import ResetPWD from "./components/ResetPWD.svelte";
	import User from "./components/User.svelte";
  import Home from "./components/Home.svelte";
	import LogoutBtn from "./components/LogoutBtn.svelte";
	import { detectTokens } from "./helpers/authorize-tokens.js";
	import { authUserStore } from "./stores/userStore";

	/**
	 * Detect invite and recovery tokens
	 */
	detectTokens();

	let src = "images/logo.png";
</script>

<Notifications>
	<Router>
		<div>
			<div class="container flex flex-col items-center min-h-screen max-w-screen-sm mx-auto px-4">
				<nav class="flex items-center w-full mb-4"
					class:justify-between={$authUserStore}
					class:justify-center={!$authUserStore}
				>
					<Link to="/">
						<img {src} alt="logo" width="75" height="75" />
					</Link>
					{#if $authUserStore}
						<div class="flex items-center">
							<Link to="/user" class="inline-block align-baseline font-normal text-sm text-green-500 hover:text-gray-800 mr-6">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							</Link>
							<LogoutBtn />
						</div>
					{/if}
				</nav>
				<Route path="signup" component="{Signup}"/>
				<Route path="recover" component="{Recover}"/>
				<Route path="reset" component="{ResetPWD}"/>
				<Route path="user" component="{User}"/>
				<Route path="/" component="{Home}"/>
			</div>
		</div>
	</Router>
</Notifications>

<style>
	:global(.input) {
		transition: border 0.2s ease-in-out;
		min-width: 260px;
	}

	:global(.input:focus + .label),
	:global(.input:active + .label),
	:global(.input.filled + .label) {
		/* font-size: .75rem; */
		/* transition: all 0.2s ease-out; */
		/* top: -0.1rem; */
		@apply transition-all;
		@apply duration-200;
		@apply ease-out;
		@apply text-xs;
		@apply text-green-500;
		@apply top-0.5;
	}

	:global(.label) {
		/* transition: all 0.2s ease-out; */
		/* top: 0.4rem; */
		/* left: 0; */
		@apply transition-all;
		@apply duration-200;
		@apply ease-out;
		@apply top-2;
		@apply left-0;
	}

	:global(button:disabled) {
		@apply cursor-not-allowed;
		@apply opacity-90;
	}
</style>