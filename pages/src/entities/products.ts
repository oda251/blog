import Langs from './langs';
import Techs from './techs';

const cfwDiscordBot: Product = {
	title: {
		en: "Shift Manager Bot",
		ja: "シフト管理Bot"
	},
	thumbnail: "assets/cfw-discord-bot-thumb.png",
	imgs: [
		"cfw-discord-bot.png",
	],
	infras: [
		Techs.nodejs,
		Techs.cloudflareWorkers,
		Techs.gas,
		Techs.discordApi,
	],
	langs: [
		Langs.js,
		Langs.gas,
	],
	body: {
		en: `
			A Discord bot to manage cleaning shifts in 42.
			It reports the daily shifts and has several commands to manage them.
			The data is managed in a spreadsheet and connected to Discord API through Cloudflare Workers.
			The implementation in Cloudflare Workers uses the web framework "hono".
			The point of emphasis is to make the operating cost completely free.
			This product was created voluntarily and provided to 42.
		`,
		ja: `
			42の掃除シフトを管理するDiscord Botです。
			日々のシフトを報告し、コマンドでそれらの管理を行います。
			データはspreadsheetで管理し、GAS ApiとDiscord Apiをcloudflare workersで繋げています。
			cloudflare workersでの実装は、honoというwebフレームワークを使用しています。
			こだわった点は、運用費を完全無料にすることです。
			このプロダクトは自発的に作成し、42に提供しました。
		`
	},
	github: "https://github.com/oda251/cfw-discord-bot",
	href: "hoge",
}

const portfolio: Product = {
	title: {
		en: "Portfolio Site",
		ja: "ポートフォリオサイト"
	},
	thumbnail: "assets/portfolio-site-thumb.png",
	imgs: [
		"portfolio-site.png",
	],
	infras: [
		Techs.cloudflarePages,
		Techs.astro,
		Techs.tailwind,
		Techs.react,
	],
	langs: [
		Langs.ts,
	],
	body: {
		en: `
			This website.
			To operate it for free, I use cloudflare pages.
			The implementation is based on astro, an SSG, and partially uses React.
		`,
		ja: `
			このウェブサイトです。
			無料で運用するために、cloudflare pagesを使用しています。
			実装はastroというSSGをベースに、部分的にReactを使用しています。
		`,
	},
	github: "https://github.com/oda251/blog",
	href: "hoge",
}

const products: Product[] = [
	cfwDiscordBot,
	portfolio,
]

export default products;