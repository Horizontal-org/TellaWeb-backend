import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { createTransport } from 'nodemailer'
import MailConfig from 'mailconfig';
import { readFileSync } from 'fs'
import path, { join } from 'path';
import * as hbs from 'nodemailer-express-handlebars'

@Injectable()
export class MailUtilService {

  public transporter = null

  constructor() {    
    this.transporter = createTransport(MailConfig);
    const basePath = this.getPath()
    const handlebarOptions = {
      viewEngine: {
        partialsDir: basePath + 'common/mails/partials/',//your path, views is a folder inside the source folder
        layoutsDir: basePath + 'common/mails/',       
        defaultLayout: false //set this one empty and provide your template below,
      },
      viewPath: basePath + 'common/mails/',
    };
    this.transporter.use('compile', hbs(handlebarOptions))
  }
  
  public async send(params) {

    try {
      await this.transporter.sendMail({
        to: params.to,
        from: 'noreply@support.tella-app.org', // sender address
        subject: params.subject, // Subject line
        template: 'blocked-account',
        context: {...params.data}
      })
  
    } catch (e) {
      console.log("🚀 ~ file: mail.util.service.ts:29 ~ MailUtilService ~ example ~ e:", e)      
    }
  }
 
  private getPath() {
    //TODO change for production
    return join(process.cwd(), `/src/`)
  }
}