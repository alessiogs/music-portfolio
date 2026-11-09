<script lang="ts">
	let { data } = $props();
</script>

<h1>Hi, {data.user?.username}</h1>

<form method="POST" action="/admin/logout">
	<button>Log out</button>
</form>
