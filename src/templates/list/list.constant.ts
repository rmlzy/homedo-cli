import { ColumnProps } from 'ant-design-vue/lib/table/interface';
import { IQuery, IState } from './<%= name %>.interface';

const DEFAULT_PAGE_SIZE = 20;

export const columns: ColumnProps[] = [
  {
    title: '#',
    dataIndex: 'index',
    width: 60,
    slots: { customRender: 'index' }
  },
  {
    title: '表格列1',
    dataIndex: 'table1',
    key: 'table1'
  },
  {
    title: '表格列2',
    dataIndex: 'table2',
    key: 'table2'
  },
  {
    title: '表格列3',
    dataIndex: 'table3',
    key: 'table3'
  },
  {
    title: '表格列4',
    dataIndex: 'table4',
    key: 'table4'
  },
  {
    title: '表格列5',
    dataIndex: 'table5',
    key: 'table5'
  },
  {
    title: '表格列6',
    dataIndex: 'table6',
    key: 'table6'
  },
  {
    title: '表格列7',
    dataIndex: 'table7',
    key: 'table7'
  },
  {
    title: '表格列8',
    dataIndex: 'table8',
    key: 'table8'
  },
  {
    title: '表格列9',
    dataIndex: 'table9',
    key: 'table9'
  }
];

export const defaultQueryForm: IQuery = {
  <% for (var i = 1; i <= queryCount; i++) { %> query<%= i %>: undefined, <% } %>
};

export const defaultState: IState = {
  loading: false,
  selectedKeys: [],
  columns: columns,
  records: [],
  pagination: {
    current: 1,
    size: DEFAULT_PAGE_SIZE,
    total: 0
  }
};
