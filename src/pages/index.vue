<script setup lang="ts">
import { useStore } from '@/store';
useHead({
	title: 'mqtt-tester | a MQTT testing tool based on VueJS',
});

const store = useStore();
const { t } = useI18n();

function request() {
	reset()
	if (store.$state.login != "" && store.$state.topic != "" && store.$state.url) {
		store.$state.configured = true
	} else {
		const warning = document.createElement('p')
		warning.className = "text-red-500 text-xs italic mandatory-warning"
		warning.textContent = t('form.mandatory')
		
		const mandatory = document.getElementsByClassName("mandatory")
		if (store.$state.login == "") {mandatory[0].appendChild(warning.cloneNode(true))}
		if (store.$state.topic == "") {mandatory[1].appendChild(warning.cloneNode(true))}
		if (store.$state.url == "") {mandatory[2].appendChild(warning.cloneNode(true))}
	}
}

function reset() {
	const mandatorywarning = document.getElementsByClassName("mandatory-warning")
	while(mandatorywarning.length > 0){
        mandatorywarning[0].remove();
    }
}

function reconfig() {
	reset()
	store.$state.configured = false
}
</script>

<template>
	<div class="grid place-items-center min-h-[80vh]">
		<div>

			<form v-if="!store.$state.configured" class="w-full max-w-lg">
				<div class="flex flex-wrap -mx-3 mb-6">
					<div class="mandatory w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2">
							{{ t('form.login') }}
						</label>
						<input
							v-model="store.$state.login" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
							id="grid-first-name" type="text">
					</div>
					<div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2">
							{{ t('form.password') }}
						</label>
						<input
							v-model="store.$state.password" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="grid-last-name" type="text">
					</div>
				</div>
				<div class="flex flex-wrap -mx-3 mb-6">
					<div class="mandatory w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2">
							{{ t('form.topic') }}
						</label>
						<input
							v-model="store.$state.topic" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
							id="grid-first-name" type="text">
					</div>
					<div class="mandatory w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2">
							{{ t('form.url') }}
						</label>
						<input
							v-model="store.$state.url" class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
							id="grid-first-name" type="text">
					</div>
				</div>
			</form>


			<div v-if="!store.$state.configured" class="mt-5 text-center">
				<button @click="request" class="
						px-4
						py-2
						dark:bg-blue-800
						bg-blue-500
						text-white
						rounded
					">
					{{ t('button.subscribe') }}
				</button>
			</div>
			<div v-else class="mt-5 text-center">
				<button @click="reconfig" class="
						px-4
						py-2
						dark:bg-blue-800
						bg-blue-500
						text-white
						rounded
					">
					{{ t('button.reset') }}
				</button>
			</div>
			<!-- <img :src="Logo" width="300" class="mx-auto" />
			<p class="lg:text-left text-center">
				{{ t('intro.desc') }}
				<a
					href="https://tailwindcss.com/"
					class="text-blue-500 hover:underline"
					>TailwindCSS</a
				>
			</p>
			<p class="text-center">
				{{ t('intro.github') }}
				<a
					class="text-blue-500 hover:underline"
					href="https://github.com/gabrieltorresgamez/mqtt-tester"
					>Github Repo</a
				>
			</p> -->
		</div>
		<!-- <router-link
			:to="{ name: 'other-page' }"
			class="
				mt-5
				text-center
				hover:text-gray-200
				dark:hover:text-gray-500
				hover:underline
			"
			>{{ t('pages.other.menu') }}</router-link
		> -->
	</div>
</template>

<route lang="yaml">
name: home
</route>
