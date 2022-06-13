// eslint-disable-next-line import/no-unresolved
import { mf2 } from "../dist/index.mjs";

const setResult = (result) => {
  const escaped = JSON.stringify(result, null, 2)
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  document.getElementById("result").innerHTML = escaped;
};

const setError = (error) => {
  const el = document.getElementById("error");
  el.innerHTML = `<b>Error</b>: ${error}`;
  el.classList.remove("hide");
};

const parse = (html, options) => {
  document.getElementById("error").classList.add("hide");

  try {
    const result = mf2(html, options);
    setResult(result);
  } catch (err) {
    setError(err.message);
  }

  return false;
};

window.parseHtml = () => {
  const html = document.getElementById("html").value;
  const baseUrl = document.getElementById("base-url").value;
  const lang = document.getElementById("lang").checked;
  const textContent = document.getElementById("textContent").checked;

  return parse(html, { baseUrl, experimental: { lang, textContent } });
};
