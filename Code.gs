/**
 * Form Edit Links: put each Google Form response's edit link into the response sheet, so you (or
 * the person who answered) can change an answer later.
 *
 * Setup: open the spreadsheet your form sends responses to, paste this file into Extensions →
 * Apps Script, reload, and choose ✏️ Edit Links → Turn On. Existing rows get links right away,
 * new responses get one as they arrive. Send them with any mail merge: {{Edit Link}}.
 * For respondents to use their link, turn on the form's Settings → Responses → Allow response editing.
 */

const LINK_COL = 'Edit Link';

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('✏️ Edit Links')
    .addItem('Turn On', 'turnOn')
    .addItem('Fill Missing Links Now', 'fillMenu')
    .addItem('Turn Off', 'turnOff')
    .addToUi();
}

function turnOn() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss.getFormUrl() && !responseSheet_()) {
    SpreadsheetApp.getUi().alert('This spreadsheet isn\'t linked to a form. In the form: Responses → Link to Sheets, then open that sheet.');
    return;
  }
  turnOff_();
  ScriptApp.newTrigger('onResponse').forSpreadsheet(ss).onFormSubmit().create();
  fillMenu();
}

function turnOff() {
  turnOff_();
  SpreadsheetApp.getUi().alert('New responses won\'t get edit links. Existing links still work.');
}

function fillMenu() {
  const n = fill_(null);
  SpreadsheetApp.getUi().alert(n + ' edit link(s) added. New responses get one automatically.');
}

/** Form submit trigger: only look at the last few minutes of responses. */
function onResponse(e) {
  fill_(new Date(Date.now() - 10 * 60 * 1000), e && e.range && e.range.getSheet());
}

/** Write edit links for rows that don't have one. `since` limits which form responses are read. */
function fill_(since, sheet) {
  sheet = sheet || responseSheet_();
  if (!sheet) return 0;
  const form = FormApp.openByUrl(sheet.getFormUrl());
  const responses = (since ? form.getResponses(since) : form.getResponses())
    .map(r => ({ ts: r.getTimestamp().getTime(), url: r.getEditResponseUrl() }));

  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => String(h).trim());
  let col = headers.indexOf(LINK_COL);
  if (col === -1) {
    col = headers.length;
    sheet.getRange(1, col + 1).setValue(LINK_COL);
  }
  const rows = data.slice(1);
  const links = matchLinks_(rows.map(r => r[0]), responses, rows.map(r => r[col] || ''));
  const added = links.filter((l, i) => l && !rows[i][col]).length;
  if (rows.length) sheet.getRange(2, col + 1, rows.length, 1).setValues(links.map(l => [l]));
  return added;
}

/**
 * Pair sheet rows with form responses by timestamp. The sheet's Timestamp column (column A)
 * is rounded to the second, so match within one second. Rows keep any link they already have.
 * ponytail: two responses in the same second may swap links; add a hidden ID question if that matters.
 */
function matchLinks_(timestamps, responses, existing) {
  const bySecond = new Map();
  responses.forEach(r => bySecond.set(Math.floor(r.ts / 1000), r.url));
  return timestamps.map((t, i) => {
    if (existing[i]) return existing[i];
    if (Object.prototype.toString.call(t) !== '[object Date]') return '';
    const s = Math.floor(t.getTime() / 1000);
    return bySecond.get(s) || bySecond.get(s - 1) || bySecond.get(s + 1) || '';
  });
}

/** The tab the form writes to (spreadsheets can hold several forms; the active one wins). */
function responseSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const active = ss.getActiveSheet();
  if (active && active.getFormUrl()) return active;
  return ss.getSheets().find(s => s.getFormUrl()) || null;
}

function turnOff_() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'onResponse')
    .forEach(t => ScriptApp.deleteTrigger(t));
}
