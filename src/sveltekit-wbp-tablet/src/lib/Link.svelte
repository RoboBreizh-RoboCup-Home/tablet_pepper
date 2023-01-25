<script lang="ts">
	export let name: string;
	export let url: string;
	export let bgColor = '';
	export let id = NaN;
</script>

<div
	class="border-solid border-4 border-black  rounded-3xl w-full flex items-center justify-center {bgColor} text-3xl shadow-2xl"
>
	<a href={url} class="py-6">
		{#if id}
			{id} - {name}
		{:else}
			{name}
		{/if}
	</a>
</div>
