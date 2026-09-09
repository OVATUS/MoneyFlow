import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate  } from 'react-router-dom'
import ProenctedRout from './components/ProenctedRout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Register from './pages/Register'
function App() {

  const Logout= ()=>{
    localStorage.clear()
    return <Navigate to ="/"/>
  }

  return (
    <>
    <BrowserRouter>
      <Routes>

        <Route
        path='/home'
        element={
          <ProenctedRout>
            <Home/>
          </ProenctedRout>
        }        
        />
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element ={<Register/>}/>
        <Route path='/logout' element ={<Logout/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
