<script lang="ts">	
    import {ros} from '../../store' 
    import ScenarioLink from '$lib/ScenarioLink.svelte';
    import {page} from '$app/stores';

    let title = 'Stage 1';
	let pageName = $page.url.pathname;

	let scenarios = [
        {name:'Carry my luggage',url:`${pageName}/CarryMyLuggage`},
        {name:'Receptionist',url:`${pageName}/Receptionist`}, 
        {name:'Storing groceries',url:`${pageName}/StoringGroceries`}, 
        {name:'Serve breakfast', url:`${pageName}/ServeBreakfast`},
        {name:'GPSR', url:`${pageName}/GPSR`}];
</script>
<h1>{title}</h1>

{#each scenarios as scenario}
    <ScenarioLink {...scenario}/>
{/each}