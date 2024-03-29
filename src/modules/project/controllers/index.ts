import { CreateProjectController } from './create.project.controller'
import { GetByIdProjectController } from './get-by-id.project.controller'
import { ListProjectController } from './list.project.controller'
import { EditProjectController } from './edit.project.controller'
import { DeleteByIdProjectController } from './delete-by-id.project.controller'
import { AddReportProjectController } from './add-report.controller'
import { GetBySlugProjectController } from './get-by-slug.controller'

export const projectControllers = [
  CreateProjectController,
  ListProjectController,
  GetByIdProjectController,
  EditProjectController,
  DeleteByIdProjectController,
  AddReportProjectController,
  GetBySlugProjectController
]