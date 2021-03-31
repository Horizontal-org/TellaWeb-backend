## Reports Module

This module solves the problem of report creation and management.

- Reports can be created with title and description.
- Files can be added to reports
- Reports can be viewed individually
- Reports can be queried in an ordered way

### Current implementation

Reports are the main Entities in the domain of this module and there is also a relationship entity called ReportFiles that keeps the relationship between the uploaded files and the report they belong to.

The unique identifier of the report is used as the bucket for the uploaded files (**see file module for more details about buckets**).

### Applications

This module does not export any application but it does have dependencies with the file module, since the objective of the reports is to group them in a meaningful unit.
