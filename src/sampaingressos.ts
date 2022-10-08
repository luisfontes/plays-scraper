const pagUrl = (pag: number) =>
  `https://www.sampaingressos.com.br/espetaculos/adulto&${pag}`;
const playUrl = 'https://www.sampaingressos.com.br/espetaculos/';

async function getURLs() {
  let zefini = true;
  let pag = 1;

  while (zefini) {
    const res = await fetch(pagUrl(pag), { method: 'POST' });
    const data = await res.json();

    if (data.status === 0) {
      console.log('status 0');
      return;
    }

    const retorno = JSON.parse(data.retorno);
    const espetaculos = retorno.espetaculos;

    console.log(pag);
    console.log(espetaculos.length);

    if (espetaculos.length === 0) {
      zefini = false;
    }

    pag += 1;
  }
}

getURLs();
