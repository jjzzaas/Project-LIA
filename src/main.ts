import './styles.css';
import {scenes,type Scene} from './story';

const app=document.querySelector<HTMLDivElement>('#app')!;
let index=-1;
let locked=false;

function title(){
  app.innerHTML=`<main class="title screen"><div class="mist"></div><div class="logo">夢境</div><div class="subtitle">잠든 세계</div><button id="start">화면을 터치하여 시작</button><div class="version">Ver. 0.2</div></main>`;
  document.querySelector('#start')?.addEventListener('click',()=>next());
}

function renderLobby(s:Scene){
  const isGuildGuide=s.action==='guild';
  app.innerHTML=`
    <main class="screen lobby-screen">
      <header class="lobby-top">
        <div class="level-badge"><span>LEVEL</span><strong>2</strong></div>
        <div class="stamina"><span>활력도</span><div class="stamina-track"><i></i></div><b>100 / 100</b></div>
        <button class="mission-button" type="button">임무</button>
      </header>

      <section class="hero-zone" aria-label="히로인 배치 영역">
        <div class="hero-placeholder">HEROINE</div>
        ${s.speaker?`<div class="speech-bubble"><strong>${s.speaker}</strong><p>${s.text.replaceAll('\n','<br>')}</p></div>`:`<div class="unlock-message">${s.text.replaceAll('\n','<br>')}</div>`}
      </section>

      <nav class="lobby-tiles" aria-label="메인 메뉴">
        <button class="lobby-tile guild-tile ${isGuildGuide?'highlight':''}" type="button" ${isGuildGuide?'':'disabled'}><span>01</span><strong>길드</strong></button>
        <button class="lobby-tile" type="button" disabled><span>02</span><strong>잠김</strong></button>
        <button class="lobby-tile" type="button" disabled><span>03</span><strong>잠김</strong></button>
        <button class="lobby-tile" type="button" disabled><span>04</span><strong>잠김</strong></button>
        <button class="lobby-tile" type="button" disabled><span>05</span><strong>잠김</strong></button>
        <button class="lobby-tile" type="button" disabled><span>06</span><strong>잠김</strong></button>
      </nav>
      ${isGuildGuide?'<div class="tile-guide">빛나는 길드 타일을 선택하세요</div>':'<div class="hint">터치하여 계속</div>'}
      <div class="version">Ver. 0.2</div>
    </main>`;

  if(isGuildGuide){
    document.querySelector('.guild-tile')?.addEventListener('click',()=>next());
  }else{
    document.querySelector('main')?.addEventListener('click',()=>next());
  }
}

function render(s:Scene){
  if(s.kind==='lobby'){
    renderLobby(s);
    return;
  }

  const choices=s.choices?.map(c=>`<button class="choice">${c}</button>`).join('')??'';
  app.innerHTML=`<main class="screen ${s.kind}"><div class="veil"></div><section class="box ${s.kind==='black'?'monologue':''}">${s.speaker?`<div class="speaker">${s.speaker}</div>`:''}<div class="text">${s.text.replaceAll('\n','<br>')}</div>${choices}</section><div class="hint">터치하여 계속</div><div class="version">Ver. 0.2</div></main>`;

  document.querySelectorAll('.choice').forEach(button=>button.addEventListener('click',event=>{
    event.stopPropagation();
    next();
  }));
  document.querySelector('main')?.addEventListener('click',()=>{
    if(!s.choices)next();
  });
}

function next(){
  if(locked)return;
  index++;
  if(index>=scenes.length){
    index=scenes.length-1;
    return;
  }
  locked=true;
  setTimeout(()=>locked=false,250);
  render(scenes[index]);
}

title();