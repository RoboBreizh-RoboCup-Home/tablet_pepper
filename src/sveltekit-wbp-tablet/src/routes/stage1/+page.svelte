<script lang="ts">
	import Link from '$lib/Link.svelte';
	import { page } from '$app/stores';
	import Header from '$lib/Header.svelte';

	let pageTitle = 'Stage 1';
	let pageName = $page.url.pathname;

	let scenarios = [
		{ name: 'Carry my luggage', url: `${pageName}/CarryMyLuggage`, bgColor: 'bg-red-600' },
		{ name: 'Receptionist', url: `${pageName}/Receptionist`, bgColor: 'bg-green-200' },
		{ name: 'Storing groceries', url: `${pageName}/StoringGroceries`, bgColor: 'bg-cyan-300' },
		{ name: 'Serve breakfast', url: `${pageName}/ServeBreakfast`, bgColor: 'bg-yellow-400' },
		{ name: 'GPSR', url: `${pageName}/GPSR`, bgColor: 'bg-purple-500' }
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

