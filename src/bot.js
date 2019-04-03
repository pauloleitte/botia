const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const env = require('../.env')
const Telegraf = require('telegraf')
const Telegram = require('telegraf/telegram')
const Markup = require('telegraf/markup')
const Extra = require('telegraf/extra')
const axios = require('axios')


// Criando os objetos.
const bot = new Telegraf(env.token)
const telegram = new Telegram(env.token)
const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2018-11-16',
  iam_apikey: env.apikey,
  url: env.url
});

var escolha = 0;

const tecladoBotPlus = Extra.markup(Markup.inlineKeyboard([
  Markup.callbackButton('🕵‍ Buscar Palavras Chaves em um texto', '1'),
  Markup.callbackButton('🧘‍ Analisar Sentimento/Emoção em um texto', '2'),
  Markup.callbackButton('👀 Outra coisa', '3')
], { columns: 1 }))

//Criando o teclado de interação com o bot
const tecladoBotSimples = Markup.keyboard([
  ['🕵‍ Palavras Chaves', '🧘‍ Sentimento ou Emoção', '👀 Outra coisa']
]).resize().extra()


bot.start(async ctx => {
  const nome = ctx.update.message.from.first_name
  await ctx.replyWithMarkdown(`*Olá, ${nome}!*\nEu sou o ChatBot de Sustentação Mapfre`)
  await ctx.replyWithMarkdown(`_Posso te ajudar em algo?_`, tecladoBotSimples)
})

async function searchWatsonEntities(text) {
  var parameters = {
    'text': text,
    'features': {
      'keywords': {
        'sentiment': true,
        'emotion': true,
        'limit': 3
      }
    }
  }
  const response =  await naturalLanguageUnderstanding.analyze(parameters)
  return response
}

async function searchWatsonKeyords(text) {
  var parameters = {
    'text': text,
    'features': {
      'keywords': {
        'sentiment': true,
        'emotion': true,
        'limit': 3
      }
    }
  }
  const response =  await naturalLanguageUnderstanding.analyze(parameters)
  return response
}

bot.hears(/Palavras Chaves/i, ctx => {
  ctx.reply("Ok, me mande o texto que deseja encontrar as palavras chaves")
})

bot.hears(/Sentimento ou Emoção/i, ctx => {
  ctx.reply("Ok, me mande o texto que deseja encontrar os sentimentos ou emoções")
  escolha = 1;
})

bot.hears(/Outra coisa/i, ctx => {
  ctx.reply("Poxa, eu somente tenho duas opções, mas me manda um sugestão que irei anotar e passar para o meu chefe!")
  escolha = 2;
})

bot.action('1', async ctx => {
  await ctx.reply(`Entendido, poderia me enviar o texto para que eu possa buscar as palavras chaves?.`)
})

bot.action('2', async ctx => {
  await ctx.reply(`Que legal, tente me enviar a sua localização, ou escreva uma mensagem qualquer...`)
})

bot.action('3', async ctx => {
  await ctx.reply(`Poxa, eu somente tenho duas opções, mas me manda um sugestão que irei anotar e passar para o meu chefe!`)
})

bot.on("text", async ctx => {
  let msg = ctx.message.text
  if (escolha == 0) {
    var resultWatson = await searchWatsonKeyords(msg)
    //console.log(JSON.stringify(resultWatson, null, 2))
    ctx.reply(JSON.stringify(resultWatson.keywords, null, 2))
  }
  else if (escolha == 1) {
    var resultWatson = await searchWatsonEntities(msg)
    //console.log(JSON.stringify(resultWatson, null, 2))
    ctx.reply(JSON.stringify(resultWatson.keywords, null, 2))
  }
  else {
    ctx.reply("Muito obrigado, por sua sugestão volte sempre! 😎")
  }
})

bot.startPolling()