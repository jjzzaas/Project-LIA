const titleScreen=document.querySelector('#title-screen');
const openingScreen=document.querySelector('#opening-screen');
const blackout=document.querySelector('#blackout');
const forest=document.querySelector('#forest');
const narrationCards=[...document.querySelectorAll('.narration-card')];
const dialogueBox=document.querySelector('#dialogue-box');
const dialogueText=document.querySelector('#dialogue-text');
const speaker=document.querySelector('#speaker');
const nextButton=document.querySelector('#next-button');
const skipButton=document.querySelector('#skip-button');
const namePanel=document.querySelector('#name-panel');
const nameForm=document.querySelector('#name-form');
const nameInput=document.querySelector('#name-input');
const nameError=document.querySelector('#name-error');
const lagoonStage=document.querySelector('#lagoon-stage');

const wait=(ms)=>new Promise(resolve=>setTimeout(resolve,ms));
let sequenceSkipped=false;
let dialogueStep=0;
let dialogueBusy=false;
let narrationResolver=null;
let playerName=localStorage.getItem('projectLiaPlayerName')||'';

function setAria(element,visible){
  element.setAttribute('aria-hidden',visible?'false':'true');
}

async function typeText(text,speed=75){
  dialogueBusy=true;
  dialogueText.textContent='';
  for(const char of text){
    dialogueText.textContent+=char;
    await wait(speed);
  }
  dialogueBusy=false;
}

function hideAllNarration(){
  narrationCards.forEach(card=>{
    card.classList.remove('show');
    card.classList.add('fade');
  });
}

function waitForNarrationTap(){
  return new Promise(resolve=>{
    narrationResolver=resolve;
  });
}

function advanceNarration(){
  if(!narrationResolver)return false;
  const resolve=narrationResolver;
  narrationResolver=null;
  resolve();
  return true;
}

async function showNarration(index){
  const card=narrationCards[index];
  if(!card)return;
  hideAllNarration();
  card.classList.remove('fade');
  await wait(80);
  card.classList.add('show');
  await waitForNarrationTap();
  card.classList.add('fade');
  await wait(650);
}

function showDialogue(){
  dialogueBox.classList.add('show');
  setAria(dialogueBox,true);
}

function hideDialogue(){
  dialogueBox.classList.remove('show');
  setAria(dialogueBox,false);
}

function showNamePanel(){
  hideDialogue();
  nameInput.value=playerName;
  namePanel.classList.add('show');
  setAria(namePanel,true);
  setTimeout(()=>nameInput.focus(),300);
}

function showOpeningCheckpoint(){
  sequenceSkipped=true;
  advanceNarration();
  titleScreen.classList.add('hide');
  openingScreen.classList.add('active');
  setAria(openingScreen,true);
  blackout.classList.add('open');
  forest.classList.add('awake');
  hideAllNarration();
  showDialogue();
  dialogueStep=0;
  dialogueText.textContent='여긴... 어디지?';
}

async function runOpening(){
  await wait(5000);
  if(sequenceSkipped)return;
  titleScreen.classList.add('hide');
  openingScreen.classList.add('active');
  setAria(openingScreen,true);
  await wait(900);
  await showNarration(0);
  if(sequenceSkipped)return;
  await showNarration(1);
  if(sequenceSkipped)return;
  blackout.classList.add('open');
  forest.classList.add('awake');
  await wait(3000);
  if(sequenceSkipped)return;
  showDialogue();
  dialogueStep=0;
  await typeText('여긴... 어디지?',90);
}

async function beginMemorySequence(){
  hideDialogue();
  blackout.classList.remove('open');
  await wait(900);
  await showNarration(2);
  await showNarration(3);
  showNamePanel();
}

async function beginWalkingSequence(){
  hideDialogue();
  forest.classList.add('walking');
  await wait(700);
  blackout.classList.remove('open');
  await wait(1000);
  await showNarration(4);
  forest.classList.remove('walking');
  forest.classList.add('threat');
  blackout.classList.add('open');
  await wait(2200);
  lagoonStage.classList.add('show');
  setAria(lagoonStage,true);
  speaker.textContent=playerName.toUpperCase();
  showDialogue();
  dialogueStep=3;
  await typeText('뭐지... 저건?',85);
}

async function advanceDialogue(){
  if(dialogueBusy)return;
  dialogueBusy=true;
  try{
    if(dialogueStep===0){
      dialogueStep=1;
      await beginMemorySequence();
    }else if(dialogueStep===1){
      dialogueStep=2;
      await typeText('일단... 움직이자.',85);
    }else if(dialogueStep===2){
      await beginWalkingSequence();
    }
  }finally{
    dialogueBusy=false;
  }
}

openingScreen.addEventListener('click',event=>{
  if(event.target.closest('#name-panel,#skip-button,#dialogue-box'))return;
  advanceNarration();
});

dialogueBox.addEventListener('click',event=>{
  event.stopPropagation();
  advanceDialogue();
});

nextButton.addEventListener('click',event=>{
  event.stopPropagation();
  advanceDialogue();
});

nameForm.addEventListener('submit',async event=>{
  event.preventDefault();
  const value=nameInput.value.trim();
  if(value.length<1){
    nameError.textContent='이름을 입력해 주세요.';
    return;
  }
  playerName=value;
  localStorage.setItem('projectLiaPlayerName',playerName);
  nameError.textContent='';
  namePanel.classList.remove('show');
  setAria(namePanel,false);
  blackout.classList.add('open');
  speaker.textContent=playerName.toUpperCase();
  showDialogue();
  dialogueStep=1;
  await typeText(`그래... 내 이름은 ${playerName}.`,80);
});

skipButton.addEventListener('click',event=>{
  event.stopPropagation();
  showOpeningCheckpoint();
});

document.addEventListener('keydown',event=>{
  if(event.key==='Escape')showOpeningCheckpoint();
  if((event.key==='Enter'||event.key===' ')&&narrationResolver){
    event.preventDefault();
    advanceNarration();
  }
});

runOpening().catch(error=>{
  console.error('Opening sequence error:',error);
  showOpeningCheckpoint();
});
