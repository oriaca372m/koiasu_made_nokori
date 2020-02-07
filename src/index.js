import moment from 'moment'
import 'moment-duration-format'

import config from './site-config-runtime.js'

function generateText(now, channel) {
	let episodeNumber
	let isAfterFinalEpisode = true
	const episodeLength = moment.duration(30, 'minutes')

	for (let i = 0; i < channel.time.length; i++) {
		if (now.isBefore(channel.time[i])) {
			isAfterFinalEpisode = false
			episodeNumber = i + 1
			break
		}
	}

	if (isAfterFinalEpisode) {
		return {
			main: '放送終了',
			sub: '',
			tweet: `${config.title}の放送は終了しました。 (${channel.name})`
		}
	}

	const diffDuration = moment.duration(channel.time[episodeNumber - 1].diff(now))
	const timeLeftMsg = diffDuration.format('Y年Mヶ月D日hh時間mm分ss.SS秒', { trim: true })

	if (episodeNumber === 1) {
		return {
			main: timeLeftMsg,
			sub: '',
			tweet: `${config.title}まで残り ${timeLeftMsg} (${channel.name})`
		}
	}

	if (now.isBefore(channel.time[episodeNumber - 2].clone().add(episodeLength))) {
		return {
			main: `${episodeNumber}話 放送中`,
			sub: '',
			tweet: `${config.title}は放送開始しました! ${episodeNumber}話が放送中です! (${channel.name})`
		}
	}

	return {
		main: '放送開始',
		sub: `${episodeNumber}話まで残り ${timeLeftMsg}`,
		tweet: `${config.title}は放送開始しました! ${episodeNumber}話まで残り ${timeLeftMsg} (${channel.name})`
	}
}

function generateChannelUrl(channel) {
	let url = new URL(config.publishedUrl)
	url.searchParams.append('channel', channel)
	return url.toString()
}

function generateTimeTable(channels, finalEpisode) {
	const retTable = new Map()

	for (const [key, value] of channels) {
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

const timeTable = generateTimeTable(config.channels, config.finalEpisode)
let channelId = config.defaultChannelId

{
	const params = new URLSearchParams(window.location.search)
	const channel = params.get('channel')
	if (channel !== null && config.channels.has(channel)) {
		channelId = channel
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const display = document.getElementById('time-display')
	const subdisplay = document.getElementById('time-sub-display')

	const channel = document.getElementById('channel')

	for (const [key, value] of config.channels) {
		const elm = document.createElement('option')
		elm.setAttribute('value', key)
		elm.appendChild(document.createTextNode(value.name))
		channel.appendChild(elm)
	}

	channel.value = channelId

	channel.addEventListener('change', (e) => {
		channelId = e.target.value
		window.history.replaceState(null, null, generateChannelUrl(channelId))
	})

	window.setInterval(() => {
		const text = generateText(moment(), timeTable.get(channelId))
		display.textContent = text.main
		subdisplay.textContent = text.sub
	}, 10)

	document.getElementById('tweet').addEventListener('click', () => {
		let url = new URL('https://twitter.com/intent/tweet')
		url.searchParams.append('text', generateText(moment(), timeTable.get(channelId)).tweet)
		url.searchParams.append('url', generateChannelUrl(channelId))
		url.searchParams.append('hashtags', config.hashtags)
		window.open().location.href = url.toString()
	})
})
