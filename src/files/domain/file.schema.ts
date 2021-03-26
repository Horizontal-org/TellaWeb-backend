import { EntitySchema } from 'typeorm';
import { File } from './file.entity';

export const FileSchema = new EntitySchema<File>({
  name: 'File',
  target: File,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    fileName: {
      type: String,
    },
  },
});
