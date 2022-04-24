<script setup lang="ts">
import { useStore } from '@/store'
import { timestamp } from '@vueuse/core';
import * as mqtt from 'mqtt/dist/mqtt.min'
// import * as mqtt from 'mqtt'

useHead({
	title: 'mqtt-tester | a MQTT testing tool based on VueJS',
})

let client: mqtt.MqttClient

const store = useStore()
const { t } = useI18n()

function sleep(time: number) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function request() {
	reset()
	if (store.$state.login != "" && store.$state.topic != "" && store.$state.url != "") {
		store.$state.configured = true
		connectMQTT(store.$state.login, store.$state.password, store.$state.topic, store.$state.url)
	} else {
		const warning = document.createElement('p')
		warning.className = "text-red-500 text-xs italic mandatory-warning"
		warning.textContent = t('form.mandatory')

		const mandatory = document.getElementsByClassName("mandatory")
		if (store.$state.login == "") { mandatory[0].appendChild(warning.cloneNode(true)) }
		if (store.$state.topic == "") { mandatory[1].appendChild(warning.cloneNode(true)) }
		if (store.$state.url == "") { mandatory[2].appendChild(warning.cloneNode(true)) }
	}
}

function reset() {
	const mandatorywarning = document.getElementsByClassName("mandatory-warning")
	while (mandatorywarning.length > 0) {
		mandatorywarning[0].remove();
	}
	store.$state.configured = false
}

function reconfig() {
	client.end()
	reset()
}

function connectMQTT(login: string, password: string, topicname: string, url: string) {
	let messagefield: HTMLElement | null
	let i: number
	let didConnect = false
	let doReconfig = false

	const options = {
		clean: true,
		connectTimeout: 1000,
		clientId: "mqtt-tester-" + (Math.random() + 1).toString(36).substring(7),
		username: login,
		password: password,
		onFailure: reset
	}

	client = mqtt.connect(url, options)

	client.on('connect', function () {
		didConnect = true
		i = 1
		client.subscribe(topicname, function (err) {
			if (!err) {
				messagefield = document.getElementById("message-field")
				let msg = document.createElement("div")
				msg.className = "p-4 w-full mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
				msg.textContent = t('data.subscribed')

				messagefield?.appendChild(msg)
			}
		})
	})

	client.on('message', function (topic, message) {
		let msg = document.createElement("div")
		msg.className = "p-4 w-full mb-4 text-sm text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-600 dark:text-gray-300"
		msg.innerHTML = '<p class="font-bold">' + i++ + ": " + topic.toString() + ":</p> <p>" + message.toString() + "</p>"

		messagefield?.insertBefore(msg, messagefield?.firstChild)

		if (messagefield?.childElementCount === 6) {
			messagefield?.removeChild(messagefield?.childNodes[4])
		}
	})

	client.on('close', function () {
		if (doReconfig) {
			reconfig()
		}
		
		if (!didConnect) {
			messagefield = document.getElementById("message-field")
			let msg = document.createElement("div")
			msg.className = "p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
			msg.innerHTML = '<p class="font-bold">Error:</p><p>Connection failed, check connection settings!</p>'

			messagefield?.appendChild(msg)
			doReconfig = true
		} 
	})

	client.on('error', function (err) {
		messagefield = document.getElementById("message-field")
		let msg = document.createElement("div")
		msg.className = "p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
		msg.innerHTML = '<p class="font-bold">Error:</p> <p>' + err + "</p>"

		messagefield?.appendChild(msg)
		doReconfig = true
		client.end()
	});
}
</script>

<template>
	<form v-if="!store.$state.configured" class="w-full max-w-lg">
		<div class="flex flex-wrap -mx-3 mb-6">
			<div class="mandatory w-full md:w-1/2 px-3 mb-6 md:mb-0">
				<label class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2">
					{{ t('form.login') }}
				</label>
				<input v-model="store.$state.login"
					class="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="grid-first-name" type="text" placeholder="mqtt-user">
			</div>
			<div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
				<label class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2">
					{{ t('form.password') }}
				</label>
				<input v-model="store.$state.password"
					class="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					id="grid-last-name" type="text" placeholder="S3cur3 P455W0rd!">
			</div>
		</div>
		<div class="flex flex-wrap -mx-3 mb-6">
			<div class="mandatory w-full md:w-1/2 px-3 mb-6 md:mb-0">
				<label class="block uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2">
					{{ t('form.topic') }}
				</label>
				<input v-model="store.$state.topic"
					class="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="grid-first-name" type="text" placeholder="topic/#">
			</div>
			<div class="mandatory w-full md:w-1/2 px-3 mb-6 md:mb-0">
				<label class="block uppercase tracking-wide text-gray-700 dark:text-white  text-xs font-bold mb-2">
					{{ t('form.url') }}
				</label>
				<input v-model="store.$state.url"
					class="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
					id="grid-first-name" type="text" placeholder="ws://server.com:80">
			</div>
		</div>
	</form>


	<div v-if="!store.$state.configured" class="mt-5 text-center">
		<button @click="request" class="
						px-4
						py-2
						dark:bg-gray-100
						dark:text-blue-500
						bg-blue-500
						text-white
						rounded
					">
			{{ t('button.subscribe') }}
		</button>
	</div>
	<div v-if="store.$state.configured" class="mt-5 p-4 text-center">
		<button @click="reconfig" class="
						px-4
						py-2
						dark:bg-gray-100
						dark:text-blue-500
						bg-blue-500
						text-white
						rounded
					">
			{{ t('button.reset') }}
		</button>
	</div>
	<div v-if="store.$state.configured" id="message-field" class="container mx-auto text-center">
	</div>
</template>