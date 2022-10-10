import {
  DOMParser,
  Element,
  Node,
} from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';

const url = 'https://guiaoff.com.br/guia/';

type ListItem = {
  title: string;
  synopsis: string;
  personnel: string;
  run: string;
};

main();

async function main() {
  const html = await getHTML();
  const listRaw = parseHTML(html);
  const parsedList = listRaw?.map(parseList);

  if (!parsedList || parseList.length === 0) {
    console.log('no list items');
    return;
  }

  await Deno.writeTextFile(`./data/plays.json`, JSON.stringify(parsedList));
}

async function getHTML() {
  const res = await fetch(url);
  return await res.text();
}

function parseHTML(html: string) {
  const document = new DOMParser().parseFromString(html, 'text/html');

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

    return { title, synopsis, personnel, run };
  }
}

function parseList(raw: ListItem) {
  const strip = (x: string) => x.replace(/\r?\n|\r/gm, '');

  return {
    title: {
      raw: raw.title,
    },
    synopis: {
      raw: strip(raw.synopsis),
    },
    personnel: {
      raw: raw.personnel,
      parsed: raw.personnel.split('\n'),
    },
    run: {
      raw: raw.run,
      parsed: raw.run.split('\n'),
    },
  };
}
