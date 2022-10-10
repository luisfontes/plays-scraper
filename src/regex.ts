let str =
  'Texto: Juca de Oliveira. Com: Juca De Oliveira, Rosi Campos, Léo Stefanini, Fábio Herford, Déo Patrício, Juliana Araripe, Natallia Rodrigues, Daniel Warren e Angela Dippe (locução em off). Direção: Léo Stefanini.';
// const a = str.match(/(?:(\S+):\s?)(.*?)(?:\.?\s\S+:)/);

const re = /(?:\.?\s?)(?<key>\S+)(?:\:)\s?(?<value>[\sA-zÀ-ú,()]+)/gmi;

const pairs = [];

for (const [, key, value] of str.matchAll(re)) {
  pairs.push({
    key,
    value: value.split(',').map((x) => x.trim()),
  });
}

console.log(pairs);
