# RELATÓRIO: SESSÕES DE TRABALHO - 2026-04-20

## SESSÃO 1: Bundle Size (6MB) - Problema Identificado

### O que foi feito:
1. Identificado bundle de 6MB (gzip 1.4MB) causando login lento
2. Criado RELATORIO-PROBLEMA-FRONTEND.txt explicando:
   - CAUSA: `manualChunks: undefined` desabilita code splitting
   - @evoapi/design-system (45MB!) estava em optimizeDeps.include
   - 77 páginas como static imports

### Problemas identificados:
- Bundle muito grande causa lentidão extrema
- Design system não faz tree-shaking por causa de barrel imports

### Solução proposta:
- OPÇÃO 1: Code splitting básico no vite.config (1-2 horas, baixo risco)
- OPÇÃO 2: Per-componente imports (2-3 semanas, alto risco)
- OPÇÃO 3: Substituir design system (3-4 semanas)
- OPÇÃO 4: Refatorar RouterGuard para lazy loading (1 semana)

---

## SESSÃO 2: Tentativa de Code Splitting - Deploy com Imagem "latest"

### O que foi feito:
1. Modificado vite.config.ts para separar chunks:
```typescript
manualChunks: (id) => {
  if (id.includes('node_modules')) {
    if (id.includes('@evoapi/design-system')) return 'vendor-ui';
    if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
    if (id.includes('zustand') || id.includes('date-fns') || id.includes('axios')) return 'vendor-utils';
    return 'vendor-misc';
  }
}
```
2. Removido @evoapi/design-system de optimizeDeps.include
3. Build gerou chunks: vendor-react (888KB), vendor-ui (40KB), vendor-utils (99KB), vendor-misc (1.2MB), index (3.9MB)

### Problema NOVO (não previa):
- Docker Swarm não atualizava porque imagem "latest" tinha mesmo checksum
- **Solução**: Usar tags únicas como `fix-20260420024117`

### Após deploy: TELA BRANCA
- Nginx logs mostravam 200 OK para todos assets
- Browser mostrava tela branca

---

## SESSÃO 3: Investigação da Tela Branca

### O que foi investigado:
1. ✅ Build local funciona corretamente
2. ✅ Chunks existem e são referenciados no HTML
3. ✅ Nginx serve todos arquivos corretamente
4. ✅ Auth, Gateway, Core todos healthy

### Erro identificado:
```
vendor-misc-TgYOYOm0.js:9 Uncaught TypeError: Cannot read properties of undefined (reading 'createContext')
```

### CAUSA RAIZ DA TELA BRANCA:
```
index.html carrega nesta ordem:
1. <link rel="modulepreload" href="/assets/vendor-misc-TgYOYOm0.js">
2. <link rel="modulepreload" href="/assets/vendor-react-CFIBt__B.js">
3. <script type="module" src="/assets/index-Dbzqkg4R.js">

Problema: browser pode EXECUTAR vendor-misc ANTES de vendor-react!
vendor-misc contém código que precisa de React.createContext,
mas React só existe em vendor-react.
```

### Tentativas de correção:
1. **Adicionou @evoapi/design-system de volta em optimizeDeps.include** → ERRO persiste
2. **Separou apenas vendor-ui (design system)** → ERRO persiste
3. **Reverteu para bundle único** → Não testado no Swarm (usuário não quis)

---

## ESTADO ATUAL (2026-04-20 12:29)

### Código atual no git (HEAD `33e79be`):
- bundle único de ~6MB
- **FUNCIONA** (mas lento)

### Último vite.config.ts modificado (não commitado):
- manualChunks tenta separar vendor-ui (design system)
- Build gera: vendor-ui (801KB) + index (5.2MB)

### Docker image pronta para deploy:
- Tag: `fix-20260420123500`
- Salva em: `/tmp/evo-frontend-fixed.tar`
- Só precisa ser carregada e deployada no Swarm

---

## O QUE PRECISA PARA RESOLVER DEFINITIVAMENTE

### Opção A: Lazy Loading nas Rotas (MÉDIA COMPLEXIDADE)
**Tempo estimado: 1 semana**

O problema: RouterGuard bloqueia children quando `isLoading=true`, e PermissionRoute retorna spinner durante loading. Isso cria deadlock com Suspense.

**O que mudar:**
1. Refatorar RouterGuard para NÃO bloquear durante loading
2. Refatorar PermissionRoute para usar Suspense corretamente
3. Usar React.lazy() nas 77 páginas estáticas

**Resultado esperado:**
- Bundle inicial: ~500KB-1MB
- Páginas carregam sob demanda
- Login rápido

### Opção B: Forçar Ordem de Carregamento (COMPLEXA)
**Tempo estimado: 2-3 dias**

Usar `depend` attribute no HTML para forçar vendor-react carregar ANTES de vendor-misc:
```html
<script type="module" src="/assets/vendor-react.js" defer></script>
<script type="module" src="/assets/vendor-misc.js" defer depend="vendor-react"></script>
```

Mas isso é experimental e pode não funcionar em todos browsers.

### Opção C: Voltar ao Bundle Único (RESOLVE AGORA)
**Tempo estimado: 5 minutos**

Reverter para `manualChunks: undefined` e lived with 6MB.

**Resultado:**
- Resolve problema de tela branca
- Bundle continua 6MB (lento mas funciona)

---

## RECOMENDAÇÃO

**AGORA:** Deploy a imagem `fix-20260420123500` que separa apenas vendor-ui. Se ainda der tela branca, reverter para bundle único.

**DEPOIS:** Implementar Opção A (lazy loading) em projeto separado, refatorando RouterGuard.

---

## ARQUIVOS CRÍTICOS

| Arquivo | Problema |
|---------|----------|
| `src/guards/RouterGuard.tsx` | Bloqueia durante isLoading=true, impede Suspense |
| `src/routes/PermissionRoute.tsx` | Retorna spinner durante loading, causa deadlock |
| `src/routes/index.tsx` | 77 páginas como static imports |
| `vite.config.ts` | manualChunks causando problemas de ordem |

---

## SERVIÇOS NO SWARM (TODOS HEALTHY)

```
evocrm_evocrm_auth         Running
evocrm_evocrm_core         Running
evocrm_evocrm_processor    Running
evocrm_evocrm_frontend      Running (bundle 6MB)
evocrm_evocrm_gateway      Running
evocrm_evocrm_crm          Running
evocrm_evocrm_redis        Running
```
