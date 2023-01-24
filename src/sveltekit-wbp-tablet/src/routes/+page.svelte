<script lang="ts">
	import ScenarioLink from '$lib/ScenarioLink.svelte';
    import {ros} from '../store' 

	// let ros = new ROSLIB.Ros({
	// 	url: 'ws://10.203.2.153:9090'
	// });

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

<h1>Robocup Manager</h1>

<div id="menu-wrapper" class="">
    <a href="/stage1">Stage1</a>
    <a href="/stage2">Stage2</a>
    <ScenarioLink name="Final" url="final"/>
</div>
