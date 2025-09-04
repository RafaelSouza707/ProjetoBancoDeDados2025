import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Button, Row } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "/src/components/TelaLogin.css";

function TelaLogin({ setUser }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [modoCadastro, setModoCadastro] = useState(false);
    const [showSenha, setShowSenha] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:5000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
        });

        if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro no login");
        }

        const data = await res.json();

        setUser(data);                             // atualiza state
        localStorage.setItem("user", JSON.stringify(data)); // salva para persistência

        navigate("/");
    } catch (err) {
        alert(err.message);
    }
    };

    // cadastro
    const handleCadastro = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Erro ao cadastrar");
            }

            const data = await res.json();

            // Garante que novo usuário tenha arrays iniciais
            setUser({
                ...data,
                listaInteresse: [],
                listaAssistido: []
            });

            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <section className="d-flex justify-content-center align-items-center">
            <Form
                className="card-login"
                onSubmit={modoCadastro ? handleCadastro : handleLogin}
            >
                {modoCadastro && (
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Digite seu nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />
                    </Form.Group>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="exemplo@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                        type={showSenha ? "text" : "password"}
                        placeholder="* * * *"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Mostrar senha"
                        checked={showSenha}
                        onChange={() => setShowSenha(!showSenha)}
                    />
                </Form.Group>

                <Row>
                    <Button type="submit" variant="light" className="botao-form">
                        {modoCadastro ? "Cadastrar" : "Entrar"}
                    </Button>
                    <Button
                        type="button"
                        variant="light"
                        className="botao-form"
                        onClick={() => setModoCadastro(!modoCadastro)}
                    >
                        {modoCadastro ? "Já tenho conta" : "Cadastre-se"}
                    </Button>
                </Row>
            </Form>
        </section>
    );
}

export default TelaLogin;
