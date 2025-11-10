// Apps Script: POST (append) and GET (admin export) for Elevate Byte
const SPREADSHEET_ID = 'PUT_YOUR_SPREADSHEET_ID_HERE'; // <<< REPLACE
const ADMIN_SECRET = ''; // optional: set a secret and include it as ?secret=XYZ for admin reads

function doPost(e){
  try{
    const jsonString = e.postData && e.postData.contents ? e.postData.contents : null;
    if(!jsonString) return ContentService.createTextOutput(JSON.stringify({success:false,error:'No postData'})).setMimeType(ContentService.MimeType.JSON);
    const data = JSON.parse(jsonString);
    const sheetName = data.sheet || '';
    if(!sheetName) return ContentService.createTextOutput(JSON.stringify({success:false,error:'No sheet specified'})).setMimeType(ContentService.MimeType.JSON);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);
    if(!sheet) return ContentService.createTextOutput(JSON.stringify({success:false,error:'Sheet not found: '+sheetName})).setMimeType(ContentService.MimeType.JSON);
    const ts = new Date();
    if(sheetName === 'Candidates'){
      sheet.appendRow([ts, data.name||'', data.email||'', data.phone||'', data.skills||'', data.experience||'', data.resumeUrl||'', data.notes||'']);
    } else if(sheetName === 'Clients'){
      sheet.appendRow([ts, data.company||'', data.contactName||'', data.email||'', data.phone||'', data.service||'', data.message||'']);
    } else {
      let raw = ss.getSheetByName('Raw'); if(!raw) raw = ss.insertSheet('Raw');
      raw.appendRow([ts, JSON.stringify(data)]);
    }
    return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({success:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e){
  try{
    const params = e.parameter || {};
    const isAdmin = params.admin === 'true';
    const secret = params.secret || '';
    if(!isAdmin) return ContentService.createTextOutput(JSON.stringify({error:'Use POST to submit data'})).setMimeType(ContentService.MimeType.JSON);
    if(ADMIN_SECRET && ADMIN_SECRET !== '' && secret !== ADMIN_SECRET){
      return ContentService.createTextOutput(JSON.stringify({error:'Invalid secret'})).setMimeType(ContentService.MimeType.JSON);
    }
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheets = ['Candidates','Clients'];
    let output = [];
    sheets.forEach(name=>{
      const sheet = ss.getSheetByName(name);
      if(!sheet) return;
      const data = sheet.getDataRange().getValues(); // includes header row
      const csv = data.map(r=>r.map(c=>String(c).replace(/"/g,'""')).map(c=>`"${c}"`).join(',')).join('\n');
      output.push('Sheet:'+name+'\n'+csv);
    });
    const body = output.join('\n--SHEET--\n');
    return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.TEXT);
  }catch(err){
    return ContentService.createTextOutput(JSON.stringify({error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
