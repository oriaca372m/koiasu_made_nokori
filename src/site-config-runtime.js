import moment from 'moment'

import siteConfig from './site-config.json'

export default {
	...siteConfig,
	episodes: [
		'1話 「二人の約束」',
		'2話 「河原の天の川」',
		'3話 「思い出はたからもの」',
		'4話 「わくわく! 夏合宿!」',
		'5話 「それぞれの夏休み」',
		'6話 「星咲祭!」',
		'6.5話 「振り返り KiraKira特別号」',
		'7話 「星空はタイムマシン」',
		'8話 「冬のダイヤモンド」',
		'9話 「本当の気持ち」',
		'10話 「雨ときどき占い」',
		'11話',
		'12話',
	],
	channels: new Map([
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
	defaultChannelId: 'atx'
}
