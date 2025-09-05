import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Card, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import Carrossel from './Carrossel.jsx';
import './Home.css';

// Estilos embutidos para evitar dependência de arquivo CSS externo
const styles = {
  carouselItem: {
    height: '400px',
    backgroundColor: '#333',
    color: '#fff',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif'
  },
  cardImage: {
    height: '280px',
    objectFit: 'cover'
  },
  userListCard: {
    height: '280px',
    overflow: 'hidden'
  },
  cardTitle: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  cardText: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  }
};

// Componente Principal
export default function Home({ user }) {
  const [movies, setMovies] = useState([]);
  const [userMovies, setUserMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [allGenres, setAllGenres] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const API_URL = 'http://localhost:5000';

  const fetchUserMovies = async () => {
    if (!user || !user.id) return;
    try {
      const resUser = await fetch(`${API_URL}/users/${user.id}/listaInteresse`);
      if (resUser.ok) {
        const dataUser = await resUser.json();
        setUserMovies(dataUser);
      }
    } catch (err) {
      console.error("Erro ao buscar lista do usuário:", err);
    }
  };

  useEffect(() => {
    console.log("Usuário atual:", user);
    if (user) {
      console.log("ID enviado para backend:", user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/movies`);
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        const data = await response.json();
        setMovies(data);

        const genresSet = new Set();
        data.forEach(movie => {
          if (movie.generos) {
            movie.generos.forEach(genre => genresSet.add(genre));
          }
        });
        setAllGenres(Array.from(genresSet).sort());

        if (user) {
          await fetchUserMovies();
        } else {
          setUserMovies([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [user]);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.titulo &&
      movie.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = !selectedGenre ||
      (movie.generos && movie.generos.includes(selectedGenre));
    
    return matchesSearch && matchesGenre;
  });

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  const truncateText = (text, maxLength) => {
    if (!text) return "Sem sinopse";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const handleAdicionarNaLista = async (movie) => {
    if (!user) {
      setError("Faça login para adicionar filmes à sua lista!");
      setSuccessMessage('');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/${user.id}/listaInteresse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar filme");

      await fetchUserMovies();
      setSuccessMessage(`${movie.titulo} adicionado à sua lista!`);
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccessMessage('');
    }
  };

  const handleRemoverDaLista = async (movie) => {
    if (!user) return;
    try {
      const response = await fetch(
        `${API_URL}/users/${user.id}/listaInteresse/${movie.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Erro ao remover filme");

      await fetchUserMovies();
      setSuccessMessage(`${movie.titulo} removido da sua lista!`);
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccessMessage('');
    }
  };

  const handleAssistido = async (movie) => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/users/${user.id}/listaAssistido`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      });

      if (!response.ok) throw new Error("Erro ao mover para assistidos");

      await fetchUserMovies();
      setSuccessMessage(`${movie.titulo} foi marcado como assistido!`);
      setError('');
    } catch (err) {
      setError(err.message);
      setSuccessMessage('');
    }
  };

  return (
    <Container className="p-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        .user-list-card {
          min-width: 150px;
        }
        .user-list-card img {
          height: 150px;
          object-fit: cover;
        }
        .movie-card {
          min-height: 450px;
          transition: transform 0.2s;
        }
        .movie-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
      <Carrossel />
      
      <Row className="mb-4 mt-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Pesquisar por filme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>🎬</InputGroup.Text>
            <Form.Select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="">Todos os gêneros</option>
              {allGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {user && userMovies.length > 0 && (
        <>
          <h5 className="mb-3">Sua Lista</h5>
          <Row className="flex-nowrap overflow-auto g-2 pb-3">
            {userMovies.map((movie) => (
              <Col key={movie.id} xs={6} md={3} lg={2}>
                <Card className="user-list-card">
                  {movie.imagem && (
                    <Card.Img variant="top" src={movie.imagem} style={styles.cardImage} />
                  )}
                  <Card.Body>
                    <Card.Title style={styles.cardTitle}>{movie.titulo}</Card.Title>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoverDaLista(movie)}
                    >
                      Remover
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleAssistido(movie)}
                    >
                      Já assisti
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

      <h5 className="mt-4 mb-4">Catálogo</h5>
      {filteredMovies.length === 0 ? (
        <Alert variant="info" className="text-center">
          Nenhum filme encontrado com os filtros aplicados.
        </Alert>
      ) : (
        <Row className="g-3">
          {filteredMovies.map((movie) => (
            <Col key={movie.id} md={2}>
              <Card className="movie-card h-100">
                {movie.imagem && (
                  <Card.Img
                    variant="top"
                    src={movie.imagem}
                    style={styles.cardImage}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{movie.titulo || "Sem título"}</Card.Title>
                  <Card.Text style={styles.cardText} className="flex-grow-1">
                    {truncateText(movie.sinopse, 100)}
                  </Card.Text>
                  <Card.Text>
                    <strong>Gêneros:</strong> {(movie.generos || []).join(", ")}
                  </Card.Text>
                  <Card.Text>
                    <small>
                      Lançamento: {movie.dataLancamento || "N/A"}
                    </small>
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      onClick={() => handleAdicionarNaLista(movie)}
                    >
                      Adicionar à lista
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
