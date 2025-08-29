// seedMovies.js
const { DocumentStore } = require("ravendb");

async function seedMovies() {
  const store = new DocumentStore(
    ["http://localhost:8000"],   // URL do seu RavenDB
    "ProjetoBancoDeDados"        // Nome do banco
  );
  store.initialize();

  const session = store.openSession();

  // Lista de filmes iniciais (coloque os seus aqui)
  const movies = [
    { title: "The Matrix", year: 1999, genre: "Sci-Fi" },
    { title: "Inception", year: 2010, genre: "Sci-Fi" },
    { title: "Interstellar", year: 2014, genre: "Sci-Fi" }
  ];

  for (let movie of movies) {
    // salva dentro da coleção "Movies"
    await session.store(movie, null, "Movies");
  }

  await session.saveChanges();
  console.log("✅ Filmes adicionados na coleção 'Movies'");
}

seedMovies().catch(err => console.error("❌ Erro:", err));
