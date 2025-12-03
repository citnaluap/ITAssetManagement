const XLSX = require('xlsx');

// Load both workbooks
const hubWb = XLSX.readFile('Tables/Employee Information Hub.xlsx');
const orgWb = XLSX.readFile('Tables/HUB and Org Chart 11-25.xlsx');

// Get the sheets
const hubSheet = hubWb.Sheets['Contact Details'];
const orgSheet = orgWb.Sheets[orgWb.SheetNames[0]];

// Convert to JSON
const hubData = XLSX.utils.sheet_to_json(hubSheet);
const orgData = XLSX.utils.sheet_to_json(orgSheet);

// Build supervisor lookup from Org Chart
const supervisorMap = {};
orgData.forEach(row => {
  const empId = String(row['Employee ID'] || '').trim();
  const supervisor = String(row['Supervisor'] || '').trim();
  const supervisorEmail = String(row["Supervisor's Email"] || '').trim();
  
  if (empId && (supervisor || supervisorEmail)) {
    supervisorMap[empId] = { supervisor, supervisorEmail };
  }
});

console.log('Built supervisor map with', Object.keys(supervisorMap).length, 'entries');

// Update Hub data
let updatedCount = 0;
hubData.forEach(row => {
  const empId = String(row['Employee ID'] || '').trim();
  const currentSupervisor = String(row['Supervisor'] || '').trim();
  
  if (empId && !currentSupervisor && supervisorMap[empId]) {
    row['Supervisor'] = supervisorMap[empId].supervisor;
    updatedCount++;
  }
});

console.log('Updated', updatedCount, 'employee records with supervisor information');

// Write back to Employee Information Hub
const newSheet = XLSX.utils.json_to_sheet(hubData);
hubWb.Sheets['Contact Details'] = newSheet;
XLSX.writeFile(hubWb, 'Tables/Employee Information Hub.xlsx');

console.log('Successfully saved updated Employee Information Hub.xlsx');
