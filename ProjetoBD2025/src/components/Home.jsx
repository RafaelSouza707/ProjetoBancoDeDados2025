import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert, Card, Row, Col, Button } from 'react-bootstrap';
import './Home.css';
import Carrossel from './Carrossel';

function Home({ user }) {
  const [movies, setMovies] = useState([]);
  const [userMovies, setUserMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // buscar lista do usuário logado
  const fetchUserMovies = async () => {
    if (!user) return;
    try {
      const resUser = await fetch(`http://localhost:5000/users/${user.id}/listaInteresse`);
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

  // Buscar filmes e lista do usuário 
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/movies");
        if (!response.ok) throw new Error(`Erro: ${response.statusText}`);
        const data = await response.json();
        setMovies(data);

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

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const truncateText = (text, maxLength) => {
    if (!text) return "Sem sinopse";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Adicionar filme à lista
  const handleAdicionarNaLista = async (movie) => {
    if (!user) {
      alert("Faça login para adicionar filmes à sua lista!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/users/${user.id}/listaInteresse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      });

      if (!response.ok) throw new Error("Erro ao adicionar filme");

      await fetchUserMovies();
      alert(`"${movie.titulo}" adicionado à sua lista!`);
    } catch (err) {
      alert(err.message);
    }
  };

  // remover filme da lista
  const handleRemoverDaLista = async (movie) => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost:5000/users/${user.id}/listaInteresse/${movie.id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Erro ao remover filme");

      await fetchUserMovies();
      alert(`"${movie.titulo}" removido da sua lista!`);
    } catch (err) {
      alert(err.message);
    }
  };

  // marcar como assistido
  const handleAssistido = async (movie) => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:5000/users/${user.id}/listaAssistido`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      });

      if (!response.ok) throw new Error("Erro ao mover para assistidos");

      await fetchUserMovies(); // atualiza lista de interesse
      alert(`"${movie.titulo}" foi marcado como assistido!`);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container className="p-4">
      <Carrossel />
      {/* Lista do usuário */}
      {user && userMovies.length > 0 && (
        <>
          <h5 className="mb-3">Sua Lista</h5>
          <Row className="flex-nowrap overflow-auto g-2 pb-3">
            {userMovies.map((movie) => (
              <Col key={movie.id} xs={6} md={3} lg={2}>
                <Card className="user-list-card">
                  {movie.imagem && (
                    <Card.Img variant="top" src={movie.imagem} />
                  )}
                  <Card.Body>
                    <Card.Title>{movie.titulo}</Card.Title>
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

      {/* Catálogo */}
      <h5 className="mt-4 mb-4">Catálogo</h5>
      <Row className="g-3">
        {movies.map((movie) => (
          <Col key={movie.id} md={3}>
            <Card className="movie-card h-100">
              {movie.imagem && (
                <Card.Img
                  variant="top"
                  src={movie.imagem}
                  className="card-img-fixed"
                />
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title>{movie.titulo || "Sem título"}</Card.Title>
                <Card.Text className="flex-grow-1">
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
    </Container>
  );
}

export default Home;
