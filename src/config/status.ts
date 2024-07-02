import { TableFilterOption } from '@/types/helper';
import { MESSAGE_STATUS } from '@/types/message';

// export const STATUS_MAP = {
//   [STATUS.INFLIGHT]: {
//     title: 'Inflight',
//     color: 'bg-yellow-500',
//     value: 1
//   },
//   [STATUS.SUCCESS]: {
//     title: 'Success',
//     color: 'bg-green-500',
//     value: 2
//   },
//   [STATUS.FAILED]: {
//     title: 'Failed',
//     color: 'bg-red-500',
//     value: 1
//   }
// };

export const MESSAGE_STATUS_LIST: TableFilterOption[] = [
  {
    value: MESSAGE_STATUS.PENDING,
    label: 'Inflight'
  },
  {
    value: MESSAGE_STATUS.SUCCESS,
    label: 'Success'
  },
  {
    value: MESSAGE_STATUS.FAILED,
    label: 'Failed'
  }
];
