<script lang="ts">
	import { ros } from '../../../store';
	import ROSLIB from 'roslib';
	import Header from '$lib/Header.svelte';

	let is_detection_camera = false;
	let detection_camera_data: any = null;
	const pageTitle = 'Carry my Luggage';

	let detection_camera = new ROSLIB.Topic({
		ros: ros,
		name: 'robobreizh/detection_camera',
		messageType: 'sensor_msgs/CompressedImage'
	});

	detection_camera.subscribe(function (message: any) {
		is_detection_camera = true;
		detection_camera_data = message.data;
	});
</script>

<div>
	<Header {pageTitle} home={true} description={true}/>
	<div id="response container">
		{#if is_detection_camera}
			<h1>Camera is connected</h1>
			<img src="data:image/jpeg;base64,{detection_camera_data}" alt="detection camera" />
		{:else}
			<h1>Camera is not connected</h1>
		{/if}
	</div>
</div>
