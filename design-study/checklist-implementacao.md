# Marinho imersivo — checklist de projeto e execução

Direção aprovada pelo usuário: opção 02. Desktop com sete destinos na barra inferior; após ajuste solicitado, mobile com Treinamentos, Serviços, Cursos NR e Contato na barra e Início, Quem Somos e Plataforma no menu superior. Preservar copies e arquivos de logos. Trabalho no projeto local; publicação não faz parte desta etapa.

## Preparação — concluída antes de alterar a aplicação

- [x] Mapear as 12 seções, 20 páginas de NR e três páginas legais.
- [x] Confirmar arquitetura estática: HTML/CSS/JS, sem necessidade de instalar framework ou dependências.
- [x] Registrar a decisão de cor: marinho #0E2334, base profunda #081D2B, superfícies #142F42, cobre claro #CE8E52, texto claro #F4F7FA e secundário #B9C9D4.
- [x] Preservar Outfit e os logos originais. Não usar imagens dos mockups como conteúdo factual.
- [x] Selecionar hero: ct-cabine-vidro.jpg (original grande) e hero-bg-2.jpg (versão leve existente). Selecionar hero-bg-3.jpg para equipe e fotografias ct-* para infraestrutura.
- [x] Definir carregamento: hero prioritário com srcset/sizes, imagens inferiores lazy, dimensões/proporções reservadas e fundo estável se a imagem falhar.
- [x] Definir ativos a criar: biblioteca SVG de traço para navegação, serviços, benefícios e contatos; superfícies e efeitos são CSS, não imagens pesadas.
- [x] Conferir necessidade de geração de fotos: não necessária; já existem fotos reais adequadas. Não fabricar instalações, pessoas, clientes ou interfaces do software.
- [x] Desenhar barra desktop: sete links, ícone + rótulo, indicador ativo cobre suave, fundo de vidro fumê, borda luminosa e sombra discreta.
- [x] Desenhar barra mobile: quatro links visíveis em uma linha; menu complementar compacto no canto superior direito, com três destinos. Reservar espaço para a barra e para safe-area.
- [x] Definir navegação semântica por âncoras, URLs copiáveis, histórico, indicação de seção atual, foco visível e ausência de scroll-snap.
- [x] Definir indicador animado da barra: deslocamento curto, ícones com resposta sutil, sem animação contínua.
- [x] Definir transições: 180ms para controles, 280ms para indicador, 500ms para entrada discreta; preferência de movimento reduzido desativa movimentos não essenciais.
- [x] Definir fallback sem blur e com transparência reduzida/contraste forçado.
- [x] Planejar todos os blocos: hero fotográfico; empresa/equipe; logos estáticos; diferenciais legíveis; serviços navegáveis; locação em colunas; galeria real; gestão/EAD com recursos organizados; catálogos filtráveis; formulário sólido; rodapé acessível.
- [x] Preservar os textos dos detalhes NR e documentos legais; aplicar o mesmo sistema visual e corrigir rolagem.
- [x] Remover dependência de hover para leitura. Fotos ampliáveis por links reais e lightbox acessível; sem JS continuam abrindo a imagem.
- [x] Planejar filtros NR com abas completas (setas, Home/End, ARIA e painéis) e aperfeiçoamento com aria-pressed.
- [x] Planejar formulário nativo: validação de nome, empresa e e-mail; manter os campos e labels; encaminhar ao WhatsApp sem declarar envio confirmado.
- [x] Planejar modal de créditos com Escape, contenção e restauração de foco; preservar todos os links existentes.
- [x] Planejar verificação de copies e hashes de logos contra Git, recursos locais, sintaxe JS e HTML.
- [x] Planejar inspeção de desktop 1440px, tablet 768px e mobile 390/320px; teclado, filtros, navegação, formulário inválido e páginas NR/legais.
- [x] Delimitar testes: não enviar mensagens reais, não publicar, não alegar Safari/dispositivo físico ou leitor de tela sem teste.

## Produção e aplicação

- [x] Criar e conferir biblioteca de ícones SVG.
- [x] Implementar navegação, fotografia e hierarquia em todas as seções.
- [x] Implementar estados, movimento, formulários e modais.
- [x] Aplicar navegação e estilos compartilhados às páginas NR e legais.
- [x] Executar verificações e corrigir regressões encontradas.
- [x] Registrar evidências e limitações; entregar prévia local.

Execução concluída. Evidências e escopo real dos testes: [verificacao.md](verificacao.md). Capturas reais em `verification/`. Os limites de Safari, leitor de tela, dispositivo físico e envio externo são explicitados no relatório; não representam testes realizados.

## Critérios de aceite

As sete opções devem permanecer acessíveis: todas na barra desktop; quatro na barra mobile e três no menu superior. Nenhum texto de conteúdo deve ser removido ou reescrito. Nenhum arquivo de logo deve mudar. A interface deve permitir leitura sem hover, navegação pelo teclado e rolagem natural. O site deve continuar estático e funcionar sem bibliotecas externas de animação. Erros e carregamento devem refletir a operação real, sem spinners artificiais ou confirmação falsa de contato.
