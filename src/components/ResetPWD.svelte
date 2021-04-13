<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import Spinner from "svelte-spinner";
  import { getNotificationsContext } from 'svelte-notifications';
  import { getParams } from "../helpers/authorize-tokens.js";
  import { updateUserSettings, processRecovery, authUserStore, pendingIdentityCall } from '../stores/userStore';

  let password = "";
  let confirmPassword = "";
  let showSuccessMessage = false;
  const { addNotification } = getNotificationsContext();

  /**
   * Get recovery token from signup URL params
   * i.e. example.com/reset_pwd?t=<recovery_token>
   */
  const recovery_token = getParams().get("t");

  function handleKeyUp(event) {
    if (event.target.value != "") {
      event.target.classList.add("filled");
    } else {
      event.target.classList.remove("filled");
    }
  }

  function handleReset(event) {
    if (password === confirmPassword) {
      pendingIdentityCall.set(true);
      updateUserSettings($authUserStore.email, password).then(u => {
        pendingIdentityCall.set(false);
        showSuccessMessage = true;
      }).catch(e => {
        pendingIdentityCall.set(false);
        addNotification({
          text: e,
          position: 'bottom-center',
          type: 'danger',
          removeAfter: 8000
        })
      });
    } else {
      addNotification({
        text: "Your passwords do not match!",
        position: 'bottom-center',
        type: 'danger',
        removeAfter: 8000
      })
    } 
  }

  onMount(async () => {
    pendingIdentityCall.set(true);
    processRecovery(recovery_token).then(u => {
      pendingIdentityCall.set(false);
    }).catch(e => {
      pendingIdentityCall.set(false);
      addNotification({
        text: e,
        position: 'bottom-center',
        type: 'danger',
        removeAfter: 8000
      })
    });
  })
</script>

{#if $pendingIdentityCall}
  <Spinner
    size="50"
    speed="750"
    color="#10B981"
    thickness="2"
    gap="40"
  />
{:else if showSuccessMessage}
  <p class="mb-4 text-sm text-gray-500">Your user settings have been updated.</p>
  <Link to="/" class="inline-block align-baseline font-normal text-sm text-green-500 hover:text-gray-800">Home</Link>
{:else}
  <form id="reset_form" on:submit|preventDefault="{handleReset}">
    <h2 class="mb-4 text-gray-800">
      Reset Password
    </h2>
    <p class="mb-4 text-sm text-gray-500">
      We're almost done - please choose a new password for your account.
    </p>
    <div class="mb-4 relative">
      <input
        id="password"
        class="input border border-gray-400 appearance-none rounded-lg w-full px-3 pt-5 pb-2 focus focus:border-green-400 focus:outline-none active:outline-none active:border-green-400"
        type="password"
        bind:value="{password}"
        on:keyup="{handleKeyUp}"
        required
      />
      <label
        for="password"
        class="label absolute mb-0 -mt-2 pt-4 pl-3 leading-tighter text-gray-400 text-base cursor-text">
        New Password
      </label>
    </div>
    <div class="mb-4 relative">
      <input
        id="password-confirmation"
        class="input border border-gray-400 appearance-none rounded-lg w-full px-3 pt-5 pb-2 focus focus:border-green-400 focus:outline-none active:outline-none active:border-green-400"
        type="password"
        bind:value="{confirmPassword}"
        on:keyup="{handleKeyUp}"
        required
      />
      <label
        for="password-confirmation"
        class="label absolute mb-0 -mt-2 pt-4 pl-3 leading-tighter text-gray-400 text-base cursor-text">
        Confirm New Password
      </label>
    </div>
    <div class="flex items-center justify-between">
      <Link to="/" class="inline-block align-baseline font-normal text-sm text-green-500 hover:text-gray-800">Home</Link>
      <button
        type="submit"
        class="bg-green-500 hover:bg-gray-700 border border-green-500 hover:border-gray-700 inline-block text-white py-2 px-4 rounded-lg"
        disabled={!password || !confirmPassword}>
        Save
      </button>
    </div>
  </form>
{/if}