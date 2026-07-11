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
let playerName=localStorage.getItem('projectLiaPlayerName')||'';

function setAria(element,visible){
  element.setAttribute('aria-hidden',visible?'false':'true');
}

async function typeText(text,speed=75){
  dialogueText.textContent='';
  for(const char of text){
    dialogueText.textContent+=char;
    await wait(speed);
  }
}

function hideAllNarration(){
  narrationCards.forEach(card=>{
    card.classList.remove('show');
    card.classList.add('fade');
  });
}

async function showNarration(index,duration=2800){
  const card=narrationCards[index];
  if(!card)return;
  hideAllNarration();
  card.classList.remove('fade');
  await wait(80);
  card.classList.add('show');
  await wait(duration);
  card.classList.add('fade');
  await wait(750);
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
  await wait(1000);
  await showNarration(2,3000);
  await showNarration(3,2600);
  showNamePanel();
}

async function beginWalkingSequence(){
  hideDialogue();
  forest.classList.add('walking');
  await wait(700);
  blackout.classList.remove('open');
  await wait(1200);
  await showNarration(4,3200);
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

nextButton.addEventListener('click',async()=>{
  nextButton.disabled=true;
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
    nextButton.disabled=false;
  }
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

skipButton.addEventListener('click',showOpeningCheckpoint);
document.addEventListener('keydown',event=>{
  if(event.key==='Escape')showOpeningCheckpoint();
});

runOpening().catch(error=>{
  console.error('Opening sequence error:',error);
  showOpeningCheckpoint();
});
