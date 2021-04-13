<script>
  import { Link } from "svelte-routing";
  import { getNotificationsContext } from 'svelte-notifications';
  import Spinner from "svelte-spinner";
  import { authUserStore, attemptLogin, pendingIdentityCall } from "../stores/userStore";

  if ($authUserStore) {
    navigate("/", { replace: true });
  }

  let password = "";
  let email = "";
  const { addNotification } = getNotificationsContext();

  function handleKeyUp(event) {
    if (event.target.value != "") {
      event.target.classList.add("filled");
    } else {
      event.target.classList.remove("filled");
    }
  }

  function handleLogin(event) {
    attemptLogin(email, password).catch(e => {
      password = "";
      email = "";
      addNotification({
        text: e,
        position: 'bottom-center',
        type: 'danger',
        removeAfter: 8000
      })
    })
  }
</script>

{#if $pendingIdentityCall}
  <Spinner
    size="50"
    speed="750"
    color="#10B981"
    thickness="2"
    gap="40"
  />
{:else}
  <form id="login_form" on:submit|preventDefault="{handleLogin}">
    <div class="mb-4 relative">
      <input
        id="email"
        class="input border border-gray-400 appearance-none rounded-lg w-full px-3 pt-5 pb-2 focus focus:border-green-400 focus:outline-none active:outline-none active:border-green-400"
        type="email"
        bind:value="{email}"
        on:keyup="{handleKeyUp}"
        required
      />
      <label
        for="email"
        class="label absolute mb-0 -mt-2 pt-4 pl-3 leading-tighter text-gray-400 text-base cursor-text">
        Email
      </label>
    </div>
    <div class="mb-4 relative">
      <input
        id="pwd"
        class="input border border-gray-400 appearance-none rounded-lg w-full px-3 pt-5 pb-2 focus focus:border-green-400 focus:outline-none active:outline-none active:border-green-400"
        type="password"
        bind:value="{password}"
        on:keyup="{handleKeyUp}"
        required
      />
      <label
        for="pwd"
        class="label absolute mb-0 -mt-2 pt-4 pl-3 leading-tighter text-gray-400 text-base cursor-text">
        Password
      </label>
    </div>
    <div class="flex items-center justify-between">
      <Link to="/recover" class="inline-block align-baseline font-normal text-sm text-green-500 hover:text-gray-800">Forgot password?</Link>
      <button
        type="submit"
        class="bg-green-500 hover:bg-gray-700 border border-green-500 hover:border-gray-700 inline-block text-white py-2 px-4 rounded-lg"
        disabled={!email || !password}>
        Login
      </button>
    </div>
  </form>
{/if}