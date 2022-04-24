<script setup lang="ts"></script>
<template>
	<header>
		<app-header />
	</header>

	<main
		class="
			p-8
			dark:bg-gray-700 dark:text-white
			bg-white
			text-gray-800
		"
	>
		<router-view />
	</main>
</template>
