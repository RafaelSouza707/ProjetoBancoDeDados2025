import { Container, Navbar, Nav, Dropdown, Spinner } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import IconeUsuario from '../components/InconeUsuario';
import { useState, useEffect } from "react";

// Função simulada para buscar dados do backend
const fetchUserData = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        id: 1,
        name: 'Ana Carolina',
        email: 'ana.carolina@example.com',
      });
    }, 1500); // Simula um atraso da API
  });
};

function MainLayout() {
  const [ usuario, setUsuario ] = useState(null);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await fetchUserData();
        setUsuario(userData);
      } catch (error) {
        console.error("Erro ao buscar informações do usuario!", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </div>
    );
  }

  // Adiciona um tratamento para o caso de o usuário não ser carregado
  if (!usuario) {
    return <div>Não foi possível carregar os dados do usuário.</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">PirataFlix</Navbar.Brand>
          <Nav className="ms-auto">
            <Dropdown>
              <Dropdown.Toggle 
              id="dropdown-basic"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: 'transparent',
                  padding: '0',
                  boxShadow: 'none',
                  outline: 'none',
                }}
                bsPrefix="p-0" 
                >
                {/* Substituição do <img> pelo componente IconeUsuario */}
                <IconeUsuario name={usuario.name} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="tela-perfil">Perfil</Dropdown.Item>
                <Dropdown.Item as={Link} to="tela-login">Sair</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>

      <Container className="flex-grow-1 mt-4">
        <Outlet />
      </Container>

      <footer className="bg-dark text-light text-center py-3 mt-4">
        <p>© {new Date().getFullYear()} - PirataFlix</p>
      </footer>
    </div>
  );
}

export default MainLayout;