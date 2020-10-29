const urlBase = "http://localhost:8000";

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
  const composeForm = document.querySelector('#compose-form');
  const recipients = document.querySelector('#compose-recipients');
  const subject = document.querySelector('#compose-subject');
  const composeBody = document.querySelector('#compose-body');
    
  
  // Show compose view and hide other views
  hideEmailMessage();
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  

  function clearForm(){
    // Clear out composition fields
    recipients.value = '';
    subject.value = '';
    composeBody.value = '';
  }
  composeForm.onsubmit = function() {
    const mail = createMailData(
      recipients.value,
      subject.value,
      composeBody.value
    );
    
    sendEmail(mail);
    clearForm();
    return false;
  }
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  hideEmailMessage();

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  load_mails(mailbox);
}

function createMailData(recipients, subject, body){
  mail = {
    recipients: recipients,
    subject: subject,
    body: body
  }
  return mail;
}

function sendEmail(mail){
  const sendURL = `${urlBase}/emails`;
  fetch(sendURL, {
    method: 'POST',
    body: JSON.stringify(mail)
  })
  .then(response => response.json())
  .then(result => {
    if (result.error){
      showEmailSentError(result.error);
      displayEmailMessage();
    } else {
      if (result.message === 'Email sent successfully.'){
        showEmailSentOk();
        displayEmailMessage();
        load_mailbox('sent');
      }
    }
  });
}

function load_mails(page){
  const typeMails = {
    inbox() {
      load_inbox_mails();
    },
    sent() {
      load_sent_mails();
    },
    archive() {
      load_archived_mails();
    }
  }

  const load = typeMails[page];
  if (load){
    load();
  }
}

function load_inbox_mails(){
  const inboxURL = `${urlBase}/emails/inbox`;
  fetch(inboxURL)
  .then(response => response.json())
  .then(emails => {
    createInboxDivMails(emails);
  });
}

function load_sent_mails(){
  const sentURL = `${urlBase}/emails/sent`;
  fetch(sentURL)
  .then(response => response.json())
  .then(emails => {
    createSentDivMails(emails);
  });  
}

function load_archived_mails(){
  const archiveURL = `${urlBase}/emails/archive`;
  fetch(archiveURL)
  .then(response => response.json())
  .then(emails => {
    createInboxDivMails(emails);
  });  
}

function createInboxDivMails(emails){
  const mailsDiv = document.querySelector('#emails-view');
  emails.forEach(mail =>{
    const mailDiv = document.createElement('div');
    const senderElement = document.createElement('div');
    const subjectData = document.createElement('div');
    const timestamp = document.createElement('div');

    senderElement.innerText = mail.sender;
    subjectData.innerText = mail.subject;
    timestamp.innerText = mail.timestamp;

    senderElement.classList.add('sender');
    timestamp.classList.add('timestamp');
    subjectData.classList.add('subject');

    mailDiv.append(senderElement);
    mailDiv.append(subjectData);
    mailDiv.append(timestamp);
    if (mail.read){
      mailDiv.classList.add('read');
    }    

    mailDiv.classList.add('email-inbox');
    mailDiv.addEventListener('click', function() {
      if (!mail.read){
        markEmailAsRead(mail);
      }
      showEmailDetails();
      getEmail(mail, false);
    });
    mailsDiv.append(mailDiv);
  });
}

function createSentDivMails(emails){
  const mailsDiv = document.querySelector('#emails-view');
  emails.forEach(mail =>{
    const mailDiv = document.createElement('div');
    const recipients = document.createElement('div');
    const subjectData = document.createElement('div');
    const timestamp = document.createElement('div');

    recipients.innerText = mail.recipients.join();
    subjectData.innerText = mail.subject;
    timestamp.innerText = mail.timestamp;

    recipients.classList.add('recipients');
    timestamp.classList.add('timestamp');
    subjectData.classList.add('subject');

    mailDiv.append(recipients);
    mailDiv.append(subjectData);
    mailDiv.append(timestamp);
   

    mailDiv.classList.add('email-inbox');
    mailDiv.addEventListener('click', function() {
      showEmailDetails();
      getEmail(mail, true);
    });
    mailsDiv.append(mailDiv);
  });  
}


