# Loja DaCosta: preparação de lançamento

Estado em 11 de Outubro de 2026. As alterações ainda não foram publicadas em produção.

## Configuração confirmada pelo titular

AKHET ADE 2026 Limited Edition Oversized T-Shirt, categoria Apparel, preço 25 EUR com IVA incluído. Quantidades XS 10, S 10, M 30, L 30 e XL 20. Fotografias originais convertidas para WebP de 1080 por 1080, frente 27 988 bytes e verso 25 556 bytes.

CTT e DHL mantêm a tabela existente: Portugal 5,50 EUR, países europeus suportados 12,50 EUR, África do Sul 35 EUR e restantes países suportados 25,50 EUR. Portes gratuitos apenas em Portugal para subtotal superior a 100 EUR. Países suportados: PT, ES, FR, DE, IT, NL, GB, US, BR e ZA.

Email da conta Stripe e das notificações: cesar@dacosta-music.com. Pixel Meta: 834660132483518. Só é carregado após aceitação dos cookies de marketing. O visitante pode revogar a escolha no rodapé.

## Stripe

Conta de teste: acct_1UPIsc3ZXz9VpYde, Área restrita de Bergh Lopes da Costa Lda.

Produto criado no catálogo de teste: prod_VQ9J4Lx4qswBiG. Preço avulso de 25 EUR: price_1UPJ1M3ZXz9VpYdePwvtXmOB. Referência do preço: akhet_ade_2026_eur. A Stripe limita a descrição do catálogo a 500 caracteres. A descrição completa fornecida permanece no ficheiro docs/products/akhet-ade-2026.json.

Adicionada também a Caiiro London 2025 Limited Edition Oversized T-Shirt, com preço avulso de 40 EUR, imagem existente e referência caiiro_london_2025_eur. Produto de teste prod_VQ9ZZ0hfWKU5cV e preço price_1UPJFz3ZXz9VpYdevZS8aM85. O catálogo Stripe de teste tem os dois modelos conhecidos.

A loja pública www.dacosta-music.com/shop, o endpoint público com limite de 100 produtos e a consulta à base de dados com permissões de serviço foram verificados em 11 de Outubro de 2026. Apenas a Caiiro London aparece no catálogo remoto, com 95 unidades totais e tamanhos S, M, L e XL. O titular afirma que todos os artigos da loja devem constar na Stripe. Está pendente identificar eventuais outros modelos ausentes do catálogo consultado.

A autorização da ferramenta oficial Stripe CLI está pendente de confirmação do titular. O email foi verificado. A conta de produção acct_1UPIsMKjA5qPbVh5 está na activação, com o tipo de empresa ainda por confirmar. Identidade, dados fiscais, conta bancária de recebimento e aceitação de termos devem ser concluídos pelo titular directamente na Stripe. Não foram utilizados dados de cartão.

O checkout do site usa preços do catálogo local, recalculados no servidor. A reserva de stock ocorre antes de abrir a sessão de pagamento. A sessão expira após 30 minutos. A confirmação de pagamento valida a sessão, o montante e a moeda. Eventos repetidos não descontam stock novamente. O serviço de email usa identificadores de idempotência e uma marca de confirmação enviada.

## Validação e publicação

Testes de regras de preços, inventário PostgreSQL, emails com transporte simulado, consentimento Meta e configuração de segurança. Compilação de produção e TypeScript verificados localmente. O roteiro scripts/qa-shop-browser.js usa produtos e resposta de checkout simulados no browser. Não cria encomendas, pagamentos nem emails na base de dados de produção.

Ainda é necessário testar uma compra no ambiente Stripe de teste, os webhooks assinados e a entrega de emails. A migração scripts/migrations/2026-10-11-merch-inventory.sql foi testada num PostgreSQL descartável e aplicada à base de dados remota. O produto AKHET foi registado como rascunho inactivo, id 8b8b5fce-fc7d-4b8e-883a-5304c90983aa, com as 100 unidades por tamanho. A Caiiro mantém as 95 unidades existentes.

Projecto Vercel: prj_0b6xpNnxvP3J2fSkfr6i1NNMlMWC, equipa atchutchis-projects. A ferramenta Vercel está ligada ao projecto correcto. vercel.json fixa a instalação com npm ci para usar o package-lock.json actualizado.

Antes do lançamento, configurar as chaves da nova conta no ambiente correspondente, STRIPE_WEBHOOK_SECRET, ORDER_NOTIFICATION_EMAIL e NEXT_PUBLIC_SITE_URL. Chaves secretas devem ser introduzidas em ficheiros ignorados ou nas variáveis da Vercel. Não devem ser colocadas na documentação, no Git ou em mensagens.

O webhook deve subscrever checkout.session.completed, checkout.session.expired e payment_intent.payment_failed em /api/webhooks/stripe. O endpoint de produção rejeita eventos de teste. O catálogo pode ser publicado antes da activação Stripe, com aviso e botão de pagamento desactivado. A configuração actual usa uma chave de teste da conta antiga acct_1T4FJUJHAEjy8Yxk. O site rejeita essa chave em produção para impedir que um pagamento simulado seja apresentado como venda real.

O titular ainda não confirmou se as 100 unidades são partilhadas entre o site e o evento. O painel preparado permite actualizar quantidades por tamanho após vendas presenciais. Essa rotina precisa de ser definida antes das vendas simultâneas no evento.

Next.js actualizado para 16.4.0 através de actualização compatível. Restam alertas nas dependências transitivas de desenvolvimento do Tailwind 3. A correcção automática proposta exige uma migração para Tailwind 4 e não foi aplicada neste lançamento.
