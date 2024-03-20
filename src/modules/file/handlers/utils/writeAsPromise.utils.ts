import { createWriteStream } from 'fs';
import { Stream } from 'stream';
import fs from 'fs'

export const createWritePromise = (filePath: string, stream: Stream) =>


  new Promise<boolean>((res, rej) => {

    let written = 0
    stream
      .on('data', (c) => {
        written += c.length
      })
      .pipe(createWriteStream(filePath, { flags: 'a', mode: 0o644 }))
      .on('pipe', () => {
      })      
      .on('finish', () => res(true))
      .on('error', (error: Error) => {
        console.log("STREAM ERROR ==> ", error)
        rej(error)
      });
  });