function getEmail(mail, fromSent){
  const mailURL = `${urlBase}/emails/${mail.id}`;
  fetch(mailURL)
  .then(response => response.json())
  .then(email => {
    createEmailViewDiv(email, fromSent);
  }); 
}

function showEmailDetails(){
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
}

function createEmailViewDiv(mail, fromSent){
  const mailDiv = document.querySelector('#email-view');
  mailDiv.innerHTML = "";
  

  const from = document.createElement('div');
  const to = document.createElement('div');
  const subject = document.createElement('div');
  const timestamp = document.createElement('div');
  const replyButton = document.createElement('button');
  const bodyCompose = document.createElement('div');

  
  from.innerHTML = `<strong>From:</strong> ${mail.sender}`;
  to.innerHTML = `<strong>To:</strong> ${mail.recipients.join()}`;
  subject.innerHTML = `<strong>Subject:</strong> ${mail.subject}`;
  timestamp.innerHTML = `<strong>Timestamp:</strong> ${mail.timestamp}`;
  bodyCompose.innerHTML = mail.body;

  replyButton.innerText = "Reply";
  replyButton.classList.add("btn", "btn-sm", "btn-outline-primary");
  replyButton.addEventListener('click', function() {
    showComposeReply(mail);
  });

  mailDiv.append(from);
  mailDiv.append(to);
  mailDiv.append(subject);
  mailDiv.append(timestamp);
  mailDiv.append(replyButton);
  mailDiv.append(document.createElement('hr'))
  mailDiv.append(bodyCompose);
  mailDiv.append(document.createElement('hr'))

  if (!fromSent){
    
    const archiveDiv = document.createElement('div');
    const archiveButton = document.createElement('button');
    archiveDiv.classList.add('archiveDiv')
    
    if(mail.archived){
      archiveButton.classList.add("btn", "btn-primary");
      archiveButton.innerText = "Unarchive";
      archiveButton.addEventListener('click', function() {
        markEmailAsArchived(mail, false);
      });
    } else {
      archiveButton.classList.add("btn", "btn-danger");
      archiveButton.innerText = "Archive";
      archiveButton.addEventListener('click', function() {
        markEmailAsArchived(mail, true);
      });
    }
    archiveDiv.append(archiveButton);
    mailDiv.append(archiveDiv);
  }  
}

function showComposeReply(mail){
  compose_email();
  const recipients = document.querySelector('#compose-recipients');
  const subject = document.querySelector('#compose-subject');
  const composeBody = document.querySelector('#compose-body');
 
  recipients.value = mail.sender;

  if (!mail.subject.includes('Re:')){
    subject.value = `Re: ${mail.subject}`;
  } else{
    subject.value = mail.subject;
  }
  composeBody.value = `"On ${mail.timestamp} ${mail.sender} wrote:" ${mail.body}`;
}

function markEmailAsRead(mail){
  const readTrueURL = `${urlBase}/emails/${mail.id}`;
  fetch(readTrueURL, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  })
}

function markEmailAsArchived(mail, value){
  const readTrueURL = `${urlBase}/emails/${mail.id}`;
  fetch(readTrueURL, {
    method: 'PUT',
    body: JSON.stringify({
      archived: value
    })
  })
  .then(() =>{
    load_mailbox('inbox');
  })
}

function displayEmailMessage(){
  document.querySelector('#email-message').style.display = 'block';
}

function hideEmailMessage(){
  document.querySelector('#email-message').style.display = 'none';
}

function showEmailSentOk(){
  const emailMessage = document.querySelector('#email-message');
  emailMessage.innerHTML = "";
  const emailDiv = document.createElement('div');
  emailDiv.classList.add("alert", "alert-success");
  emailDiv.innerText = "Email sent successfully!";
  emailMessage.append(emailDiv);
}


function showEmailSentError(errorMessage){
  const emailMessage = document.querySelector('#email-message');
  emailMessage.innerHTML = "";
  const emailDiv = document.createElement('div');
  emailDiv.classList.add("alert", "alert-danger");
  emailDiv.innerText = `Problem while sending email: ${errorMessage}`;
  emailMessage.append(emailDiv);
}

