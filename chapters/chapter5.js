(()=>{
  window.CHAPTER_5=[
    {type:'black',text:'CHAPTER 5\n\n혼자 걷는 첫걸음'},
    {type:'lodging',text:'눈을 뜨자 익숙해진 숙소의 천장이 보였다.\n어제 훈련의 피로가 아직 온몸에 남아 있었다.'},
    {type:'lodging',text:'하루는 오늘부터 다시 임무를 나간다고 했다.\n이제부터는 배운 것을 혼자 반복하며 익혀야 한다.'},
    {type:'black',text:'아직 부족하다.\n오늘도 훈련장에 가자.'},
    {type:'lodging',text:'몸을 일으켜 준비를 마친 뒤 숙소를 나섰다.'},

    {type:'city',text:'훈련장으로 향하던 길이었다.\n길 건너편에서 익숙한 모습이 다가왔다.'},
    {type:'city',speaker:'모모',text:'어? 좋은 아침.\n훈련 가는 거야?'},
    {type:'relationshipChoice',screenType:'city',speaker:'주인공',text:'모모에게 뭐라고 대답할까?',affinityKey:'momoAffinity',choices:[
      {text:'훈련하러 간다고 대답한다.',playerLine:'네. 오늘도 훈련하러 가는 길입니다.',affinityKey:null,affinity:0,response:'응. 잘 다녀와.'},
      {text:'같이 갈지 물어본다.',playerLine:'모모 씨도 같이 가실래요?',affinityKey:'momoAffinity',affinity:2,response:'나도 같이 가고 싶은데 오늘은 할 일이 있어.\n미안. 다음에는 같이 가자.'},
      {text:'모모는 어디 가는지 묻는다.',playerLine:'모모 씨는 어디 가세요?',affinityKey:null,affinity:0,response:'나? 놀이공원.'}
    ]},
    {type:'relationshipResponse',screenType:'city',speaker:'모모',fallback:'응. 잘 다녀와.'},
    {type:'city',speaker:'주인공',text:'알겠습니다.\n그럼 다녀오겠습니다.'},
    {type:'city',speaker:'모모',text:'응. 조심해서 다녀와.'},
    {type:'city',text:'모모와 헤어진 뒤 다시 훈련장으로 향했다.'},
    {type:'black',text:'오늘도 훈련한다.\n조금이라도 더 강해지기 위해서.'},
    {type:'city',text:'잠시 후, 헌터지구의 훈련장이 눈앞에 들어왔다.'}
  ];
})();