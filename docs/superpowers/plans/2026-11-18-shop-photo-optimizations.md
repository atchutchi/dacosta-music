# Correcções aprovadas após auditoria

O titular aprovou a optimização das fotografias e a correcção dos achados de 18/11/2026, com prioridade à loja. Confirmou IVA incluído também na Caiiro de 40 EUR. Medidas e condições de trocas e devoluções ficam pendentes de dados da equipa. Não inventar políticas, medidas, prazos ou novas estatísticas.

Preservar identidade, fotografias e logótipos. Converter os SVG que contêm fotografias raster para WebP até 1600 px, mantendo originais. Usar next/image com tamanhos adequados nas listas e perfis. Comparar visualmente e medir os bytes antes e depois.

No carrinho, reutilizar quoteCheckout para estimar portes por país e código postal, mostrar total apenas quando existir cotação e respeitar stock por variante. No checkout, usar os dados do comprador por defeito e permitir destinatário diferente. Remover indicativos duplicados quando o número já é internacional. O servidor, EUR, reservas, webhooks e emails mantêm as regras existentes.

Associar nomes aos controlos, título e descrição ao menu móvel e labels aos selectores. Preservar contexto de artista e serviço no contacto. Corrigir o domínio e os títulos, metadados de páginas e h1 em falta. Acrescentar uma entrada simples para merch na página inicial com o estilo existente. Datas de actualização de termos e privacidade deixam de mudar diariamente sem edição do conteúdo.

1. Testar contexto de contacto e limites do carrinho antes de implementar os helpers.
2. Converter imagens e actualizar referências, sem alterar o conteúdo das fotografias.
3. Implementar as correcções da loja e acessibilidade.
4. Implementar contacto e metadados com componentes de servidor próprios.
5. Testes automáticos, TypeScript, build e Playwright, incluindo stock, destinos sob cotação e totais. Sem encomendas ou mensagens reais.
6. Revisão independente, publicação preparada na Vercel, verificação, promoção e integração no GitHub. Confirmar os domínios públicos.
