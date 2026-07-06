# Teia do Caixa 4.0

Versão reorganizada do projeto.

## Estrutura

```text
index.html
assets/
  css/
    style.css
  js/
    app.js
    firebase.example.js
  img/
    spider-logo.png
docs/
```

## Como publicar pelo Firebase Hosting via site

Faça upload da pasta/ZIP mantendo o `index.html` na raiz.

## Próxima etapa

Migrar o armazenamento de `localStorage` para Cloud Firestore sem alterar o visual.


## Instalação no celular

Esta versão já está preparada como PWA. Depois de publicar em um domínio HTTPS, como Firebase Hosting, abra o site no Chrome/Edge do celular e escolha **Adicionar à tela inicial** ou **Instalar app**.

Arquivos adicionados:
- `manifest.webmanifest`
- `sw.js`
- `assets/icons/`
