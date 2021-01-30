function documentInterview() {
  const threads = GmailApp.getChatThreads();
  let transcript = '';
  for (let thread of threads) {
    let messages = thread.getMessages().filter(message => message.getFrom() != 'David Weiss <davidtheweiss7@gmail.com>');
    let candidate = messages[0].getFrom();
    let interviewDate = thread.getLastMessageDate().toLocaleDateString();

    for (let message of messages) {
      transcript += `${message.getBody()} `;
    }

    let blob = Utilities.newBlob(
      transcript,
      MimeType.PLAIN_TEXT,
      `Interview_Transcript_For_Candidate_${candidate}.txt`
    );

    let interviewTranscriptsFolder = DriveApp.getFoldersByName('HR').next().getFoldersByName('Interview Transcripts').next();
    
    if(interviewTranscriptsFolder.getFoldersByName(interviewDate).hasNext()) {
      interviewTranscriptsFolder.getFoldersByName(interviewDate).next().createFile(Utilities.gzip(blob,`Interview_Transcript_For_Candidate_${candidate}.gz`));
    } else {
      interviewTranscriptsFolder.createFolder(interviewDate).createFile(Utilities.gzip(blob,`Interview_Transcript_For_Candidate_${candidate}.gz`));
    }

    transcript = '';
    // thread.moveToTrash();
  }
}

function processSentiment() {

  // Please use format "m/d/yyyy"
  let interviewDate = '1/27/2021';

  let files = DriveApp.getFoldersByName('HR').next().getFoldersByName('Interview Transcripts').next().getFoldersByName(interviewDate).next().getFiles();
  let results = [];

  while (files.hasNext()) {
    let file = Utilities.ungzip(files.next());
    let file_name = file.getName();
    let transcript = file.getDataAsString();

    const data = {
      "document": {
        "type": 'PLAIN_TEXT',
        "language": 'en',
        "content": transcript,
      },
      "encodingType": 'UTF8',
    }

  const params = {
    'method' : 'post',
    'headers': { 
      "Content-Type": "application/json"
    },
    'payload' : JSON.stringify(data),
  };
  let fetch = UrlFetchApp.fetch(`https://language.googleapis.com/v1beta2/documents:analyzeSentiment?key=AIzaSyCW5rSqtyZZISreUe-AWvh9YIEA7HntcYM`, params);
  // Logger.log(fetch.getContentText());

  results.push(Utilities.newBlob(fetch.getContentText(), MimeType.JSON, `RESULTS: ${file_name}`));
  }

  DriveApp.getFoldersByName('HR').next().getFoldersByName('Sentiment Analysis Results').next().createFile(Utilities.zip(results, interviewDate));
}

function logSentiments() {

  // Please use format "m/d/yyyy"
  let interviewDate = '1/27/2021';

  const zipfile = DriveApp.getFoldersByName('HR').next().getFoldersByName('Sentiment Analysis Results').next().getFilesByName(interviewDate);

  let files = Utilities.unzip(zipfile.next());
  for (let file of files) {
    Logger.log(file.getDataAsString());
  }
}

