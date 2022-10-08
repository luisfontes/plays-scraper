import {
  DOMParser,
  Element,
} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';

const url = 'https://guiaoff.com.br/guia/';

type Data = {
  title: string;
  synopsis: string;
  personnel: string;
  run: string;
};

try {
  const res = await fetch(url);
  const html = await res.text();
  const document = new DOMParser().parseFromString(html, 'text/html');
  const list: Data[] = [];

  const elems = document
    ?.querySelector('.guia-categoria span[id="teatro"]')?.parentElement
    ?.querySelectorAll('.guia-item');

  elems?.forEach((elem) => {
    const el = elem as Element;
    const title = el.querySelector('.guia-item-titulo')
      ?.textContent || '';
    const synopsis = el.querySelector('.guia-item-texto')?.textContent || '';

    const det1 = el.querySelectorAll('.guia-item-detalhe')[0] as Element;
    const personnel = det1?.querySelector('p')?.textContent || '';

    const det2 = el.querySelectorAll('.guia-item-detalhe')[1] as Element;
    const run = det2?.querySelector('p')?.textContent || '';

    if (synopsis && personnel && run) {
      list.push({
        title,
        synopsis,
        personnel,
        run,
      });
    } else {
      console.log(`Nao parseado: ${title}`);
    }
  });

  if (list.length > 0) {
    await Deno.writeTextFile(`./data/plays.json`, JSON.stringify(list));
  }
} catch (error) {
  console.log(error);
}
