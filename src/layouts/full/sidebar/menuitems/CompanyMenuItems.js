import {
  IconLayoutDashboard,
  IconBriefcase,
  IconUsers,
  IconBuilding,
  IconCreditCard, IconPaperclip
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';

const CompanyMenuItems = [
  {
    navlabel: true,
    subheader: 'Company Workspace',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/company/dashboard',
  },
  {
    id: uniqueId(),
    title: 'My Jobs',
    icon: IconBriefcase,
    href: '/company/jobs',
  },
  {
    id: uniqueId(),
    title: 'Applicants',
    icon: IconUsers,
    href: '/company/applicants',
  },
  {
    id: uniqueId(),
    title: 'Positions',
    icon: IconPaperclip,
    href: '/company/positions',
  },
  {
    id: uniqueId(),
    title: 'Employees',
    icon: IconUsers,
    href: '/company/employees',
  },
  {
    id: uniqueId(),
    title: 'Subscription',
    icon: IconCreditCard,
    href: '/company/plan',
  },
  {
    id: uniqueId(),
    title: 'Payment Methods',
    icon: IconCreditCard,
    href: '/company/payment-methods',
  },
];

export default CompanyMenuItems;