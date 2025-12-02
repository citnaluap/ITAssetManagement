const fs=require('fs');const path=require('path');const XLSX=require('xlsx');
const assetWb=XLSX.readFile(path.join('Tables','Asset List 11-18-25.xlsx'),{cellDates:true});
const assetRows=XLSX.utils.sheet_to_json(assetWb.Sheets[assetWb.SheetNames[0]],{defval:'',raw:false});
console.log('rows', assetRows.length);
console.log(assetRows[0]);
