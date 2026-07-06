# Como testar a sincronização

1. Ative o Cloud Firestore no Firebase Console.
2. Publique esta versão no GitHub Pages.
3. Abra o site no celular e crie um produto ou atendimento.
4. Abra o mesmo link no computador.
5. O dado deve aparecer sozinho após alguns segundos.

Indicador no canto inferior direito:

- Nuvem: conectado e sincronizando com Firestore.
- Offline/cache: usando cache do Firebase, deve sincronizar quando voltar internet.
- Local: Firebase não conectou; os dados ficam só no aparelho.
