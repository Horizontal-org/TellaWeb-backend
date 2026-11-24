import { BadRequestException } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { applySort } from './sort.utils';

describe('applySort', () => {
  const sortable = {
    'item.name': 'item.name',
    'item.created_at': 'item.createdAt',
  };
  let orderBy: jest.Mock;
  let query: SelectQueryBuilder<any>;

  beforeEach(() => {
    orderBy = jest.fn().mockReturnThis();
    query = { orderBy } as unknown as SelectQueryBuilder<any>;
  });

  it('sorts by the mapped column, ascending only for "asc"', () => {
    applySort(query, 'item.created_at', 'asc', sortable);
    expect(orderBy).toHaveBeenLastCalledWith('item.createdAt', 'ASC');

    applySort(query, 'item.name', 'desc', sortable);
    expect(orderBy).toHaveBeenLastCalledWith('item.name', 'DESC');

    applySort(query, 'item.name', 'anything', sortable);
    expect(orderBy).toHaveBeenLastCalledWith('item.name', 'DESC');
  });

  it('leaves the query unsorted without a sort', () => {
    applySort(query, '', 'asc', sortable);
    applySort(query, undefined, 'asc', sortable);
    expect(orderBy).not.toHaveBeenCalled();
  });

  it('rejects keys that are not listed, including SQL and object keys', () => {
    for (const sort of [
      'item.password',
      'item.name, (SELECT SLEEP(1))',
      'constructor',
      '__proto__',
      'toString',
    ]) {
      expect(() => applySort(query, sort, 'asc', sortable)).toThrow(
        BadRequestException,
      );
    }
    expect(orderBy).not.toHaveBeenCalled();
  });
});
