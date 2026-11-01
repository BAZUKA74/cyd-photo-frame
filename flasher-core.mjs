export function imageHeader(bytes, offset=0) {
  if(bytes.length < offset+24 || bytes[offset]!==0xe9) throw Error('Не найден заголовок прошивки ESP32. Проверь выбранный BIN.');
  const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  if(v.getUint16(offset+12,true)!==0) throw Error('Этот образ предназначен для другого семейства ESP32.');
  if(bytes[offset+1]<1 || bytes[offset+1]>16) throw Error('Повреждён заголовок образа.');
}
export function compatiblePartition(bytes) {
  const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);let app=false,fs=false;
  for(let o=0;o+32<=bytes.length;o+=32){
    if(v.getUint16(o,true)!==0x50aa) break;
    const type=bytes[o+2],offset=v.getUint32(o+4,true),size=v.getUint32(o+8,true);
    if(type===0 && bytes[o+3]===0 && offset===0x10000 && size===0x180000) app=true;
    if(type===1 && bytes[o+3]===0x82 && offset===0x190000 && size===0x270000) fs=true;
  }
  if(!app||!fs) throw Error('Разметка памяти отличается от CYD PhotoFrame. Обновление остановлено до записи. Используй полный образ для первоначальной установки.');
}
export function validateImage(bytes,full=false){
  if(full){
    if(bytes.length<0x10000+24 || bytes.length>0x400000) throw Error('Полный образ должен содержать загрузчик, разделы и приложение, не более 4 МБ.');
    imageHeader(bytes,0x1000);compatiblePartition(bytes.subarray(0x8000,0x9000));imageHeader(bytes,0x10000);
  }else{
    if(bytes.length>0x180000) throw Error('Программа не помещается в раздел приложения.');
    imageHeader(bytes);
  }
}
