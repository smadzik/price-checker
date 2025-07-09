const fetch = require("node-fetch");
const cheerio = require("cheerio");

exports.handler = async function(event) {
  const url = event.queryStringParameters.url;
  if (!url || !url.startsWith("https://vostok.ru")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Неверная или пустая ссылка" }),
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept-Language": "ru,en;q=0.9"
      }
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Аналогично селектору из jsdom:
    const price = $('span.current[itemprop="price"]').attr('content');

    if (!price) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Цена не найдена" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ price }),
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Ошибка при загрузке страницы" }),
    };
  }
};
