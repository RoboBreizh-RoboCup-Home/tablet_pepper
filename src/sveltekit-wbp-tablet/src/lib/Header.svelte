<script lang="ts">
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Notebook } from '@steeze-ui/carbon-icons';
	export let pageTitle: string;
	export let description = false;
	export let home = false;
</script>

{#if home}
	<div class="flex flex-row basis-1/12 ">
		<div
			class="basis-3/12 border-solid border-b-4 border-b-black border-r-2 border-r-black bg-yellow-300
	text-center py-5 font-extrabold text-4xl"
		>
			<a href="/">Home</a>
		</div>

		<div class="basis-8/12 border-solid border-b-4 border-b-black border-x-2 border-x-black bg-fuchsia-300">
			<h1 class=" text-center py-5 font-extrabold text-4xl">
				{pageTitle}
			</h1>
		</div>

		<div
			class="basis-1/12 border-solid border-b-4 border-b-black border-l-2 border-l-black bg-violet-500"
		>
			{#if description}
			<!-- <h1 class=" text-center py-5 font-extrabold text-4xl" /> -->
			<div class="flex justify-center items-center h-full">
				<Icon src={Notebook} size="48px" />
			</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex flex-row basis-1/12 ">
		<!-- <div class="basis-1/12 border-solid border-b-4 border-b-black border-r-2 border-r-black" /> -->

		<div
			class="basis-9/12 border-solid border-b-4 border-b-black border-r-2 border-r-black bg-fuchsia-300"
		>
			<h1 class=" text-center py-5 font-extrabold text-4xl">
				{pageTitle}
			</h1>
		</div>

		<div class="basis-3/12 border-solid border-b-4 border-b-black border-l-2 border-l-black bg-indigo-300" />
	</div>
{/if}
