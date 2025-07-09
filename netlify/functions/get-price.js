const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

exports.handler = async function(event) {
  const url = event.queryStringParameters.url;
  if (!url || !url.startsWith("https://vostok.ru")) {
    return { statusCode: 400, body: JSON.stringify({ error: "Неверная или пустая ссылка" }) };
  }
  try {
    const html = await (await fetch(url)).text();
    const { document } = new JSDOM(html).window;
    const span = document.querySelector('span.current[itemprop="price"]');
    const price = span?.getAttribute("content");
    if (!price) {
      return { statusCode: 404, body: JSON.stringify({ error: "Цена не найдена" }) };
    }
    return { statusCode: 200, body: JSON.stringify({ price }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "Ошибка при загрузке страницы" }) };
  }
};
