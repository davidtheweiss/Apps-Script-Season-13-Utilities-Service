function doGet() {
  return HtmlService.createTemplateFromFile('textspeechconverter.html').evaluate();
}

function includeExternalFile(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function speechToText(bytes) {

  const base64 = Utilities.base64Encode(bytes);
  const data = {
    'config': {
      'languageCode': 'en-US',
      'audio_channel_count': 2,
    },
    'audio': {
      'content': base64,
    }
  }

  const params = {
    'method' : 'post',
    'headers': { 
      "Content-Type": "application/json",
    },
    'payload' : JSON.stringify(data),
  };

  const res = UrlFetchApp.fetch('https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyBA6qflEf5lgVEyH55KXVDwiNP05W7aZjk', params);
  return JSON.parse(res.getContentText())['results'][0]['alternatives'][0]['transcript'];
}

function textToSpeech(text) {
  const data = {
    "input": {
      'text': text,
    },
    "voice": {
      'languageCode': 'en-US',
      'name': 'en-US-Standard-H',
    },
    "audioConfig": {
      'audioEncoding': 'MP3',
    }
  }

  const params = {
    'method' : 'post',
    'headers': { 
      "Content-Type": "application/json",
    },
    'payload' : JSON.stringify(data),
  };

  const res = UrlFetchApp.fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyBA6qflEf5lgVEyH55KXVDwiNP05W7aZjk', params);
  return Utilities.base64Decode(JSON.parse(res.getContentText())['audioContent']);
}


function base64Demo() {
  // Logger.log(Utilities.base64Encode('Base64 makes data transfer over the web so much easier!', Utilities.Charset.UTF_8));
  
  Logger.log(Utilities.base64EncodeWebSafe('texts?_t=1a~'));
  Logger.log(Utilities.base64Encode('texts?_t=1a~'));
  Logger.log(Utilities.newBlob(Utilities.base64DecodeWebSafe('dGV4dHM_X3Q9MWF-')).getDataAsString());
  Logger.log(Utilities.newBlob(Utilities.base64Decode('dGV4dHM/X3Q9MWF+')).getDataAsString());
}


