# Optimização de fotografias e correcções da loja

Alterações autorizadas pelo titular após a auditoria de 18/11/2026. A Caiiro de40 EUR também inclui IVA, conforme confirmação nesta conversa.

## Fotografias

13 SVG com fotografias raster incorporadas,123548572 bytes, foram convertidos para WebP até1600 px, total1089354 bytes. Os cinco retratos do roster passam de54484893 para379224 bytes nos ficheiros de origem. A imagem de fundo passa de1292978 para107074 bytes. Os originais e os logótipos vectoriais são preservados.

Conversão reproduzível: node scripts/optimize-artist-photos.mjs. Manifesto docs/artist-photo-optimization.json. As cinco fotografias principais foram comparadas visualmente. A verificação numérica no mesmo tamanho confirmou PSNR superior a30 dB. Estas medidas comparam ficheiros e não constituem uma medição de tempo de carregamento ou Core Web Vitals.

## Loja

Carrinho com cotação por país e código postal, escalões de peso e limites de stock por variante. Destino transferido para checkout. O total antes dos portes é identificado e não se apresenta um valor final com portes por confirmar. IVA indicado nos dois modelos.

O checkout usa os dados do comprador por defeito e permite destinatário diferente. Um número completo com+ oculta o selector de indicativo. A confirmação de pagamento passa a usar o email do comprador guardado em customers, preservando a morada e o nome de entrega. O servidor continua a validar totais, stock, moeda e eventos Stripe.

## Site

Controlos com nomes acessíveis, diálogo do menu com título, miniaturas operáveis por teclado e selector de assunto associado a label. Book Artist mantém artista e assunto. Cada serviço tem ligação para um pedido contextualizado. O formulário ignora eventos vazios do select nativo oculto para não apagar o preenchimento. Títulos, canonical, Open Graph e sitemap passam a apontar para o domínio correcto. A home tem h1 textual e entrada para a loja. Datas das políticas deixam de mudar automaticamente todos os dias e preservam a data do conteúdo original.

## Dados pendentes

A equipa ainda vai fornecer medidas por tamanho e condições aprovadas de trocas e devoluções. Não foram inventadas políticas, medidas, prazos ou novas estatísticas. O contacto da loja fica disponível para esclarecimentos. As métricas dos artistas mantêm os valores existentes até haver actualização confirmada.

## Validação

41 testes automáticos e TypeScript aprovados. 32 verificações Playwright passaram na compilação local de produção, incluindo carrinho, destinatário diferente e contexto de reserva. Revisão independente concluída sem achados pendentes. Compilação local de produção aprovada antes da validação no navegador. Playwright passou 32 verificações no build de produção e testa catálogo, IVA, stock, carrinho, destinos, checkout, destinatário, contacto, serviços, títulos e navegação móvel com pagamento e emails interceptados. Nenhuma compra ou mensagem real é necessária para estes testes.

## Publicação

Produção preparada dpl_CHiQiQ9xKdocfVhGh5dnaGNDEmWT, https://dacosta-music-4dvi0me12-atchutchis-projects.vercel.app. A Vercel compilou com êxito e as 32 verificações Playwright passaram também nesta publicação antes da promoção. A API confirmou pagamento disponível e rejeitou totais manipulados, destino sob cotação e peso superior a 2 kg.

Após promoção, o domínio público mostrou os dois produtos reais com IVA incluído, estimativa de envio no carrinho e destino transferido para o checkout. AKHET e Caiiro para África do Sul: 65 EUR de produtos e 32,95 EUR de portes, total 97,95 EUR. Carrinho móvel sem transbordo. A reserva de Caiiro manteve artista e assunto. As cinco fotografias do roster foram servidas em formatos e tamanhos optimizados, somando 39499 bytes nesta medição. Este resultado depende do viewport e não é uma garantia de bytes para todos os dispositivos.

Os seis testes HTTP de rejeição passaram no domínio público. Nenhuma compra ou mensagem foi submetida. A entrega real de emails nesta versão não foi ensaiada com uma compra.
