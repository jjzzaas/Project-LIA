(()=>{
  if(!window.CHAPTER_4)return;
  window.CHAPTER_4.push(
    {type:'city',text:'훈련이 모두 끝났을 때, 나와 모모는 바닥에 주저앉아 숨을 몰아쉬고 있었다.\n손끝 하나 움직이기 힘들 만큼 온몸에 힘이 빠져 있었다.'},
    {type:'city',speaker:'하루',text:'오늘 훈련은 여기까지입니다.'},
    {type:'city',text:'하루는 기진맥진한 우리를 잠시 바라본 뒤, 조금 누그러진 목소리로 말을 이었다.'},
    {type:'city',speaker:'하루',text:'강해지는 데는 그만큼의 노력이 필요해요.\n한 번에 달라지지는 않겠지만, 오늘처럼 계속해 나가면 분명 달라질 수 있습니다.'},
    {type:'city',speaker:'하루',text:'저는 내일부터 다시 임무를 나가야 해요.\n두 분은 오늘 배운 걸 잊지 않도록 개인 훈련을 계속하세요.'},
    {type:'relationshipChoice',screenType:'city',speaker:'하루',text:'떠나기 전, 하루에게 어떤 말을 건넬까?',affinityKey:'haruAffinity',choices:[
      {text:'오늘 정말 감사했습니다.',affinity:2,response:'……별말씀을요.\n두 분이 포기하지 않았으니 가능한 일이었어요.'},
      {text:'내일부터도 꾸준히 해볼게요.',affinity:1,response:'네. 무리하지 말고, 오늘 배운 것부터 차근차근 익히세요.'},
      {text:'생각보다 너무 힘들었어.',affinity:-1,response:'그만큼 지금 부족하다는 뜻이겠죠.\n그래도 끝까지 해낸 건 잘하셨어요.'}
    ]},
    {type:'relationshipResponse',screenType:'city',speaker:'하루',fallback:'수고하셨어요. 오늘은 푹 쉬세요.'},
    {type:'city',text:'하루는 짧게 고개를 끄덕인 뒤 훈련장을 떠났다.\n넓어진 훈련장에는 나와 모모만 남았다.'},
    {type:'city',speaker:'모모',text:'……오늘도 결국 졌네.'},
    {type:'city',text:'모모는 힘없이 웃었지만, 외곽에서 보았던 주눅 든 표정과는 조금 달랐다.'},
    {type:'relationshipChoice',screenType:'city',speaker:'모모',text:'모모에게 어떤 말을 건넬까?',affinityKey:'momoAffinity',choices:[
      {text:'같이 두려움을 극복하고 강해지자.',affinity:2,response:'……같이?\n응. 혼자가 아니라면, 조금은 해볼 수 있을 것 같아.'},
      {text:'오늘은 아까보다 훨씬 나았어.',affinity:1,response:'정말……?\n나도 조금은 달라진 걸까.'},
      {text:'다음에는 더 오래 버텨야 해.',affinity:-1,response:'……알아.\n다음에는 더 노력할게.'}
    ]},
    {type:'relationshipResponse',screenType:'city',speaker:'모모',fallback:'……응. 다음에는 더 잘해볼게.'},
    {type:'city',text:'모모는 먼저 숙소로 돌아가겠다며 훈련장을 나섰다.\n나 역시 무거운 몸을 이끌고 뒤늦게 숙소로 향했다.'},
    {type:'lodging',text:'숙소에 돌아오자 긴장이 풀리며 온몸의 피로가 한꺼번에 밀려왔다.\n침대에 몸을 눕히자 오늘 하루가 천천히 머릿속을 스쳐 지나갔다.'},
    {type:'black',text:'맨손으로 시작한 훈련.\n처음 손에 쥔 한 자루의 검.\n그리고 두려움 속에서도 끝까지 싸운 모모.\n\n아직 갈 길은 멀었지만, 우리는 분명 어제보다 조금 강해져 있었다.'},
    {type:'chapter',clear:true,chapter:4,title:'첫 번째 성장'},
    {type:'levelup',from:4,to:5}
  );
})();
