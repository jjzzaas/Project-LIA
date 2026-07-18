(()=>{
  const versionText=()=>window.gameVersionText?.()||'Ver. 3.0';

  window.renderRelationshipChoice=function(scene){
    const screenType=scene.screenType||'lodging-front';
    mount(`<main class="screen ${screenType}"><section class="box relationship-box"><div class="speaker">${scene.speaker||'하루'}</div><div class="text">${scene.text.replace(/\n/g,'<br>')}</div><div class="relationship-choices">${scene.choices.map((choice,i)=>`<button class="relationship-choice" data-index="${i}">${choice.text}</button>`).join('')}</div></section><div class="version">${versionText()}</div></main>`,()=>{
      document.querySelectorAll('.relationship-choice').forEach(button=>{
        button.onclick=()=>showRelationshipConfirm(scene,Number(button.dataset.index));
      });
    });
  };

  function showRelationshipConfirm(scene,choiceIndex){
    const choice=scene.choices[choiceIndex];
    const screenType=scene.screenType||'lodging-front';
    mount(`<main class="screen ${screenType}"><section class="relationship-confirm-box"><div class="relationship-confirm-mark">◇</div><div class="relationship-confirm-title">어떤 선택은 순간으로 끝나지 않습니다.</div><div class="relationship-confirm-text">당신이 내린 결정은<br>앞으로의 이야기를 바꿀 수 있습니다.</div><div class="relationship-confirm-choice">“${choice.text}”</div><div class="relationship-confirm-actions"><button id="relationshipCancel">다시 생각한다</button><button id="relationshipConfirm">선택한다</button></div></section><div class="version">${versionText()}</div></main>`,()=>{
      document.getElementById('relationshipCancel').onclick=()=>renderRelationshipChoice(scene);
      document.getElementById('relationshipConfirm').onclick=()=>commitRelationshipChoice(scene,choice);
    });
  }

  function commitRelationshipChoice(scene,choice){
    const affinityKey=choice.affinityKey===undefined?(scene.affinityKey||'haruAffinity'):choice.affinityKey;
    const affinity=Number(choice.affinity||0);

    if(affinityKey&&affinity!==0){
      const storageKey=`mongyeong.${affinityKey}`;
      state[affinityKey]=(state[affinityKey]||Number(localStorage.getItem(storageKey)||0))+affinity;
      localStorage.setItem(storageKey,String(state[affinityKey]));
    }

    scene.selectedPlayerLine=choice.playerLine||'';
    scene.selectedResponse=choice.response;
    next();
  }

  window.renderRelationshipResponse=function(scene){
    const previous=scenes[index-1];
    const playerLine=previous?.selectedPlayerLine||'';
    const response=previous?.selectedResponse||scene.fallback;
    const screenType=scene.screenType||'lodging-front';
    const playerDialogue=playerLine?`<div class="speaker">주인공</div><div class="text">${playerLine.replace(/\n/g,'<br>')}</div>`:'';
    mount(`<main class="screen ${screenType}"><section class="box">${playerDialogue}<div class="speaker">${scene.speaker||'하루'}</div><div class="text">${response.replace(/\n/g,'<br>')}</div></section><div class="hint">터치하여 계속</div><div class="version">${versionText()}</div></main>`,()=>app.firstElementChild.onclick=next);
  };

  const originalRenderScene=renderScene;
  renderScene=function(scene){
    if(scene.type==='relationshipChoice'){renderRelationshipChoice(scene);return;}
    if(scene.type==='relationshipResponse'){renderRelationshipResponse(scene);return;}
    originalRenderScene(scene);
  };
})();