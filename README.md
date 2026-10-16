# Pizzaria Shalon

Landing page estática e responsiva para a Pizzaria Shalon, em Cordeirópolis, SP. Sem banco de dados e sem etapa de instalação.

O guia visual Yellowbird enviado serviu como referência para tipografia marcante, seções amplas e ritmo de cartaz. A identidade aplicada usa verde escuro, vermelho e creme, sem o amarelo da referência. A página inclui transições no scroll, menu móvel e visualização do cardápio original.

## Executar localmente

Na raiz do repositório:

```bash
python3 scripts/build.py
python3 -m http.server 4173
```

Abra `http://localhost:4173`.

## Prévia e publicação

A prévia isolada abre apenas o `index.html` e não resolve arquivos relativos. Por isso, `scripts/build.py` gera esse arquivo com o CSS, o JavaScript, as fontes e as imagens embutidos. Edite `source/index.html`, `styles.css`, `script.js` e os arquivos em `public/assets/`; depois rode o build e inclua o `index.html` gerado no commit. Não edite o arquivo gerado diretamente.

O `netlify.toml` publica a raiz do repositório. Ao importar a branch `main` do GitHub na Netlify, deixe o comando de build vazio e use `.` como diretório de publicação. O `index.html` gerado já está no Git, então a implantação não depende de Python ou de instalar pacotes na Netlify.

As fotos originais enviadas estão em `public/assets/`. Três imagens de pizzas foram tratadas para uso na página. As fontes locais e suas licenças estão em `public/assets/fonts/`. Os botões de pedido abrem o WhatsApp; confira telefone, endereço, sabores e disponibilidade com a pizzaria antes de publicar.
