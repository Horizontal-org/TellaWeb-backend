import { CreateProjectController } from './create.project.controller'
import { GetByIdProjectController } from './get-by-id.project.controller'
import { ListProjectController } from './list.project.controller'

export const projectControllers = [
  CreateProjectController,
  ListProjectController,
  GetByIdProjectController
]