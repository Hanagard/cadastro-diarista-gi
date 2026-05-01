# Cadastro de Diarista - Gi Group

Sistema separado apenas para o diarista preencher o cadastro.

## Recursos

- Formulário público para o diarista.
- Não mostra dados de outras pessoas.
- Gera comprovante para salvar em PDF.
- Preparado para enviar os dados para Google Sheets via Apps Script.

## Conectar com Google Sheets

No arquivo `src/App.jsx`, altere:

```js
const PRIVATE_RECEIVER_URL = "";
```

para:

```js
const PRIVATE_RECEIVER_URL = "COLE_AQUI_O_LINK_DO_APPS_SCRIPT";
```

Depois salve no GitHub. A Vercel atualiza automaticamente.

## Rodar localmente

```bash
npm install
npm run dev
```
