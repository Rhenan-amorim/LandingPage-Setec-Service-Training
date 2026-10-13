# SETEC — Estudo de direção visual e experiência

13 de outubro de 2026 · Pesquisa, auditoria e quatro propostas para escolha.

> Atualização após aprovação: o usuário escolheu a direção **02 — Marinho imersivo**. A recomendação abaixo pertence à fase inicial e foi substituída por essa escolha. Consulte `checklist-implementacao.md` e `verificacao.md` para a execução.

**Recomendação:** adotar a direção 03, Equilíbrio SETEC, com a nitidez editorial da 01 e a discrição dos detalhes da 04. Alternar áreas claras de leitura com marinho nas áreas de presença institucional. Concentrar o vidro na navegação inferior. Dar protagonismo às fotografias da infraestrutura existente.

Esta entrega encerra a fase de estudo solicitada. Não altera HTML, CSS, JavaScript, textos, logos ou imagens originais. As quatro imagens são estudos gerados por IA: representam composição, atmosfera e materialidade, não uma especificação literal de marca ou um protótipo funcional. Algumas fotografias, letras e formas do logo são reinterpretadas pela geração; esses detalhes não constituem propostas de alteração. A execução deverá usar os arquivos originais e o texto do HTML, sem redesenho de logos, substituição de fotografias documentais ou supressão de conteúdo.

**O produto e seu público**

O produto é um site institucional estático, em português, com HTML, CSS e JavaScript. A home tem 12 seções; existem 20 páginas de NRs e três páginas institucionais de termos, privacidade e compliance. Os dois componentes TSX em `components/originkit/ui/` não são a aplicação principal: o HTML carrega diretamente `style.css` e `script.js`. Não há `package.json` nesta cópia; o procedimento npm indicado no README não corresponde ao material disponível.

O conteúdo sugere um público prioritariamente B2B: gestores de SST, RH/treinamento, operações e contratação nos setores naval, offshore e industrial. Profissionais procurando cursos são um público secundário possível. Essa leitura é uma inferência do conteúdo e do campo obrigatório Empresa; não há pesquisa com clientes nem dados de analytics nesta análise.

As jornadas principais são: entender a capacidade da SETEC → encontrar o serviço → conferir estrutura e credibilidade → solicitar proposta; e localizar um curso/NR → ler detalhes → entrar em contato. O formulário atual compõe uma mensagem e abre o WhatsApp. Não há evidência de envio para servidor, CRM ou e-mail nesse fluxo.

**O que aproveitar da Apple**

