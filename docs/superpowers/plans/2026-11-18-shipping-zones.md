# Plano de implementação dos portes internacionais

Spec: ../specs/2026-11-18-shipping-zones-design.md

Objectivo: escolher país, reconhecer zona e apresentar portes e total com validação no servidor. Execução nesta conversa, conforme pedido do titular.

- [x] Criar testes de comportamento para as 15 zonas, escalões 1000/2000 g, destino inválido, cotação obrigatória e embalagens.
- [x] Centralizar países, preços em cêntimos, excepções e estimativas confirmadas em lib/shipping-rates.ts. Adaptar lib/checkout-pricing.ts para calcular peso e valores canónicos.
- [x] Adaptar checkout para mostrar país, zona, escalão, preço e total, incluindo estados sem cotação e confirmação de alterações de preço no servidor.
- [x] Impedir contornar as novas regras pelas rotas de pagamento. Manter Stripe em EUR e stock sem alterações de semântica.
- [x] Executar testes, TypeScript, compilação e verificação do percurso no navegador, sem criar vendas de teste em produção.
- [x] Rever o diff, publicar e verificar o domínio público. Registar a tabela activa e a regra provisória de peso.

Revisão: países não devem receber tarifa por omissão. Os pesos somam todas as linhas e só uma embalagem. Mudanças de país/quantidade invalidam o orçamento anterior. Sem portes confirmados não existe total final nem pagamento. Sessões de encomendas antigas preservam os seus valores.
