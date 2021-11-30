import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';

import { PaginatedDto } from '../dto/paginated.common.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginatedDto),
    ApiQuery({
      name: 'limit',
      type: Number,
    }),
    ApiQuery({
      name: 'offset',
      type: Number,
    }),
    ApiQuery({
      name: 'sort',
      type: String,
      required: false,
    }),
    ApiQuery({
      name: 'order',
      type: String,
      required: false,
    }),
    ApiQuery({
      name: 'search',
      type: String,
      required: false,
    }),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
