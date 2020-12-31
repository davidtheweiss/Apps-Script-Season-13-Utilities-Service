function setUpTrigger() {
  ScriptApp.newTrigger('createCustomMenuBar')
  .forDocument('1kNj-H0fac1vguSnhxrYpCzvN7KUJ1sAACqBScvS7G1k')
  .onOpen()
  .create();
}

function createCustomMenuBar() {
  DocumentApp.getUi().createMenu('Custom Functions').addItem('Generate Name Signs', 'showNameSignSidebar').addToUi();
}

function showNameSignSidebar() {
  const userInterface = HtmlService.createHtmlOutputFromFile('name_signs').setTitle('Generate Name Signs');
  DocumentApp.getUi().showSidebar(userInterface);
}

function generateNameSigns(csv) {
  
  let parsedCSV = Utilities.parseCsv(csv);
  const candidateCount = parsedCSV.length;
  
  const documentTemplate = DocumentApp.openById('1d8PoxMazHyPbkHHZtEYsxr-hP4HV-YnArS_qbBG4aXA');
  const document = DocumentApp.openById('1kNj-H0fac1vguSnhxrYpCzvN7KUJ1sAACqBScvS7G1k');
  const templateBody = documentTemplate.getBody();
  const body = document.getBody();
  
  for (let i = 1; i < candidateCount; i++) {
    const totalElements = templateBody.getNumChildren();
    
    for(let j = 0; j < totalElements; j++) {
      let element = templateBody.getChild(j).copy();
      let type = element.getType();
      if (type == DocumentApp.ElementType.PARAGRAPH) body.appendParagraph(element);
      else console.log(`Item Type ${type} is not a paragraph and could not be appended`);
    }
    
    let interview_time = Utilities.formatDate(new Date(parsedCSV[i][2]), 'EST', 'h:mm a');
    body.replaceText('%first_name%', parsedCSV[i][0].split(" ")[0]);
    body.replaceText('%last_name%', parsedCSV[i][0].split(" ")[1]);
    body.replaceText('%interview_time%', interview_time);
    body.replaceText('%interviewer%', parsedCSV[i][3]);
    body.appendPageBreak();
  }
}

function formatDollarAmount() {
  let spent_today = 45;
  let account_balance = 6243.895;

  let user_message = 'Today you spent $%.2f. Your Current Account Balance is $%.2f';
  Logger.log(Utilities.formatString(user_message, spent_today, account_balance));
}




