<script lang="ts">
	import Header from '$lib/Header.svelte';
	let pageTitle = 'Serve Breakfast';
</script>

<Header {pageTitle} home={true} description={true}/>

<main>
	<h1>{pageTitle}</h1>
	<p>Breakfast is served!</p>
</main>

