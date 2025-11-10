import React from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Candidates from './components/Candidates'
import Clients from './components/Clients'
import Contact from './components/Contact'
import Admin from './components/Admin'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <div className="font-sans text-slate-800">
            <Hero />
            <main>
              <About />
              <Services />
              <Candidates />
              <Clients />
              <Contact />
            </main>
            <footer className="bg-gray-900 text-gray-300 py-6 text-center text-sm">© {new Date().getFullYear()} Elevate Byte.</footer>
          </div>
        } />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
