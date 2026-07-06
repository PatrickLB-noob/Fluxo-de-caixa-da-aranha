# Regras temporárias do Firestore

Use estas regras apenas enquanto o app não tiver login.
Elas liberam leitura e escrita para o banco do app.

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teiaDoCaixa/{document=**} {
      allow read, write: if true;
    }
  }
}
```

Importante: sem autenticação, qualquer pessoa que descubra o projeto e consiga chamar o Firestore pode tentar escrever dados. Para uso sério, a próxima etapa ideal é adicionar pelo menos login simples ou regras com autenticação.
