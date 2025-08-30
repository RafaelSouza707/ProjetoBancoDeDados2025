// Importa as bibliotecas necessárias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { DocumentStore } = require('ravendb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const store = new DocumentStore(
    ['http://localhost:8000'], 
    'ProjetoBancoDeDados'
);
store.initialize();

app.post('/movies', async (req, res) => {
    try {
        const session = store.openSession();
        const movie = req.body;

        if (!movie || Object.keys(movie).length === 0) {
            return res.status(400).json({ error: 'Corpo da requisição vazio.' });
        }

        const movieWithMetadata = {
            ...movie,
            '@metadata': {
                '@collection': 'Movies'
            }
        };

        await session.store(movieWithMetadata);

        await session.saveChanges();
        
        res.status(201).json(movie);
    } catch (err) {
        console.error("Erro ao salvar o filme:", err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/movies', async (req, res) => {
  try {
    const session = store.openSession();
    const movies = await session.advanced
      .documentQuery({ collection: "Movies" })
      .waitForNonStaleResults()
      .take(20)
      .all();

    const moviesWithId = movies.map(m => ({
      ...m,
      id: m['@metadata']['@id']
    }));

    res.json(moviesWithId);
  } catch (err) {
    console.error("Erro ao buscar filmes:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/movies/:id', async (req, res) => {
  const session = store.openSession();
  try {
    const { id } = req.params;
    const filme = await session.load(id);

    if (!filme) {
      return res.status(404).send({ error: 'Filme não encontrado' });
    }

    filme.titulo = req.body.titulo;
    filme.dataLancamento = req.body.dataLancamento;
    filme.sinopse = req.body.sinopse;
    filme.imagem = req.body.imagem;
    filme.generos = req.body.generos;

    await session.saveChanges();

    res.json({ id, ...filme });
  } catch (err) {
    res.status(500).send({ error: err.message });
  } finally {
    session.dispose();
  }
});



/*
app.put('/movies/:id', async (req, res) => {
    try {
        const session = store.openSession();
        const movie = req.body;

        if (!movie || Object.keys(movie).length === 0) {
            return res.status(400).json({ error: 'Corpo da requisição vazio.' });
        }

        movie['@metadata'] = { '@collection': 'Movies'};

        await session.store(movie);

        await session.saveChanges();
        
        res.status(201).json(movie);
    } catch (err) {
        console.error("Erro ao atualizar o filme:", err);
        res.status(500).json({ error: err.message });
    }
});
*/

app.delete('/movies/:id', async (req, res) => {
  try {
    const session = store.openSession();
    const movieId = req.params.id;

    await session.delete(movieId);
    await session.saveChanges();

    res.json({ message: `Filme ${movieId} deletado com sucesso` });
  } catch (error) {
    console.error("Erro ao deletar o filme:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => console.log('Backend rodando na porta 5000'));
