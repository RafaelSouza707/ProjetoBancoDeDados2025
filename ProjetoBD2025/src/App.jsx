import { Routes, Route } from "react-router-dom";
import MainLayout from './layout/MainLayout.jsx';
import Home from './components/Home.jsx';
import TelaPerfil from './components/TelaPerfil.jsx';
import TelaLogin from './components/TelaLogin.jsx';

function App() {

  return (
    <Routes>

      <Route path="/" element={ <MainLayout/> }>
        <Route index element={ <Home/> } />
        <Route path='tela-perfil' element={<TelaPerfil />}/>
        <Route path='tela-login' element={<TelaLogin />} />
      </Route>
      
    </Routes>
  )

}

export default App;