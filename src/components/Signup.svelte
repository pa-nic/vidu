<script>

  import { Link } from "svelte-routing";
  import { getNotificationsContext } from 'svelte-notifications';
  import { getParams } from "../helpers/authorize-tokens.js";
  import { authUserStore, processInvite } from '../stores/userStore';

  /**
   * Already logged in no need signup -> redirect to home
  */
  if ($authUserStore) {
    navigate("/", { replace: true });
  }

  let password = "";
  const { addNotification } = getNotificationsContext();

  /**
   * Get invite token from signup URL params
   * i.e. example.com/signup?t=<invite_token>
   */
  const invite_token = getParams().get("t");

  function handleKeyUp(event) {
    if (event.target.value != "") {
      event.target.classList.add("filled");
    } else {
      event.target.classList.remove("filled");
    }
  }

  function handleSignup(event) {
    if( invite_token ) {
      processInvite(invite_token, password).catch(e => {
        addNotification({
          text: e,
          position: 'bottom-center',
          type: 'danger',
          removeAfter: 8000
        })
      })
    } else {
      addNotification({
        text: "Missing invite token!",
        position: 'bottom-center',
        type: 'danger',
        removeAfter: 8000
      })
    }
  }
</script>

<form id="signup_form" on:submit|preventDefault="{handleSignup}">
  <h2 class="mb-4 text-gray-800">
    Confirm Signup
  </h2>
  <p class="mb-4 text-sm text-gray-500">
    We're almost done processing your invite - please choose a password for your account.
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
      Password
    </label>
  </div>
  <div class="flex items-center justify-between">
    <Link to="/" class="inline-block align-baseline font-normal text-sm text-green-500 hover:text-gray-800">Home</Link>
    <button
      type="submit"
      class="bg-green-500 hover:bg-gray-700 border border-green-500 hover:border-gray-700 inline-block text-white py-2 px-4 rounded-lg"
      disabled={!password}>
      Signup
    </button>
  </div>
</form>