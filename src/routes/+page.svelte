<script lang="ts">
	import logo from "$lib/images/logo.png";
</script>

<nav class="flex justify-center w-full mb-4">
    <a href="/" data-sveltekit-reload>
        <img src={logo} alt="logo" width="75" height="75" />
    </a>
</nav>

<form action="/.netlify/functions/login" method="POST">
    <div class="mb-4 relative">
        <input required type="email" name="email" id="email" class="block px-2.5 pb-2.5 pt-4 w-full rounded-lg border border-gray-400 appearance-none focus:border-emerald-500 focus:outline-none focus:ring-0 peer" placeholder=" " />
        <label for="email" class="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Email</label>
    </div>

    <div class="mb-4 relative">
        <input required type="password" name="password" id="password" class="block px-2.5 pb-2.5 pt-4 w-full rounded-lg border border-gray-400 appearance-none focus:border-emerald-500 focus:outline-none focus:ring-0 peer" placeholder=" " />
        <label for="password" class="absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Password</label>
    </div>

    <div class="flex items-center">
        <button
            type="submit"
            class="bg-emerald-500 hover:bg-gray-700 border border-emerald-500 hover:border-gray-700 inline-block text-white py-2 px-4 rounded-lg">
            Login
        </button>
    </div>
</form>