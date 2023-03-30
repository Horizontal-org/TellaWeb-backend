import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { IMailUtilService, TYPES as TYPES_UTIL } from 'modules/utils/interfaces';


@Processor('emails')
export class EmailsProcessor {

    constructor(
      @Inject(TYPES_UTIL.services.IMailUtilService)
      private mailService: IMailUtilService,          
    ) { }

    /** 
     * send mail
     * @param params
     * @returns 
     */
    @Process('send')
    async sendMail(job: Job) { 
      await this.mailService.send(job.data)    
    }
}