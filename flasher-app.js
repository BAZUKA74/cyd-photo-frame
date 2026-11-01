import {validateImage,compatiblePartition} from './flasher-core.mjs';
const $=id=>document.getElementById(id);
let loader,transport,busy=false,ready=false,api;
const status=s=>$('status').textContent=s;
const log=s=>{ $('log').textContent=($('log').textContent+s).slice(-24000);$('log').scrollTop=$('log').scrollHeight; };
function controls(){
  $('connect').disabled=busy||ready||!api||!navigator.serial||!isSecureContext;
  $('connect').hidden=ready;$('disconnect').hidden=!ready;$('disconnect').disabled=busy;
  $('mode').disabled=busy;$('file').disabled=busy;$('board').disabled=busy;$('erase').disabled=busy;
  $('flash').disabled=busy||!ready||!$('board').checked||($('mode').value==='full'&&(!$('file').files.length||!$('erase').checked));
}
async function release(){
  ready=false;loader=undefined;
  const t=transport;transport=undefined;
  try{if(t)await t.disconnect();}catch(e){log('\nЗакрытие порта: '+e.message+'\n');}
  $('connection').textContent='Не подключено';controls();
}
function failure(e){status(e.name==='NotFoundError'?'Выбор USB-порта отменён.':`Ошибка: ${e.message}. Подробности и подсказки — ниже.`);log('\n'+String(e)+'\n');}
$('connect').onclick=async()=>{
  busy=true;controls();status('Выбери USB-порт платы…');
  try{
    const port=await navigator.serial.requestPort();
    transport=new api.Transport(port,false);
    loader=new api.ESPLoader({transport,baudrate:115200,terminal:{clean:()=>$('log').textContent='',write:log,writeLine:s=>log(s+'\n')}});
    status('Подключение к ESP32. При необходимости удерживай BOOT…');
    await loader.main();
    if(loader.chip.CHIP_NAME!=='ESP32') throw Error('Поддерживается только обычный ESP32, не S2/S3/C3. Запись не началась');
    const id=await loader.readFlashId();const capacity=(id>>>16)&255;
    if(capacity!==22) throw Error('Нужна плата с Flash ровно 4 МБ. Запись не началась');
    ready=true;$('connection').textContent='ESP32 · 4 МБ · подключено';status('Плата подключена. Проверь модель и выбери режим.');
  }catch(e){failure(e);await release();}
  finally{busy=false;controls();}
};
$('disconnect').onclick=async()=>{busy=true;controls();try{await loader.after('hard_reset');}catch{}await release();busy=false;controls();status('Плата отключена.');};
$('mode').onchange=()=>{
 const full=$('mode').value==='full';$('full-options').hidden=!full;
 $('mode-note').textContent=full?'Полная установка сотрёт всю Flash. Выбирай только полный образ, собранный для твоей HW-458.':'Для платы с уже установленной CYD PhotoFrame и совместимой разметкой памяти. Записывается только программа.';
 $('flash').textContent=full?'Стереть данные и установить BIN':'Записать стабильную прошивку';controls();
};
for(const id of ['board','erase','file'])$(id).onchange=controls;
async function fetchOK(path){const r=await fetch(path);if(!r.ok)throw Error('Не удалось загрузить '+path);return r;}
$('flash').onclick=async()=>{
 if($('flash').disabled)return;
 const full=$('mode').value==='full';busy=true;controls();$('progress').value=0;
 try{
   status('Проверка образа…');
   let bytes;
   if(full)bytes=new Uint8Array(await $('file').files[0].arrayBuffer());
   else{
     const meta=await (await fetchOK('flasher-metadata.json')).json();
     bytes=new Uint8Array(await (await fetchOK('CYD-HW458-STABLE.bin')).arrayBuffer());
     const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
     if(bytes.length!==meta.size||hash!==meta.sha256)throw Error('Контрольная сумма прошивки не совпала');
   }
   validateImage(bytes,full);
   if(!full){status('Проверка разметки платы…');compatiblePartition(await loader.readFlash(0x8000,0x1000));}
   status(full?'Установка полного образа. Не отключай USB.':'Запись программы. Не отключай USB. Фото и настройки не стираются.');
   await loader.writeFlash({fileArray:[{data:bytes,address:full?0:0x10000}],flashSize:'keep',flashMode:'keep',flashFreq:'keep',eraseAll:full,compress:true,
     calculateMD5Hash:data=>SparkMD5.ArrayBuffer.hash(data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength)),
     reportProgress:(index,written,total)=>{$('progress').value=written/total*100;status(`Запись: ${Math.round(written/total*100)}%. Не отключай USB.`);}});
   $('progress').value=100;
   // Reset failure after verified write must not be reported as failed flashing.
   try{await loader.after('hard_reset');status('Готово! Запись проверена. Плата перезапущена. Подключись к CYD-PhotoFrame.');}
   catch(e){status('Запись проверена. Нажми RESET на плате для запуска.');log('\n'+e.message+'\n');}
 }catch(e){failure(e);}
 finally{await release();busy=false;controls();}
};
window.addEventListener('beforeunload',e=>{if(busy){e.preventDefault();e.returnValue='';}});
if(!isSecureContext)$('support').textContent='Для USB нужен HTTPS или localhost. Открой опубликованную страницу.';
else if(!navigator.serial)$('support').textContent='В этом браузере недоступен USB Serial. Открой ссылку отдельно в Chrome или Edge на компьютере.';
try{api=await import('./flasher-esptool.js');controls();}catch(e){$('support').textContent='Не удалось загрузить библиотеку прошивки. Обнови страницу.';failure(e);}
