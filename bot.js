const { Telegraf } = require('telegraf');
const covidApi = require('covid19-api');
const misc = require('./misc.js');
const token = require('./token.js');
const bot = new Telegraf(token);

const getName = (ctx) => {
	return ctx.message.chat.first_name;
};

bot.start((ctx) => {
	return ctx.reply(`Привет, ${getName(ctx)}! Я бот, который показывает статистику о COVID19 по странам! Чтобы узнать статистику о заболевании просто введите название страны на английском языке и отправьте мне!`)
});

bot.help((ctx) => {
	return ctx.reply(`Список стран 🗺️:
${misc.countries}.

Для отображения информации о заболевании введите название страны на английском. Список доступных стран наведен выше 🌍.
`)
});

bot.on('text', async (ctx) => {
	try {
		let userText = ctx.message.text;
		let userCountry;
		switch (userText) {
			case 'Россия':
				userCountry = userText;
				userText = 'Russia';
				break;
			case 'Украина':
				userCountry = userText;
				userText = 'Ukraine';
				break;
			case 'us':
				userCountry = 'United State of America';
				break;
			default:
				userCountry = userText;
				break;
		};

		const covidData = await covidApi.getReportsByCountries(userText);
		const countryData = covidData[0][0];
		const formatData = `\nИнформация по стране  ${userCountry}.\nСлучаи: ${countryData.cases},\nСмерти: ${countryData.deaths},\nВыздоровело: ${countryData.recovered}`;
		ctx.replyWithPhoto({ url: countryData.flag }, { caption: formatData });
	} catch (e) {
		ctx.reply('Такой страны не существует, для получения списка стран используйте команду /help')
	}
});

bot.launch();