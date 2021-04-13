<script>
  import { Link } from "svelte-routing";
  import Spinner from "svelte-spinner";
  import { getNotificationsContext } from 'svelte-notifications';
  import { authUserStore, requestPasswordRecovery, pendingIdentityCall } from '../stores/userStore';
  
  /**
   * Already logged in no need for pw recovery -> redirect to home
  */
  if ($authUserStore) {
    navigate("/", { replace: true });
  }

  let email = "";
  let showSuccessMessage = false;
  const { addNotification } = getNotificationsContext();

  function handleKeyUp(event) {
    if (event.target.value != "") {
      event.target.classList.add("filled");
    } else {
      event.target.classList.remove("filled");
    }
  }
  
  function handleRecovery(event) {
    pendingIdentityCall.set(true);
    requestPasswordRecovery(email).then(newUser => {
      showSuccessMessage = true
      pendingIdentityCall.set(false);
    }).catch(e => {
      pendingIdentityCall.set(false);
      addNotification({
        text: e.message,
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
{:else if showSuccessMessage}
  <p class="mb-4 text-sm text-gray-500">An email has been sent to {email} if that account exists to allow you to recover your account.</p>
  <Link to="/" class="inline-block align-baseline font-normal text-sm text-green-500 hover:text-gray-800">Home</Link>
{:else}
  <form id="recover_form" on:submit|preventDefault="{handleRecovery}">
    <h2 class="mb-4 text-gray-800">
      Forgot Your Password?
    </h2>
    <p class="mb-4 text-sm text-gray-500">
      Provide the email address associated with your account.
    </p>
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
    <div class="flex items-center justify-between">
      <Link to="/" class="inline-block align-baseline font-normal text-sm text-green-500 hover:text-gray-800">Home</Link>
      <button
        type="submit"
        class="bg-green-500 hover:bg-gray-700 border border-green-500 hover:border-gray-700 inline-block text-white py-2 px-4 rounded-lg"
        disabled={!email}>
        Recover Account
      </button>
    </div>
  </form>
{/if}
