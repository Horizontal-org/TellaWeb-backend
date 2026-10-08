import { BootstrapConsole } from 'nestjs-console';
import { AppModule } from './app.module';

// Closing the app right after a command can stop a Bull queue worker that is
// still connecting to Redis. Bull then rejects a promise nobody handles (the
// worker loop @nestjs/bull starts with queue.process()), which would make the
// process exit with an error after the command already succeeded. Ignore
// those once we're shutting down; before that, keep Node's default behaviour.
let closing = false;
process.on('unhandledRejection', (reason) => {
  if (closing) return;
  console.error(reason);
  process.exit(1);
});

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true,
});
bootstrap.init().then(async (app) => {
  try {
    await app.init();
    await bootstrap.boot();
    closing = true;
    await app.close();

    process.exit(0);
  } catch (e) {
    closing = true;
    app.close();

    process.exit(1);
  }
});
