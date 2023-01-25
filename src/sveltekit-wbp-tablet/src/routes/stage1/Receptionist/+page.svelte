<script lang="ts">
	import Header from '$lib/Header.svelte';
	let pageTitle = 'Receptionist';

	let version1 = false;
</script>

<Header {pageTitle} home={true} description={true}/>

<!-- This needs to be embedded into components at some point -->
{#if version1}
<div class="basis-11/12 grid grid-rows-7 grid-cols-6 bg-yellow-50">
	<div id="state" class="border-r-2 border-black bg-teal-400 row-start-1 row-span-7 col-start-1 col-span-2">
		<div id="state-text" class="text-center py-5 font-extrabold text-xl">
			State
		</div>
	</div>
	<div id="feedback" class="border-l-2 border-b-2 border-black bg-gray-300 row-start-1 row-end-6 col-start-3 col-span-4
	flex items-center">
		<div>
			<img id="feedback-image" src="https://dummyimage.com/640x480/fff/aaa" alt="Placeholder " />
		</div>
	</div>
	<div id="output-frame" class="border-t-2 border-l-2 border-black bg-red-500 row-start-6 row-end-8 col-start-3 col-span-4 grid grid-cols-5">
		<div id="log"></div>
		<div id="buttons-wrapper" class="col-start-4 col-span-2 grid grid-rows-2">
			<button id="button-1" class="bg-blue-500 text-white font-bold my-2 mx-4 rounded row-start-1">
				Start
			</button>
			<button id="button-2" class="bg-blue-500 text-white font-bold my-2 mx-4 rounded row-start-2">
				Stop
			</button>
		</div>
	</div>
</div>
{:else}
<div class="basis-11/12 grid grid-rows-9 grid-cols-6 bg-yellow-50">
	<div id="state" class="border-2 border-black bg-teal-400 row-start-1 row-span-1 col-start-1 col-span-6">
		<!-- <div id="state-text" class="text-center font-extrabold text-xl">
			State
		</div> -->
	</div>
	<div id="feedback" class="border-2 border-black bg-gray-300 row-start-2 row-span-6 col-start-1 col-span-6 flex object-cover">
		<div class="w-1/2">
			<img class="inline max-w-none" id="feedback-image" src="https://dummyimage.com/640x480/fff/aaa" alt="Placeholder " />
		</div>
		<div class="w-1/2">
			<img class="inline max-w-none" id="feedback-image" src="https://dummyimage.com/640x480/fff/aaa" alt="Placeholder " />
		</div>
	</div>
	<div id="output-frame" class="border-2 border-black bg-red-500 row-start-8 row-span-2 col-start-1 col-span-6 grid grid-cols-5">
		<div id="log"></div>
		<div id="buttons-wrapper" class="col-start-4 col-span-2 grid grid-rows-2">
			<!-- <button id="button-1" class="bg-blue-500 text-white font-bold my-2 mx-4 rounded row-start-1">
				Start
			</button>
			<button id="button-2" class="bg-blue-500 text-white font-bold my-2 mx-4 rounded row-start-2">
				Stop
			</button> -->
		</div>
	</div>
</div>
{/if}