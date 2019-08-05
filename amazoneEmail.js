const AWS = require('aws-sdk');
const { isBase64, randomNumber } = require('./utils');

// Set the region
AWS.config.update({
  region: process.env.AMAZON_SES_REGION || 'us-east-1',
  accessKeyId:  process.env.AMAZON_SES_KEY || '',
  secretAccessKey: process.env.AMAZON_SES_SECRET || ''
});

const AMAZONE = (objData) => {
  if (!objData.to || !objData.content || !objData.from || !objData.subject){
    throw Error('to, from, subject or content not null');
  };

  const AWS_SES = new AWS.SES({ apiVersion: '2010-12-01' });

  const objModule = {
    toEmail: objData.to || '',
    fromEmail: objData.from || '',
    ccEmail: objData.cc || '',
    bccEmail: objData.bcc || '',
    contentEmail: objData.content || '',
    subjectEmail: objData.subject || '',
    replyTo: objData.replyTo || objData.from || '',
    attachments: objData.attachments || [] // attachments : [{filename: '', content: ''}]
  };

  const contentType = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docs': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'csv': 'text/csv',
    'rar': 'application/x-rar-compressed',
    'zip': 'application/zip',
    'txt': 'text/plain'
  };
  const formatAttachments = (nextNumber, arrData) => {
    let strReturn = '';
    if (!arrData.length){
      return strReturn;
    }
    arrData.forEach((objVal) => {
      if (objVal.content && objVal.filename) {
        const base64Content = isBase64(objVal.content)
          ? objVal.content
          : Buffer.from(objVal.content).toString('base64');
        let fileName = objVal.filename;
        const suffixName = objVal.filename.split('.');
        let typeName = contentType[suffixName[1]];
        if (!typeName) {
          typeName = contentType['txt'];
          fileName = `${fileName}.txt`;
        }
        strReturn = strReturn + "--NextAttachemt"+ nextNumber +"\n";
        strReturn = strReturn + "Content-Type: "+ typeName +";\n";
        strReturn = strReturn + "Content-Disposition: attachment; filename=\""+fileName+"\";\n";
        strReturn = strReturn + "Content-Transfer-Encoding: base64\n\n";
        strReturn = strReturn + base64Content +"\n\n";
      }
    });
    return strReturn;
  };

  const messagerRaw = () => {
    const nextNumber = randomNumber;

    let sesMailContent = "From: " + objModule.fromEmail + "\n";
    sesMailContent = sesMailContent + "To: " + objModule.toEmail + "\n";
    sesMailContent = sesMailContent + "Cc: " + objModule.ccEmail + "\n";
    sesMailContent = sesMailContent + "Bcc: " + objModule.bccEmail + "\n";
    sesMailContent = sesMailContent + "Reply-To: " + objModule.replyTo + "\n";
    sesMailContent = sesMailContent + "Subject: "+ objModule.subjectEmail +"\n";
    sesMailContent = sesMailContent + "MIME-Version: 1.0\n";
    // header file
    sesMailContent = sesMailContent + "Content-Type: multipart/mixed; boundary=\"NextAttachemt"+ nextNumber +"\"\n\n";
    sesMailContent = sesMailContent + "--NextAttachemt"+ nextNumber +"\n";
    // header content
    sesMailContent = sesMailContent + "Content-Type: multipart/alternative; boundary=\"NextContent"+ nextNumber +"\"\n\n";
    sesMailContent = sesMailContent + "--NextContent"+ nextNumber +"\n";

    // content
    sesMailContent = sesMailContent + "Content-Type: text/html; charset=UTF-8\n\n";
    sesMailContent = sesMailContent + objModule.contentEmail + "\n\n";
    sesMailContent = sesMailContent + "--NextContent"+ nextNumber +"--\n";
    // Attachment file
    sesMailContent = sesMailContent + formatAttachments(nextNumber, objModule.attachments);
    // Stop attachment
    sesMailContent = sesMailContent + "--NextAttachemt"+ nextNumber +"--";

    return sesMailContent;
  };

  const sendMailRaw = () => {
    // Create sendEmail params
    const params = {
      RawMessage: {
        Data: new Buffer(messagerRaw())
      },
      // Destinations: [ toEmail ],
      Source: objModule.fromEmail
    };
    // Create the promise and SES service object
    return AWS_SES.sendRawEmail(params).promise();
  };

  return {
    sendMailRaw
  };
};
module.exports.AMAZONE = AMAZONE;
