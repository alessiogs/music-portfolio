<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<h1>Create your admin account</h1>

<form method="POST" use:enhance>
	<label
		>Username <input
			name="username"
			autocomplete="username"
			value={form?.username ?? ''}
			required
		/></label
	>
	<label
		>Password <input
			name="password"
			type="password"
			autocomplete="new-password"
			minlength="12"
			required
		/></label
	>
	<label
		>Confirm password <input
			name="confirm"
			type="password"
			autocomplete="new-password"
			required
		/></label
	>
	{#if form?.message}<p role="alert">{form.message}</p>{/if}
	<button>Create account</button>
</form>
