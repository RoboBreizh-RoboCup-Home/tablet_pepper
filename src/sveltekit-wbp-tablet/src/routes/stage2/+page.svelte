<script lang="ts">
    import ScenarioLink from '$lib/ScenarioLink.svelte';
	import {page} from '$app/stores';

    let title = 'Stage 2';
	let pageName = $page.url.pathname;
	let scenarios = [
		{ name: 'Clean the table', url: `${pageName}/CleanTheTable` },
		{ name: 'Restaurant', url: `${pageName}/Restaurant` },
		{ name: 'Stickler for the rules', url: `${pageName}/SticklerForTheRules` },
		{ name: 'EGPSR', url: `${pageName}/EGPSR` }
	];
</script>

<h1>{title}</h1>

{#each scenarios as scenario}
    <ScenarioLink {...scenario}/>
{/each}