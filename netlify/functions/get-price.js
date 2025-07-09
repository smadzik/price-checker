const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

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
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const span = document.querySelector('span.current[itemprop="price"]');
    const price = span?.getAttribute("content");

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
