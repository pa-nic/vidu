<script>
  import { Link } from "svelte-routing";
  import Spinner from "svelte-spinner";
  import { getNotificationsContext } from 'svelte-notifications';
  import { updateUserSettings, authUserStore, pendingIdentityCall } from '../stores/userStore';
  
  /**
  * Not logged in -> redirect to home
  */
  if (!$authUserStore) {
    navigate("/", { replace: true });
  }

  let email = $authUserStore.email;
  let password = "";
  let confirmPassword = "";
  const { addNotification } = getNotificationsContext();

  function handleKeyUp(event) {
    if (event.target.value != "") {
      event.target.classList.add("filled");
    } else {
      event.target.classList.remove("filled");
    }
  }

  function handleUpdate(event) {
    if (password === confirmPassword) {
      pendingIdentityCall.set(true);
      updateUserSettings($authUserStore.email, password).then(u => {
        password = "";
        confirmPassword = "";
        pendingIdentityCall.set(false);
        addNotification({
          text: "Your user settings have been updated.",
          position: 'bottom-center',
          type: 'success',
          removeAfter: 8000
        })
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
  <form id="reset_form" on:submit|preventDefault="{handleUpdate}">
    <h2 class="mb-4 text-gray-800">
      User Settings
    </h2>
    <div class="mb-4 relative">
      <input
        id="email"
        class="input border border-gray-400 appearance-none rounded-lg w-full px-3 pt-5 pb-2 focus focus:border-green-400 focus:outline-none active:outline-none active:border-green-400 filled"
        type="email"
        bind:value="{email}"
        on:keyup="{handleKeyUp}"
        required
        disabled
      />
      <label
        for="email"
        class="label absolute mb-0 -mt-2 pt-4 pl-3 leading-tighter text-gray-400 text-base cursor-text">
        Email
      </label>
    </div>
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