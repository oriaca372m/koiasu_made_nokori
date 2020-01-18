import moment from 'moment';
import 'moment-duration-format';

function generateText(now, target) {
	let startTime;
	let episodeNumber;
	let isAfterFinalEpisode = true;

	for (let i = 0; i < target.time.length; i++) {
		if (now.isBefore(target.time[i])) {
			isAfterFinalEpisode = false;
			episodeNumber = i + 1;
			startTime = target.time[i];
			break;
		}
	}

	if (isAfterFinalEpisode) {
		return {
			main: '放送終了',
			sub: '',
			tweet: `恋する小惑星の放送は終了しました。 (${target.name})`
		};
	}

	const diffDuration = moment.duration(startTime.diff(now));
	const timeLeftMsg = diffDuration.format('Y年Mヶ月D日hh時間mm分ss.SS秒', { trim: true });

	if (episodeNumber === 1) {
		return {
			main: timeLeftMsg,
			sub: '',
			tweet: `恋する小惑星まで残り ${timeLeftMsg} (${target.name})`
		};
	}

	return {
		main: `放送開始`,
		sub: `${episodeNumber}話まで残り ${timeLeftMsg}`,
		tweet: `恋する小惑星は放送開始しました! ${episodeNumber}話まで残り ${timeLeftMsg} (${target.name})`
	};
}

function generateChannelUrl(channel) {
	let url = new URL('https://oriaca372m.github.io/koiasu_made_nokori/');
	url.searchParams.append('channel', channel);
	return url.toString();
}

function generateTimeTable(targetTable, finalEpisode) {
	const retTable = new Map();

	for (const [key, value] of targetTable) {
		const time = [];
		const vtime = value.time

		let oldTime = vtime.get(1);
		time.push(oldTime);

		for (let i = 2; i <= finalEpisode; i++) {
			const currentTime = vtime.has(i) ? vtime.get(i) : oldTime.clone().add(7, 'd');

			time.push(currentTime);
			oldTime = currentTime;
		}

		retTable.set(key, { name: value.name, time });
	}

	return retTable;
}

const targetTable = new Map([
	['atx', {
		name: 'AT-X',
		time: new Map([
			[1, moment('2020-01-03T20:30:00')]
		])
	}],
	['tokyomx', {
		name: 'TOKYO MX',
		time: new Map([
			[1, moment('2020-01-03T23:00:00')],
			[2, moment('2020-01-10T22:30:00')]
		])
	}],
	['suntv', {
		name: 'サンテレビ',
		time: new Map([
			[1, moment('2020-01-03T24:00:00')]
		])
	}],
	['kbskyoto', {
		name: 'KBS京都',
		time: new Map([
			[1, moment('2020-01-03T24:00:00')]
		])
	}],
	['tvaichi', {
		name: 'テレビ愛知',
		time: new Map([
			[1, moment('2020-01-11T03:05:00')],
			[2, moment('2020-01-11T03:35:00')],
			[3, moment('2020-01-18T03:05:00')]
		])
	}],
	['bs11', {
		name: 'BS11',
		time: new Map([
			[1, moment('2020-01-03T23:00:00')]
		])
	}]
]);

const finalEpisode = 12;
const timeTable = generateTimeTable(targetTable, finalEpisode);

let targetId = 'atx';

{
	const params = new URLSearchParams(window.location.search);
	const channel = params.get('channel');
	if (channel !== null && targetTable.has(channel)) {
		targetId = channel;
	}
}

console.log("addEventListener")
document.addEventListener('DOMContentLoaded', (e) => {
	console.log("hello")
	const display = document.getElementById('time-display');
	const subdisplay = document.getElementById('time-sub-display');

	const channel = document.getElementById('channel');

	for (const [key, value] of targetTable) {
		const elm = document.createElement('option');
		elm.setAttribute('value', key);
		elm.appendChild(document.createTextNode(value.name));
		channel.appendChild(elm);
	}

	channel.value = targetId;

	channel.addEventListener('change', (e) => {
		targetId = e.target.value;
		window.history.replaceState(null, null, generateChannelUrl(targetId));
	});

	window.setInterval(() => {
		const text = generateText(moment(), timeTable.get(targetId));
		display.textContent = text.main;
		subdisplay.textContent = text.sub;
	}, 10);

	document.getElementById('tweet').addEventListener('click', (e) => {
		let url = new URL('https://twitter.com/intent/tweet');
		url.searchParams.append('text', generateText(moment(), timeTable.get(targetId)).tweet);
		url.searchParams.append('url', generateChannelUrl(targetId));
		url.searchParams.append('hashtags', 'koias');
		window.open().location.href = url.toString();
	});
});
