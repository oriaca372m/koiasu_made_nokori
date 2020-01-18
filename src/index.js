import moment from 'moment'
import 'moment-duration-format'

import config from './site-config-runtime.js'

function generateText(now, target) {
	let startTime
	let episodeNumber
	let isAfterFinalEpisode = true

	for (let i = 0; i < target.time.length; i++) {
		if (now.isBefore(target.time[i])) {
			isAfterFinalEpisode = false
			episodeNumber = i + 1
			startTime = target.time[i]
			break
		}
	}

	if (isAfterFinalEpisode) {
		return {
			main: '放送終了',
			sub: '',
			tweet: `${config.title}の放送は終了しました。 (${target.name})`
		}
	}

	const diffDuration = moment.duration(startTime.diff(now))
	const timeLeftMsg = diffDuration.format('Y年Mヶ月D日hh時間mm分ss.SS秒', { trim: true })

	if (episodeNumber === 1) {
		return {
			main: timeLeftMsg,
			sub: '',
			tweet: `${config.title}まで残り ${timeLeftMsg} (${target.name})`
		}
	}

	return {
		main: '放送開始',
		sub: `${episodeNumber}話まで残り ${timeLeftMsg}`,
		tweet: `${config.title}は放送開始しました! ${episodeNumber}話まで残り ${timeLeftMsg} (${target.name})`
	}
}

function generateChannelUrl(channel) {
	let url = new URL(config.publishedUrl)
	url.searchParams.append('channel', channel)
	return url.toString()
}

function generateTimeTable(targetTable, finalEpisode) {
	const retTable = new Map()

	for (const [key, value] of targetTable) {
		const time = []
		const vtime = value.time

		let oldTime = vtime.get(1)
		time.push(oldTime)

		for (let i = 2; i <= finalEpisode; i++) {
			const currentTime = vtime.has(i) ? vtime.get(i) : oldTime.clone().add(7, 'd')

			time.push(currentTime)
			oldTime = currentTime
		}

		retTable.set(key, { name: value.name, time })
	}

	return retTable
}

const targetTable = config.targetTable
const timeTable = generateTimeTable(targetTable, config.finalEpisode)

let targetId = config.defaultTargetId

{
	const params = new URLSearchParams(window.location.search)
	const channel = params.get('channel')
	if (channel !== null && targetTable.has(channel)) {
		targetId = channel
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const display = document.getElementById('time-display')
	const subdisplay = document.getElementById('time-sub-display')

	const channel = document.getElementById('channel')

	for (const [key, value] of targetTable) {
		const elm = document.createElement('option')
		elm.setAttribute('value', key)
		elm.appendChild(document.createTextNode(value.name))
		channel.appendChild(elm)
	}

	channel.value = targetId

	channel.addEventListener('change', (e) => {
		targetId = e.target.value
		window.history.replaceState(null, null, generateChannelUrl(targetId))
	})

	window.setInterval(() => {
		const text = generateText(moment(), timeTable.get(targetId))
		display.textContent = text.main
		subdisplay.textContent = text.sub
	}, 10)

	document.getElementById('tweet').addEventListener('click', () => {
		let url = new URL('https://twitter.com/intent/tweet')
		url.searchParams.append('text', generateText(moment(), timeTable.get(targetId)).tweet)
		url.searchParams.append('url', generateChannelUrl(targetId))
		url.searchParams.append('hashtags', config.hashtags)
		window.open().location.href = url.toString()
	})
})
