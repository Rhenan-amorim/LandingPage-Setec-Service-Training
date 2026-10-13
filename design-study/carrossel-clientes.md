# Round Carousel — 17 clientes SETEC

Componente instalado pelo CLI oficial Originkit com `add roundcarousel --prompt --no-deps`. A autenticação foi passada apenas ao ambiente temporário do processo; nenhuma chave integra os arquivos do site ou o Git.

Fonte original: `components/originkit/ui/roundcarousel.tsx`. Como o produto é um site estático, a implementação de produção em `round-carousel.js` e `style.css` adapta o componente para HTML/CSS/JavaScript. Mantém o cálculo de raio por quantidade de imagens, disposição circular 3D, inclinação e arraste. O fonte recebido utiliza estilos inline, sem classes Tailwind; não é necessário acrescentar React ou Tailwind para executar essa adaptação.

## Preservação das logos

As 17 referências originais estão em `client-logos.json`. Há 17 itens e 17 imagens únicas no carrossel, com os mesmos arquivos e textos alternativos: Petrobras, Subsea 7, Michelin, PRIO, DOF, CBO, Accelleron, Romaga, VMS Group, Everllence, STX Service Americas, Velko, Aegir Marine, Nitnave Offshore, Baru Offshore, WCM e Lamsa.

Cada imagem usa `object-fit: contain` sobre cartão branco, preservando o desenho completo e as cores. Nenhum arquivo de logo foi editado ou removido. No modo circular, a perspectiva mostra parte do conjunto por vez, com todas as 17 marcas no anel. Sem JavaScript a grade fica disponível por padrão.

Após ajuste solicitado pelo usuário, a apresentação final contém apenas o carrossel: setas, play, contador, nome atual, botão de grade e instrução visível foram removidos. As capturas anteriores com controles documentam a primeira versão.

## Interação

Rotação automática lenta, pausa durante hover/foco e suspensão fora da tela ou em aba oculta. Preferência de movimento reduzido evita rotação automática e faz os comandos de teclado avançarem imediatamente. Setas esquerda/direita, Home, End, barra de espaço para pausar e arraste horizontal continuam operáveis, sem controles visuais adicionais. O gesto vertical continua reservado à rolagem da página. A orientação de teclado está disponível apenas para leitores de tela.

## Verificado antes da publicação

- 17 imagens carregadas, sem referências duplicadas; após retirada dos controles, teclado novamente percorreu as 17 empresas e completou a volta.
- Home, End e seta esquerda: Petrobras, Lamsa e WCM confirmados; arraste horizontal mudou o cartão e encerrou a captura do ponteiro.
- Grade testada na primeira versão; o botão de abertura foi posteriormente retirado. A grade permanece como fallback sem JavaScript.
- Inspeção de desktop 1440 px e mobile 390/320 px. Na versão final, não há botões na seção nem transbordamento horizontal.
- Console do navegador sem erros/avisos no percurso testado.
- `node --check round-carousel.js`, `node --check script.js`, `git diff --check` e verificador estrutural das 24 páginas passaram. Os 78 ativos já versionados permaneceram idênticos, incluindo as logos.

Limites: viewports simulados em Chromium; aparelho físico, Safari/iOS, leitor de tela e preferências do sistema não foram testados nesta etapa. O arraste foi exercitado com ponteiro no navegador, não com toque físico.

Referência: [Originkit Components](https://www.originkit.dev/docs/components).
