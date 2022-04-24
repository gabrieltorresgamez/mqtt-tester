<script setup lang="ts">
useHead({
	title: 'mqtt-tester | a MQTT testing tool based on VueJS',
})
</script>

<template>
	<div class="grid place-items-center min-h-[81.67vh]">
		<div>
			<mqtt-test />
		</div>
	</div>
</template>

<route lang="yaml">
name: home
</route>
