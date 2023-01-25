<script lang="ts">
	import Link from '$lib/Link.svelte';
	import { ros } from '../store';
	import Header from '$lib/Header.svelte';

	const pageTitle = 'Robocup Manager';

	ros.on('connection', function () {
		console.log('Connected to websocket server.');
	});

	ros.on('error', function (error) {
		console.log('Error connecting to websocket server: ', error);
	});

	ros.on('close', function () {
		console.log('Connection to websocket server closed.');
	});
</script>

<Header {pageTitle} />

<div class="basis-11/12 grid grid-cols-5 grid-rows-5 italic bg-yellow-50">
	<div class="row-start-2 col-start-2 col-span-2 flex justify-center items-center">
		<div class="w-5/6">
			<Link url="stage1" name="Stage 1" bgColor="bg-red-600" />
		</div>
	</div>
	<div class="row-start-3 col-start-3 col-span-2 flex justify-center items-center">
		<div class="w-5/6">
			<Link url="stage2" name="Stage 2" bgColor="bg-green-200" />
		</div>
	</div>
	<div class="row-start-4 col-start-2 col-span-2 flex justify-center items-center">
		<div class="w-5/6">
			<Link url="final" name="Final" bgColor="bg-cyan-300" />
		</div>
	</div>
</div>
