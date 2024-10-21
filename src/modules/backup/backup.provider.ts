import { TYPES } from './interfaces';

import { CheckInProgressBackupService} from './services/check-in-progress.backup.service';
import { StartBackupService } from './services/start.backup.service';

import { StartBackupApplication } from './applications/start.backup.application';
import { ProcessBackupHandler } from './handlers/process.backup.handler';


export const checkInProgressServiceProvider = {
  provide: TYPES.services.ICheckInProgressBackupService,
  useClass: CheckInProgressBackupService
}


export const startBackupServiceProvider = {
  provide: TYPES.services.IStartBackupService,
  useClass: StartBackupService
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
    checkInProgressServiceProvider
];

export const handlersBackupProviders = [
    backupsProcessorHandlerProvider
]