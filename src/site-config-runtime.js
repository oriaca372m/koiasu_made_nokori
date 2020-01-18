import moment from 'moment'

import siteConfig from './site-config.json'

export default {
	...siteConfig,
	finalEpisode: 12,
	targetTable: new Map([
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
	]),
	defaultTargetId: 'atx'
}
