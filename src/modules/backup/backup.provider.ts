import { TYPES } from './interfaces';

import { CheckInProgressBackupService} from './services/check-in-progress.backup.service';
import { StartBackupService } from './services/start.backup.service';
import { LatestBackupService } from './services/latest.backup.service'

import { StartBackupApplication } from './applications/start.backup.application';
import { ProcessBackupHandler } from './handlers/process.backup.handler';
import { DeleteBackupService } from './services/delete.backup.service';
import { DownloadBackupService } from './services/download.backup.service';


export const checkInProgressServiceProvider = {
  provide: TYPES.services.ICheckInProgressBackupService,
  useClass: CheckInProgressBackupService
}


export const startBackupServiceProvider = {
  provide: TYPES.services.IStartBackupService,
  useClass: StartBackupService
}

export const latestBackupServiceProvider = {
  provide: TYPES.services.ILatestBackupService,
  useClass: LatestBackupService
}

export const deleteBackupServiceProvider = {
  provide: TYPES.services.IDeleteBackupService,
  useClass: DeleteBackupService
}

export const downloadBackupServiceProvider = {
  provide: TYPES.services.IDownloadBackupService,
  useClass: DownloadBackupService
}

export const startBackupApplicationProvider = {
  provide: TYPES.applications.IStartBackupApplication,
  useClass: StartBackupApplication
}

export const backupsProcessorHandlerProvider = {
  provide: TYPES.handlers.IProcessBackupHandler,
  useClass: ProcessBackupHandler,
};

export const applicationsBackupProviders = [
    startBackupApplicationProvider
];

export const servicesBackupProviders = [ 
    startBackupServiceProvider,
    checkInProgressServiceProvider,
    latestBackupServiceProvider,
    deleteBackupServiceProvider,
    downloadBackupServiceProvider
];

export const handlersBackupProviders = [
    backupsProcessorHandlerProvider
]