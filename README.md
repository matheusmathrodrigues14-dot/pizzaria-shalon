# Pizzaria Shalon

Landing page estática e responsiva para a Pizzaria Shalon, em Cordeirópolis, SP. Sem banco de dados e sem etapa de instalação.

O guia visual Yellowbird enviado serviu como referência para tipografia marcante, seções amplas e ritmo de cartaz. A identidade aplicada usa verde escuro, vermelho e creme, sem o amarelo da referência. A página inclui transições no scroll, menu móvel e cardápios acessíveis pelos três cards de sabores.

## Movimento e acessibilidade

GSAP 3.15.0, ScrollTrigger 3.15.0 e Lenis 1.3.27 ficam em `vendor/` e são incorporados ao `index.html` gerado. Assim, as animações funcionam na prévia isolada e na Netlify sem depender de CDN ou instalação de pacotes. A licença do Lenis está em `vendor/LICENSE-Lenis.txt`; o cabeçalho dos arquivos GSAP identifica o autor e os termos em [gsap.com/standard-license](https://gsap.com/standard-license).

Na abertura, as linhas e palavras do título surgem em sequência; os demais elementos do hero entram depois. Durante a rolagem, títulos, cards, imagens, parallax e transições acompanham diretamente a posição do scroll e retrocedem ao rolar para cima. Em telas amplas, a fatia da marca e um asterisco vermelho fazem a transição entre o hero e os sabores, enquanto Lenis cuida das âncoras; a roda do mouse usa a rolagem nativa para responder sem atraso. Em telas menores, o site usa a rolagem nativa e evita a transição de tela. A preferência `prefers-reduced-motion: reduce` desliga essas animações e mantém todo o conteúdo visível. Se as bibliotecas não carregarem, o site mantém a revelação básica.

Os três cards de sabores abrem listas próprias. Os 50 sabores foram transcritos das imagens do cardápio antigo; as fotos continuam em `public/assets/` como fonte, mas não aparecem mais como cardápio no site. O carrinho salva os itens no navegador, permite alterar quantidades e prepara a mensagem do pedido para o WhatsApp. Somente o tamanho “Gigante Turbinada” aparece nas imagens antigas; Broto, Média e Grande, assim como todos os preços exibidos, são fictícios para esta prévia. O valor real e a disponibilidade devem ser confirmados com a pizzaria.

## Executar localmente

Na raiz do repositório:

```bash
python3 scripts/build.py
python3 -m http.server 4173
```

Abra `http://localhost:4173`.

## Prévia e publicação

A prévia isolada abre apenas o `index.html` e não resolve arquivos relativos. Por isso, `scripts/build.py` gera esse arquivo com o CSS, o JavaScript, as bibliotecas de `vendor/`, as fontes e as imagens embutidos. Edite `source/index.html`, `styles.css`, `script.js` e os arquivos em `public/assets/`; depois rode o build e inclua o `index.html` gerado no commit. Não edite o arquivo gerado diretamente.

O `netlify.toml` publica a raiz do repositório. Ao importar a branch `main` do GitHub na Netlify, deixe o comando de build vazio e use `.` como diretório de publicação. O `index.html` gerado já está no Git, então a implantação não depende de Python ou de instalar pacotes na Netlify.

As fotos originais enviadas estão em `public/assets/`. Três imagens de pizzas foram tratadas para uso na página. As fontes locais e suas licenças estão em `public/assets/fonts/`. Os botões de pedido abrem o WhatsApp; confira telefone, endereço, sabores e disponibilidade com a pizzaria antes de publicar.
