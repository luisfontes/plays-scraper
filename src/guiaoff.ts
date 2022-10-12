import {
  DOMParser,
  Element,
  Node,
} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';

const url = 'https://guiaoff.com.br/guia/';

type ListRaw = {
  raw_title: string;
  raw_synopsis: string;
  raw_personnel: string;
  raw_run: string;
};

main();

async function main() {
  const html = await getHTML();
  const listRaw = parseHTML(html);
  const listParsed = listRaw?.map(parseList);

  if (!listParsed || listParsed.length === 0) {
    console.log('no list items');
    return;
  }

  await Deno.writeTextFile(`./data/plays.json`, JSON.stringify(listParsed));
}

async function getHTML() {
  const res = await fetch(url);
  return await res.text();
}

function parseHTML(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html');
  const strip = (x: string) => x.replace(/\r?\n$|\r$/gm, '');

  const elems = document
    ?.querySelector('.guia-categoria span[id="teatro"]')?.parentElement
    ?.querySelectorAll('.guia-item');

  if (!elems) return;

  return Array.from(elems).map(parseNode);

  function parseNode(elem: Node) {
    const el = elem as Element;

    const title = el.querySelector('.guia-item-titulo')
      ?.textContent || '';
    const synopsis = el.querySelector('.guia-item-texto')?.textContent || '';

    const block1 = el.querySelectorAll('.guia-item-detalhe')[0] as Element;
    const personnel = block1?.querySelector('p')?.textContent || '';

    const block2 = el.querySelectorAll('.guia-item-detalhe')[1] as Element;
    const run = block2?.querySelector('p')?.textContent || '';

    if (!synopsis || !personnel || !run) {
      console.log(`Nao parseado: ${title}`);
    }

    return {
      raw_title: title,
      raw_synopsis: strip(synopsis),
      raw_personnel: personnel,
      raw_run: run,
    };
  }
}

function parseList(raw: ListRaw) {
  const reUrl =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  const parsed_url = raw.raw_run.match(reUrl)?.[0];

  return {
    ...raw,
    parsed_personnel: raw.raw_personnel.split('\n'),
    parsed_run: raw.raw_run.split('\n'),
    parsed_url,
  };
}
