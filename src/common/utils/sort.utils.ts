import { BadRequestException } from '@nestjs/common';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

// Sort keys a list accepts from the client, mapped to the alias.property the
// query sorts by. Keys are what the web app sends.
export type SortableColumns = Readonly<Record<string, string>>;

// `sort` comes from the request and would end up in ORDER BY, so only the
// listed keys are accepted (anything else used to run as SQL).
export function applySort<T extends ObjectLiteral>(
  query: SelectQueryBuilder<T>,
  sort: string,
  order: string,
  sortable: SortableColumns,
): SelectQueryBuilder<T> {
  if (!sort) return query;

  const column = Object.prototype.hasOwnProperty.call(sortable, sort)
    ? sortable[sort]
    : undefined;
  if (!column) throw new BadRequestException('Invalid sort');

  return query.orderBy(column, order === 'asc' ? 'ASC' : 'DESC');
}
