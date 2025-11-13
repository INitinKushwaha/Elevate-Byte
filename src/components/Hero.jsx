import React from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { Link as ScrollLink } from 'react-scroll';

export default function Hero(){
  const particlesInit = async (engine) => { await loadSlim(engine) }
  return (
    <header className="relative min-h-screen flex items-center justify-center bg-hero overflow-hidden">
      <Particles id="tsparticles" init={particlesInit} options={{
        background:{color:{value:'transparent'}}, fpsLimit:60,
        particles:{ number:{value:40}, color:{value:['#2563eb','#22c55e']}, links:{enable:true, distance:140, opacity:0.12}, move:{enable:true, speed:1.2}, size:{value:{min:2,max:6}}, opacity:{value:0.7}}
      }} className="absolute inset-0 -z-10" />
      <div className="container mx-auto px-6 text-center z-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold">Connecting Top Tech Talent with Leading Global Companies</h1>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Elevate careers and empower organizations through seamless recruitment solutions.</p>
        <div className="mt-8 flex justify-center gap-4">
          <ScrollLink to="clients" smooth duration={600}><button className="px-6 py-3 rounded-lg bg-primary text-white">Hire Talent</button></ScrollLink>
          <ScrollLink to="candidates" smooth duration={600}><button className="px-6 py-3 rounded-lg border">Find a Job</button></ScrollLink>
        </div>
      </div>
    </header>
  )
}
