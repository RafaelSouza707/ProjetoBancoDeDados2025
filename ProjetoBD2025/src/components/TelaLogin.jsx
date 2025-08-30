import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '/src/components/TelaLogin.css';
import { useState } from 'react';
import { Button, Row, Modal, Col } from 'react-bootstrap';


const TelaLogin = () => {

    const [ showSenha, setShowSenha ] = useState(false);
    const [ showCadastro, setShowCadastro] = useState(false);

    // Funções para gerenciar o estado do Modal
    const handleCloseCadastro = () => setShowCadastro(false);
    const handleShowCadastro = () => setShowCadastro(true);


    return (
        <>
            <section className='d-flex justify-content-center align-items-center'>

                <Form className='card-login'>
                    
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="exemplo@email.com" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGroupPassword">
                        <Form.Label>Senha</Form.Label>
                        <Form.Control type={showSenha ? "text" : "password"} placeholder="* * * *" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="showPasswordCheck">
                        <Form.Check
                            type="checkbox"
                            label="Mostrar senha"
                            checked={showSenha}
                            onChange={() => setShowSenha(!showSenha)}
                            style={{ color: "black" }}
                        />
                    </Form.Group>

                    <Row>
                        <Button className='botao-form' variant="light">Entrar</Button>
                        <Button onClick={handleShowCadastro} className='botao-form' variant="light">Inscrever-se</Button>
                    </Row>
                    
                </Form>

                <Modal show={showCadastro} onHide={handleCloseCadastro}>
                    <Modal.Header closeButton>
                        <Modal.Title> Inscreva-se </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        
                    <Form>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formNome">
                            <Form.Label> Nome completo </Form.Label>
                            <Form.Control type="text" placeholder="João silva" />
                            </Form.Group>
                        </Row>

                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formEmail">
                            <Form.Label> Email </Form.Label>
                            <Form.Control type="email" placeholder="exemplo@email.com" />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} controlId="formSenha">
                            <Form.Label> Senha </Form.Label>
                            <Form.Control type={ showSenha ? "text" : "password" } placeholder="* * * *" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="showPasswordCheck">
                            <Form.Check
                                    type="checkbox"
                                    label="Mostrar senha"
                                    checked={showSenha}
                                    onChange={ () => setShowSenha(!showSenha) }
                                    style={{ color: "black" }}
                                />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group as={Col} controlId="formRepitaSenha">
                            <Form.Label> Repita a senha </Form.Label>
                            <Form.Control type={ showSenha ? "text" : "password" } placeholder="* * * *" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="showPasswordCheck">
                            <Form.Check
                                    type="checkbox"
                                    label="Mostrar senha"
                                    checked={showSenha}
                                    onChange={ () => setShowSenha(!showSenha) }
                                    style={{ color: "black" }}
                                />
                            </Form.Group>
                            
                        </Row>



                        <Button className='mt-4' variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>

                    </Modal.Body>

                </Modal>

            </section>
        </>
    )
}

export default TelaLogin