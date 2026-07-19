(()=>{
  const STORAGE_KEY='mongyeong.save';
  const SAVE_SCHEMA_VERSION=1;
  const LOBBY_TILE_IDS=['guild','lodging','exterior','village'];

  const createDefaultSave=()=>({
    schemaVersion:SAVE_SCHEMA_VERSION,
    gameVersion:window.GAME_VERSION||'4.3',
    player:{
      name:'여행자',
      level:1,
      exp:0,
      stamina:200,
      maxStamina:200,
      credits:0,
      nightmareEssence:0
    },
    progress:{
      chapter:1,
      sceneId:null,
      sceneIndex:-1,
      completedChapters:[],
      unlockedLobbyTiles:[]
    },
    relationships:{
      haru:0,
      momo:0
    },
    flags:{},
    savedAt:null
  });

  const isPlainObject=value=>Boolean(value)&&typeof value==='object'&&!Array.isArray(value);
  const normalizeLobbyTiles=value=>{
    if(!Array.isArray(value))return [];
    return [...new Set(value.filter(tile=>LOBBY_TILE_IDS.includes(tile)))];
  };

  const normalizeSave=value=>{
    const defaults=createDefaultSave();
    if(!isPlainObject(value))return defaults;

    const progress=isPlainObject(value.progress)?value.progress:{};

    return {
      ...defaults,
      ...value,
      schemaVersion:SAVE_SCHEMA_VERSION,
      player:{...defaults.player,...(isPlainObject(value.player)?value.player:{})},
      progress:{
        ...defaults.progress,
        ...progress,
        completedChapters:Array.isArray(progress.completedChapters)?progress.completedChapters:[],
        unlockedLobbyTiles:normalizeLobbyTiles(progress.unlockedLobbyTiles)
      },
      relationships:{...defaults.relationships,...(isPlainObject(value.relationships)?value.relationships:{})},
      flags:isPlainObject(value.flags)?{...value.flags}:{}
    };
  };

  const readSave=()=>{
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      return raw?normalizeSave(JSON.parse(raw)):null;
    }catch(error){
      console.warn('[save] 저장 데이터를 읽지 못했습니다.',error);
      return null;
    }
  };

  const writeSave=value=>{
    try{
      const normalized=normalizeSave(value);
      normalized.gameVersion=window.GAME_VERSION||normalized.gameVersion;
      normalized.savedAt=new Date().toISOString();
      localStorage.setItem(STORAGE_KEY,JSON.stringify(normalized));
      return normalized;
    }catch(error){
      console.warn('[save] 자동저장에 실패했습니다.',error);
      return null;
    }
  };

  const unlockLobbyTile=tileId=>{
    if(!LOBBY_TILE_IDS.includes(tileId)){
      console.warn(`[save] 알 수 없는 로비 타일입니다: ${tileId}`);
      return readSave();
    }

    const current=readSave()||createDefaultSave();
    const unlocked=new Set(current.progress.unlockedLobbyTiles);
    unlocked.add(tileId);
    current.progress.unlockedLobbyTiles=[...unlocked];
    return writeSave(current);
  };

  const isLobbyTileUnlocked=tileId=>{
    const current=readSave();
    return Boolean(current?.progress.unlockedLobbyTiles.includes(tileId));
  };

  const getUnlockedLobbyTiles=()=>{
    const current=readSave();
    return current?[...current.progress.unlockedLobbyTiles]:[];
  };

  const clearSave=()=>{
    try{
      localStorage.removeItem(STORAGE_KEY);
      [
        'mongyeong.playerName',
        'mongyeong.level',
        'mongyeong.exp',
        'mongyeong.credits',
        'mongyeong.stamina',
        'mongyeong.maxStamina',
        'mongyeong.nightmareEssence',
        'mongyeong.haruAffinity',
        'mongyeong.momoAffinity'
      ].forEach(key=>localStorage.removeItem(key));
      return true;
    }catch(error){
      console.warn('[save] 저장 데이터를 초기화하지 못했습니다.',error);
      return false;
    }
  };

  window.MONGYEONG_SAVE={
    STORAGE_KEY,
    SAVE_SCHEMA_VERSION,
    LOBBY_TILE_IDS,
    createDefaultSave,
    normalizeSave,
    readSave,
    writeSave,
    unlockLobbyTile,
    isLobbyTileUnlocked,
    getUnlockedLobbyTiles,
    clearSave
  };
})();