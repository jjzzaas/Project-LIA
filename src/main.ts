import './styles.css';
import {scenes,type Scene} from './story';
const app=document.querySelector<HTMLDivElement>('#app')!;
let index=-1,locked=false;
function title(){app.innerHTML=`<main class="title screen"><div class="mist"></div><div class="logo">夢境</div><div class="subtitle">잠든 세계</div><button id="start">화면을 터치하여 시작</button><div class="version">Ver. 0.1</div></main>`;document.querySelector('#start')?.addEventListener('click',()=>next());}
function render(s:Scene){const choices=s.choices?.map(c=>`<button class="choice">${c}</button>`).join('')??'';app.innerHTML=`<main class="screen ${s.kind}"><div class="veil"></div><section class="box ${s.kind==='black'?'monologue':''}">${s.speaker?`<div class="speaker">${s.speaker}</div>`:''}<div class="text">${s.text.replaceAll('\n','<br>')}</div>${choices}</section><div class="hint">터치하여 계속</div><div class="version">Ver. 0.1</div></main>`;document.querySelectorAll('.choice').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();next()}));document.querySelector('main')?.addEventListener('click',()=>{if(!s.choices)next()});}
function next(){if(locked)return;index++;if(index>=scenes.length){index=scenes.length-1;return}locked=true;setTimeout(()=>locked=false,250);render(scenes[index]);}
title();