A Apple define Liquid Glass como uma camada funcional de navegação e controles, separada do conteúdo. Seu material ganha sentido pela relação com o que passa atrás dele. Para a SETEC, isso justifica uma cápsula inferior com translucidez, borda luminosa discreta e profundidade, mantendo descrições, cursos e formulário em superfícies estáveis. Empilhar cartões transparentes sobre outros cartões transparentes prejudicaria essa hierarquia. [Meet Liquid Glass, Apple](https://developer.apple.com/videos/play/wwdc2025/219/).

A orientação de cor recomenda parcimônia nos controles e legibilidade sobre o conteúdo subjacente. Minha aplicação é usar o marinho como estrutura, o azul como cor funcional e o cobre para pequenos destaques, seleção e alguns CTAs. Não é necessário espalhar cobre por todas as bordas. [Color, Apple HIG](https://developer.apple.com/design/human-interface-guidelines/color).

As barras de abas da Apple oferecem destinos de navegação com ícones e rótulos. Na web, a adaptação proposta é uma navegação de links reais para seções, preservando URLs, histórico e teclado. “Contato” leva à seção de contato; não envia mensagem. Os filtros de NRs são controles separados dessa navegação. [Tab bars, Apple HIG](https://developer.apple.com/design/human-interface-guidelines/tab-bars?changes=la_11).

Hierarquia e responsividade precisam continuar funcionando com texto ampliado: blocos podem se empilhar e ganhar altura. Traduzo isso em leitura com largura controlada e seções que crescem com o conteúdo. Os números de tipografia definidos abaixo são propostas para este site em CSS, não medidas de iOS transplantadas para o navegador. [Larger Text, Apple](https://developer.apple.com/help/app-store-connect/manage-app-accessibility/larger-text-evaluation-criteria).

Os recursos oficiais apresentam kits por plataforma, fontes e ferramentas. Servem como referência de proporção e acabamento; o site continuará usando seus próprios ativos e a fonte Outfit já instalada. Uma reprodução visual próxima de Liquid Glass em CSS não equivale ao material nativo dos sistemas Apple, especialmente em refração e adaptação ao fundo. A fidelidade final deve ser avaliada no navegador. [Apple Design Resources](https://developer.apple.com/design/resources/), [Liquid Glass, Apple](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass?changes=_3__6).

**Auditoria: o que corrigir primeiro**

| Prioridade | Evidência no projeto | Consequência | Direção proposta |
|---|---|---|---|
| Alta | `style.css`, regra mobile de `#navbar`, oculta a navegação até 768px. Confirmado na home móvel. | O visitante precisa percorrer a página longa para localizar ofertas. | Barra inferior persistente e menu superior acessível para os destinos complementares. |
| Alta | `#contato .contact-form h3` tem cor computada branca e o cartão também é branco. | O título “Solicitar Proposta” fica invisível. | Cor explícita de título por superfície; eliminar regra global que força títulos brancos. |
| Alta | Termos de Uso em 1440 × 960: `html` e `body` com `overflow:hidden`, conteúdo com 3597px de altura e sem `.scroll-container`. | A regra global do desktop bloqueia rolagem normal do documento. | Rolagem do documento como padrão; escopar regras de apresentação. Verificar também Privacidade e Compliance, que compartilham a folha. |
| Alta | `.sv-card__desc`, `.sf-desc`, `.v-desc` e `.nr-info-block p` dependem de hover em diferentes contextos; parte da expansão móvel usa elementos genéricos. | Informações relevantes não são igualmente descobertas por mouse, toque e teclado. | Descrições visíveis; quando necessário, expansão com botão real ou `details/summary`, mantendo o texto completo. |
| Alta | A solicitação usa uma `div`, botão com `onclick` e `window.open`; a validação apenas verifica alguns campos vazios. | A experiência não aproveita submissão e validação semânticas de formulário; falhas de abertura do WhatsApp não recebem tratamento. | Formulário nativo, validação por campo, foco no erro e tratamento da abertura externa, sem anunciar entrega confirmada. |
| Média | Desktop combina `100vh`, snap obrigatório, parallax, redução de opacidade e áreas de rolagem internas no catálogo. | Ler e comparar conteúdo exige lidar com movimentos e espaços de rolagem diferentes. | Rolagem contínua, altura natural, âncoras com compensação para controles fixos. |
| Média | Emojis, fotografias reais, ilustrações 3D, partículas e botão com neon ciano convivem. | O estilo oscila entre industrial, promocional e demonstração tecnológica. | Sistema único de ícones de traço; fotos reais como prova; reduzir decoração concorrente. |
| Média | WhatsApp fixo cobre parte do conteúdo em capturas móveis. | Pode disputar espaço com campos, cursos e a futura barra. | Manter acesso ao WhatsApp dentro de Contato; revisar presença/posição do botão flutuante junto à barra. |
| Média | Há suporte parcial a movimento reduzido, mas o rotacionador do hero usa intervalo de 4500ms sem essa condição. | A preferência de acessibilidade não governa todos os efeitos. | Movimento limitado a feedback; respeitar preferência em CSS e JS, com imagem estática como base. |

Os achados acima são inspeção de interface e código, não um ensaio completo de conformidade WCAG. O problema do título branco e o bloqueio de rolagem foram confirmados pelo estilo computado no navegador.

**Aplicação em todas as seções**

| Seção / arquivo | Tratamento recomendado, preservando o conteúdo |
|---|---|
| Início — `index.html#home` | Manter o título, subtítulo e “Conhecer Infraestrutura ↓”. Ampliar hierarquia e usar uma fotografia real bem enquadrada. Evitar mudanças automáticas de imagem como dependência da mensagem. |
| Quem Somos — `#quem-somos` | Texto completo em coluna de leitura; destaque tipográfico para os 14+ anos já declarados. Os três pilares passam a módulos alinhados, com ícones consistentes. |
| Clientes — `#clientes` | Fundo claro, logos originais com proporção e área de respiro. Preferir grade estática; se houver carrossel, permitir pausa e navegação. Não redesenhar, recolorir ou trocar logos. |
| Diferenciais — `#vantagens` | Organizar as seis razões em uma grade previsível, com descrições legíveis. Substituir as pílulas flutuantes e os balões dependentes de hover. |
| Serviços — `#servicos` | Seis cartões alinhados, títulos e descrições existentes visíveis. Conectar os cartões às seções correspondentes sem transformar toda superfície em decoração de vidro. |
| Locação — `#locacao` | Manter Nossos Serviços, Áreas de Atuação e Nossos Diferenciais como três grupos claros. Usar superfícies estáveis; no celular, empilhar. |
| Infraestrutura — `#simulador` | Valorizar as fotos existentes em galeria editorial, com legendas preservadas. Exibir os três textos completos em sequência ou expansores acessíveis. A galeria pode abrir ampliação com teclado e fechamento previsíveis. |
| Gestão — `#gestao` | Organizar os oito recursos com o mesmo padrão de ícones. Separar a explicação da ilustração. Não inventar uma tela funcional do software; somente usar captura real se ela for disponibilizada. |
| EAD — `#ead` | Preservar benefícios e o cartão de homologação. Melhorar hierarquia e espaçamento; reduzir o canvas de partículas para que a mensagem seja o foco. |
| Cursos NR — `#nr-cursos` | Preservar as quatro categorias e os vinte cursos. Filtros com estado inequívoco, teclado e cartões com descrição. No celular, controles adaptáveis e lista que cresce sem caixa interna de rolagem. |
| Aperfeiçoamento — `#treinamentos` | Preservar Naval, Elétrica, Manutenção, duração, modalidade e descrições. Manter “Falar com um Especialista” e tornar os metadados comparáveis. |
| Contato — `#contato` | Título visível, campos sobre fundo sólido e labels persistentes. Preservar endereço, telefone, e-mail, subtítulo atualmente ocultado em mobile e todos os textos dos campos. |
| Rodapé / créditos | Preservar textos, links institucionais e créditos. Melhorar legibilidade e navegação por teclado; retirar o rodapé da dependência de uma seção com altura fixa. |
| Detalhes — `nr/*.html` | Um padrão compartilhado: identificação da NR, título, texto de abertura, imagem existente, blocos de leitura e CTA. Preservar “Voltar para as NRs” e cada copy. NR-35 foi a amostra visual, não uma validação individual dos vinte conteúdos. |
| Termos, Privacidade e Compliance | Mesma tipografia e cores, largura confortável, rolagem livre, links claros. Todo conteúdo jurídico fica intacto. Esta pesquisa não revisa a veracidade ou atualidade dessas afirmações. |

A sequência atual pode ser preservada nesta primeira implementação. O ganho principal virá da organização dentro das seções e do acesso direto, evitando uma mudança simultânea de conteúdo e navegação difícil de avaliar.

**Regras práticas para a direção escolhida**

| Elemento | Proposta |
|---|---|
| Cores | Marinho `#0E2334`, azul `#1F4E79`, cobre `#B46E3C`, variações existentes `#8E5128` e `#CE8E52`, branco e cinza claro `#F3F4F6`. Areia `#ECE6D6` em áreas pontuais. |
| Tipografia | Preservar Outfit, pesos 400/500/600/700; DM Mono apenas para pequenos identificadores. Hero 48–64px desktop e 32–40px mobile; títulos de seção 32–44px; corpo 16–18px com entrelinha 1,5–1,65. Ajustar sem cortar as copies longas. |
| Espaço | Escala de 4/8/12/16/24/32/48/64/96px. Margens móveis 20–24px. Conteúdo desktop até aproximadamente 1200px; texto corrido em 60–70 caracteres por linha. |
| Superfícies | Base clara, cartões sólidos, borda discreta e sombra apenas quando explica elevação. Fotos com raios de 24–32px; campos 12–16px; cápsula de navegação com raio completo. |
| Ícones | Uma família SVG coerente, 20–24px, espessura visual uniforme. Sempre acompanhados de texto nos destinos principais. Usar ícones próprios/adequados à web, sem exigir fontes ou símbolos Apple. |
| Botões | Altura de projeto 44–48px, principal marinho com branco; cobre escuro com branco ou cobre claro com marinho quando apropriado. Hover discreto, estado pressionado, foco de alto contraste e estado indisponível apenas quando existir razão funcional. |
| Fotografia | Priorizar os arquivos reais de fachada, cabine, equipamentos e operações; preservar proporções. Imagens sintéticas das pranchas não substituem evidência documental. |
| Movimento | Proposta inicial: 160–220ms para feedback e 240–320ms para deslocamento do indicador. Sem aumento chamativo dos ícones, flutuação contínua de texto ou scroll obrigatório. Desabilitar movimento não essencial com preferência reduzida. |

Contrastes calculados para pares opacos da paleta, pela fórmula de luminância relativa WCAG: branco/marinho **16,05:1**; branco/azul **8,66:1**; cobre atual/branco **4,01:1**; cobre escuro/branco **6,25:1**; cobre claro/marinho **5,82:1**. Assim, cobre atual sobre branco não deve ser o padrão para texto pequeno. A meta é 4,5:1 para texto normal e 3:1 para texto grande, com avaliação específica de componentes. Em vidro, é necessário medir sobre os fundos efetivamente compostos; estes números não certificam as pranchas. [Contrast Minimum, W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [Accessibility, Apple](https://developer.apple.com/design/human-interface-guidelines/accessibility?changes=____5_8_2).

**Como a navegação inferior deve funcionar**

Quatro destinos persistentes, com os rótulos já existentes: **Início, Serviços, Cursos NR, Contato**. Quem Somos, Plataforma e Treinamentos continuam acessíveis no cabeçalho; no celular, em um botão de menu com nome acessível e opções completas. Os demais blocos continuam na rolagem e podem ser alcançados pelo mapa de serviços. Os quatro destinos são uma proposta editorial, não uma regra universal da Apple.

A cápsula desktop fica centralizada, com largura aproximada de 520–640px, altura 64–72px e afastamento inferior de 20–24px. No celular, usa a largura disponível com margens de 12–16px, ícones acima dos rótulos e área de toque confortável. Reservar a altura da barra no fim do conteúdo e compensar a área segura do dispositivo. O teclado virtual e a ampliação de texto precisam ser testados: nenhum campo nem botão de envio deve ficar encoberto. [Focus Not Obscured, W3C](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum).

O indicador acompanha a seção ativa com uma transição breve; deve haver forma e contraste além de mudança de cor. Links de âncora permanecem links, com indicação semântica do destino atual. A navegação não usará `role=tablist`, porque não alterna painéis de um aplicativo. Para filtros de NRs, escolher semântica de filtros ou implementar o padrão completo de abas, incluindo relação entre botão e painel e navegação de teclado.

O vidro terá base translúcida suficientemente opaca, desfoque moderado, borda luminosa fina e sombra suave. Implementar uma variante clara e uma escura conforme a superfície, sem alterar cor a cada pixel da rolagem. Sem suporte ao desfoque ou com preferência por menos transparência, usar superfície quase opaca. O alvo de 44–48px é uma decisão de conforto; o mínimo WCAG 2.2 AA de tamanho de alvo é 24px ou exceções de espaçamento, não 44px. [Target Size, W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).

**Estados e confiança**

O site é majoritariamente estático: não precisa de skeletons artificiais. Reservar dimensões de imagens para evitar deslocamentos; manter fundo e texto legíveis se uma foto falhar. O catálogo atual não depende de rede para filtrar. Não inserir um spinner para simular trabalho inexistente.

No contato, validar os campos usando o navegador e conservar os valores quando houver erro. Uma futura abertura do WhatsApp deve ser reconhecida como abertura de canal, não como confirmação de envio ou de proposta recebida. Preservar as copies existentes; eventuais novas mensagens de erro que não possam usar validação nativa devem ser tratadas como acréscimo editorial separado. Testes funcionais não devem enviar mensagens reais sem autorização.

**As quatro opções**

| Opção | Característica | Melhor uso | Compromisso |
|---|---|---|---|
| 01 — Claro editorial | Fundo pérola, títulos marinho, fotografia em faixa e cápsula clara. | Leitura, catálogo e percepção de organização. | Menor predominância do marinho que no site atual. |
| 02 — Marinho imersivo | Fundo escuro, fotografia ampla e vidro fumê. | Impacto institucional e presença industrial. | Exige cuidado extra com contraste e variedade visual em uma página longa. |
| 03 — Equilíbrio SETEC | Alternância claro/marinho, texto separado da fotografia e catálogo claro. | Equilibrar marca, confiança e consulta de serviços. | Exige transições e componentes consistentes entre superfícies. |
| 04 — Editorial cobre | Neutros mais quentes, fachada, fios de cobre e catálogo enxuto. | Aparência institucional mais sóbria e acolhedora. | O cobre deve permanecer um acento para a marca não parecer outra. |

Minha preferência é **03**, com o desenho de conteúdo mais limpo da **01**. Na execução, simplificaria as curvas decorativas que a geração introduziu na 03 e manteria a navegação com quatro destinos, sem o ícone de busca que apareceu nessa prancha: busca não foi identificada como requisito do site. O tom do cobre e a cor de cada texto de botão serão ajustados pelos contrastes definidos acima. Fotografias de cursos geradas na prancha serão substituídas pelos ativos originais de `img/nr/`, se a direção usar imagens no catálogo.

![01 — Claro editorial](<C:/Users/rhena/Downloads/SETEC Service & Training/design-study/01-claro-editorial.png>)

![02 — Marinho imersivo](<C:/Users/rhena/Downloads/SETEC Service & Training/design-study/02-marinho-imersivo.png>)

![03 — Equilíbrio SETEC](<C:/Users/rhena/Downloads/SETEC Service & Training/design-study/03-equilibrio-setec.png>)

![04 — Editorial cobre](<C:/Users/rhena/Downloads/SETEC Service & Training/design-study/04-editorial-cobre.png>)

**Verificação realizada e limites desta fase**

Inspecionei o HTML das seções, regras de estilo, interações em JavaScript, inventário de imagens/logos, padrão NR e estrutura dos documentos institucionais. Executei o site existente com servidor HTTP local e examinei visualmente as 12 seções no desktop com viewport solicitado de 1440 × 960. No celular, examinei a abertura no viewport inicial do painel, além de catálogo, contato e NR-35 com viewport solicitado de 390 × 844. Termos de Uso foi examinado no desktop, inclusive com estilos computados. A auditoria móvel não cobre todas as seções nem dispositivos físicos.

Os mockups foram gerados com a ferramenta integrada de imagens, usando o símbolo GS e duas fotos locais como referências; a primeira opção passou por uma revisão para corrigir o fundo do hero. Os prompts completos estão em `prompts.json`. Foram revistos composição, diferenciação entre direções, presença do dock e uso da paleta. A geração não garante fidelidade tipográfica, fotográfica ou de logo em nível de pixel.

Não houve implementação, build, teste de regressão, envio de formulário, teste com leitor de tela ou validação do efeito de vidro em navegadores diferentes. Nenhuma melhora de conversão foi medida. As propostas não demonstram movimento: duração, foco e estados precisam de protótipo implementado após a escolha.

Para a fase aprovada: preservar um inventário textual e hashes dos logos; implementar tokens e navegação; aplicar a direção às seções e páginas internas; conferir teclado, toque, zoom de 200%, movimento reduzido, rolagem e contraste; testar Chrome/Edge e Safari quando disponível; comparar integralmente copies e ativos; validar o fluxo de contato sem enviar uma mensagem real. O projeto atual pode permanecer estático — esta reformulação visual não exige migração de framework.

Arquivos novos desta entrega: este estudo, quatro PNGs de propostas e `prompts.json`, todos em `design-study/`. Os arquivos de produção permanecem intactos. A decisão pendente é escolher uma direção ou indicar quais elementos combinar, conforme a etapa de aprovação solicitada pelo usuário.
