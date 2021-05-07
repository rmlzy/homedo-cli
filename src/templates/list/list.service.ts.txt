import { message } from 'ant-design-vue';
import { AxiosResponse } from 'axios';
import request from '@/utils/request';
import { IResponse, IPaginate, IPagination } from '@/core/interface';
import { IQuery, ITableRow, IResult } from './<%= name %>.interface';

export const fetchTableData = async (
  query: IQuery,
  pagination: IPagination
): Promise<IResult> => {
  const result: IResult = {
    total: 0,
    records: []
  };
  try {
    const { current, size } = pagination;
    const r: AxiosResponse<IResponse<IPaginate<ITableRow>>> = await request({
      method: 'GET',
      url: '/api/mock-api',
      params: { ...query, current, size }
    });
    const res = r.data;
    if (res.respCode !== '0000') {
      message.error(res.respDesc);
      return result;
    }
    result.total = res.data.total || 0;
    result.records = res.data.records || [];
  } catch (e) {
    message.error(e.message);
  }
  return result;
};
