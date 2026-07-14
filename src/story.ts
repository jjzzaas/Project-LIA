export type Scene={kind:'black'|'forest'|'battle'|'status'|'city'|'lobby';speaker?:string;text:string;choices?:string[]};
export const scenes:Scene[]=[
{kind:'black',text:'……여기는 어디지?'},{kind:'black',text:'아니.\n그보다 먼저—'},{kind:'black',text:'나는 누구지?'},
{kind:'forest',text:'눈을 뜨자, 푸른빛이 나뭇잎 사이로 흘러내렸다.\n흙과 바람, 젖은 나무 냄새까지 지나치게 선명했다.'},
{kind:'forest',text:'기억은 비어 있었다.\n그런데 몸은 이곳을 알고 있는 듯 자연스럽게 일어섰다.'},
{kind:'forest',text:'같은 나무를 두 번 지나친 것 같았다.\n처음부터 길 같은 건 없었던 걸까.'},
{kind:'battle',text:'나뭇가지가 부러졌다.\n검은 형체가 안개 사이에서 몸을 일으켰다.'},
{kind:'battle',text:'손을 뻗는 순간, 푸른 입자가 모여 검의 형태를 이루었다.\n생각할 틈도 없이 몸이 먼저 움직였다.'},
{kind:'status',text:'LEVEL UP\nLv. 1 → Lv. 2\n정신 에너지 상승\n신체 능력 상승\n새로운 구현 가능성 감지\n\n흡수 완료.'},
{kind:'forest',text:'승리의 감각은 짧았다.\n더 짙고 거대한 그림자가 숲을 찢으며 나타났다.'},
{kind:'battle',text:'검이 튕겨 나갔다.\n차가운 발톱이 눈앞까지 다가온 순간— 푸른 섬광이 어둠을 갈랐다.'},
{kind:'forest',speaker:'하루',text:'움직일 수 있어요?'},
{kind:'forest',speaker:'하루',text:'……다친 곳은요?'},
{kind:'forest',text:'내민 손을 잡고 일어서는 순간 다리에 힘이 풀렸다.\n그녀가 반사적으로 나를 받아냈다. 머리카락이 뺨을 스치고 숨결이 가까워졌다.'},
{kind:'forest',speaker:'하루',text:'……괜찮아 보이진 않네요.'},
{kind:'forest',speaker:'하루',text:'혼자예요?',choices:['아마도.','기억이 없어.','당신은 누구지?']},
{kind:'forest',speaker:'하루',text:'그럼 여기 혼자 있으면 안 돼요.\n중앙도시까지 같이 가요.'},
{kind:'black',text:'아무것도 기억하지 못한다.\n그런데 이상하게도, 그녀의 뒤를 따라가는 일만은 낯설지 않았다.'},
{kind:'city',text:'숲의 끝에서 빛이 터졌다.\n안개 너머, 처음 보는 중앙도시가 오래전부터 나를 기다린 듯 서 있었다.'},
{kind:'city',speaker:'하루',text:'왜 그래요? 가요.\n혼자 두진 않을 테니까.'},
{kind:'lobby',text:'중앙도시 메인 로비가 해금되었습니다.\n튜토리얼 완료.'}
];