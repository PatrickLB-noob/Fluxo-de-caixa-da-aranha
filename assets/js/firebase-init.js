// Teia do Caixa 5.0 - Firebase/Firestore sem build, npm ou bundler.
// O app usa uma coleção técnica com 4 documentos:
// teiaDoCaixa/lancamentos, teiaDoCaixa/produtos, teiaDoCaixa/servicos, teiaDoCaixa/atendimentos

const firebaseConfig = {
  apiKey: "AIzaSyCBXw5xpEXAPec6KFOjqqh8SIbN5bma4K8",
  authDomain: "salaoalexsandra-58e55.firebaseapp.com",
  projectId: "salaoalexsandra-58e55",
  storageBucket: "salaoalexsandra-58e55.firebasestorage.app",
  messagingSenderId: "216000240585",
  appId: "1:216000240585:web:807fb2016eb7a5862c6618"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Persistência offline: o Firebase guarda operações localmente e sincroniza quando a internet volta.
db.enablePersistence({ synchronizeTabs: true }).catch((error) => {
  console.warn("Persistência offline do Firestore não ativada:", error.code || error);
});

const CLOUD_COLLECTIONS = ["lancamentos", "produtos", "servicos", "atendimentos"];
const ROOT_COLLECTION = "teiaDoCaixa";

function collectionDoc(name) {
  return db.collection(ROOT_COLLECTION).doc(name);
}

window.TeiaFirebase = {
  db,
  collections: CLOUD_COLLECTIONS,

  async loadCollection(name) {
    const snapshot = await collectionDoc(name).get();
    if (!snapshot.exists) return null;
    const data = snapshot.data() || {};
    return Array.isArray(data.items) ? data.items : [];
  },

  async saveCollection(name, items) {
    await collectionDoc(name).set({
      items: Array.isArray(items) ? items : [],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      version: 5
    }, { merge: true });
  },

  async loadAll() {
    const entries = await Promise.all(
      CLOUD_COLLECTIONS.map(async (name) => [name, await this.loadCollection(name)])
    );
    return Object.fromEntries(entries);
  },

  subscribeAll(onChange, onError) {
    const unsubscribers = CLOUD_COLLECTIONS.map((name) => {
      return collectionDoc(name).onSnapshot((snapshot) => {
        const data = snapshot.exists ? snapshot.data() : null;
        onChange(name, Array.isArray(data?.items) ? data.items : null, snapshot.metadata);
      }, onError);
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }
};
