const spreadsheet = SpreadsheetApp.openById('1I3m0I4coisD6XZhOClreHFI7O0Gtzfsn8N1Fl85xn6g');
const sheet = spreadsheet.getSheetByName('credentials');

function doGet() {
  return HtmlService.createTemplateFromFile('secureLogin').evaluate().setTitle('Schedule an Appt with David');
}

function register(email, password) {
  let sha256 = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  let encryptedPassword = Utilities.base64Encode(sha256);
  sheet.appendRow([email, encryptedPassword]);
}

function signIn(email, password) {
  let data = sheet.getDataRange().getValues();
  let sha256 = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password);
  let encryptedPassword = Utilities.base64Encode(sha256);
  if (data.some((el) => el[0] == email && el[1] == encryptedPassword)) {
    return email
  } else {
    throw Error
  }
}

function createAppt(apptDate, email) {
  let startTime = new Date(apptDate);
  let url = createZoomMeeting(startTime);
  CalendarApp.createEvent(`Appt with ${email}`, startTime, new Date(startTime.getTime() + 30*60000), {
    description: `Zoom Link: ${url}`,
    guests: email,
  });
}

function getZoomAccessToken() {
  const API_KEY = 'axktfvAFRsyA5XuilosL0Q';
  const API_SECRET = 'etyzTet0L9xMgA2pBvIlsI3K58dzngJk8v2K';

  const header = JSON.stringify({
    alg: 'HS256',
    typ: 'JWT',
  });

  const payload = JSON.stringify({
    iss: API_KEY,
    exp: Date.now() + 3600,
  });

  const signature = Utilities.computeHmacSha256Signature(
    Utilities.base64EncodeWebSafe(header) + "." +
    Utilities.base64EncodeWebSafe(payload),
    API_SECRET
  );

  return `${Utilities.base64EncodeWebSafe(header)}.${Utilities.base64EncodeWebSafe(payload)}.${Utilities.base64EncodeWebSafe(signature)}`;
};

function getZoomUserId() {
  const accessToken = getZoomAccessToken();

  const response = UrlFetchApp.fetch('https://api.zoom.us/v2/users/', {
    method: 'GET',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = (JSON.parse(response.getContentText()));

  return json['users'][0]['id'];
};

function createZoomMeeting(startDate) {
  const datestring = `${startDate.getDate().toString().padStart(2, '0')}-${(startDate.getMonth()+1).toString().padStart(2, '0')}-${startDate.getFullYear()}T${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}:00`;
  const meetingOptions = {
    topic: 'Chat with David',
    type: 1,
    start_time: datestring,
    duration: 30,
    timezone: 'America/New_York',
    agenda: 'Discuss your Apps Script Project',
    settings: {
      auto_recording: 'none',
      mute_upon_entry: true,
      join_before_host: true,
      jbh_time: 0,
    },
  };

  const request = UrlFetchApp.fetch(`https://api.zoom.us/v2/users/${getZoomUserId()}/meetings`, {
    method: 'POST',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${getZoomAccessToken()}` },
    payload: JSON.stringify(meetingOptions),
  });
  const { join_url} = JSON.parse(request.getContentText());
  
  return join_url;
};

function includeExternalFile(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
