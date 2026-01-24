import Home from './pages/home';
import About from './pages/About';
import AllToolsPage from './components/machines/AllToolsPage';
import AllProductsPage from './components/fertilisers/AllProductPage';
import WorkInProgress from './pages/WorkInProgress';
import WeatherButton from './components/WeatherButton';
import SignUp from './pages/SignUp';
import Login from './components/login';
import Logout from './components/Logout';
import {Routes, Route} from 'react-router';



function App() {

  
  return (
    <> 
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path='/about' element = {<About/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path ='/logout' element = {<Logout/>}/>
        <Route path='/products/tools'element = {<AllToolsPage/>}/>
        <Route path='/products/fertilisers' element={<AllProductsPage/>}/>
        <Route path='/products/husbandry' element = {<WorkInProgress/>}/>
        <Route path='/schemes' element = {<WorkInProgress/>}/>
        <Route path='/signup' element = {<SignUp/>} />

      </Routes>
    </>
  )
}

export default App;
