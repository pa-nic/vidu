<script>
	import { getNotificationsContext } from 'svelte-notifications';
  import { attemptLogout } from "../stores/userStore";

  const { addNotification } = getNotificationsContext();

  function handleLogout(event) {
		attemptLogout().catch(e => {
      addNotification({
        text: e,
        position: 'bottom-center',
        type: 'danger',
        removeAfter: 8000
      })
		})
  }
</script>

<button	class="border border-gray-400 hover:border-gray-700 inline-block text-gray-400 hover:text-gray-700 py-2 px-4 rounded-lg"
  on:click="{handleLogout}">
  Logout
</button>