# Vale Games Play

Plataforma responsiva da Vale Games para reunir jogos e aplicativos em um único catálogo.

## Primeiro lote

Esta primeira versão inclui as capas oficiais recebidas, busca, favoritos locais, páginas de detalhes e os destinos já presentes no inventário. O link de **F1 Vale Gold Edition** é tratado como definitivo.

Os títulos que ainda não possuem endereço direto no inventário permanecem visíveis, mas mostram que aguardam o link oficial ao acionar **Jogar agora**.

## Executar localmente

```bash
pnpm install
pnpm dev
```

Para verificar a versão de produção:

```bash
pnpm build
pnpm preview
```

## Publicação

O workflow em `.github/workflows/deploy-pages.yml` publica automaticamente em GitHub Pages a cada envio para `main`. O repositório deve usar **GitHub Actions** como origem de Pages.

## Catálogo e ativos

As capas ficam em `public/assets/covers`. A relação entre títulos, arquivos e links está em `docs/ASSET_MAPPING.md`.
