<script lang="ts">
    import Link from '$lib/Link.svelte';
	import {page} from '$app/stores';
	import Header from '$lib/Header.svelte';

    let pageTitle = 'Stage 2';
	let pageName = $page.url.pathname;
	let scenarios = [
		{ name: 'Clean the table', url: `${pageName}/CleanTheTable`, bgColor: 'bg-red-600'  },
		{ name: 'Restaurant', url: `${pageName}/Restaurant`, bgColor : 'bg-green-200' },
		{ name: 'Stickler for the rules', url: `${pageName}/SticklerForTheRules`, bgColor: 'bg-cyan-300'  },
		{ name: 'EGPSR', url: `${pageName}/EGPSR`, bgColor: 'bg-yellow-400' }
	];

	let grid_rows_nb : string = (scenarios.length + 2).toString();
</script>

<Header {pageTitle} />

<div style="grid-template-rows: repeat({grid_rows_nb},minmax(0,1fr));" class="basis-11/12 grid grid-cols-5 italic ">
	{#each scenarios as scenario, index}
        <div style="grid-row-start: {2+index}; 	grid-column-start: {(2 + (index % 2)).toString()};" class=" col-span-2 flex justify-center items-center">
            <div class="w-5/6">
                <Link {...scenario} id={index + 1} />
            </div>
        </div>
	{/each}
</div>

