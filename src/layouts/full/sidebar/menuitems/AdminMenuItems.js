import {
  IconLayoutDashboard,
  IconUsers,
  IconReportMoney,
  IconBuilding,
  IconStairsUp,
  IconBuildingFactory2,
  IconBriefcase,
  IconCategory,
  IconLanguage,
  IconCreditCard,
  IconMap,
  IconMapPin,
  IconListDetails,
  IconDeviceDesktop, IconCheckbox, IconUser, IconListCheck
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const AdminMenuItems = [
  {
    navlabel: true,
    subheader: 'User Workspace',
  },
  {
    id: uniqueId(),
    title: 'Find Jobs',
    icon: IconBriefcase,
    href: '/public/jobs',
  },
  {
    id: uniqueId(),
    title: 'My Applications',
    icon: IconListCheck,
    href: '/user/applications',
  },
  {
    navlabel: true,
    subheader: 'Administration',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/admin/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Admin Tables',
    icon: IconListDetails,
    children: [
      {
        id: uniqueId(),
        title: 'Users',
        icon: IconUsers,
        href: '/admin/users',
      },
      {
        id: uniqueId(),
        title: 'Admins',
        icon: IconDeviceDesktop,
        href: '/admin/admins',
      },
      {
        id: uniqueId(),
        title: 'Plans',
        icon: IconReportMoney,
        href: '/admin/plans',
      },
      {
        id: uniqueId(),
        title: 'Companies',
        icon: IconListDetails,
        children: [
          {
            id: uniqueId(),
            title: 'Companies',
            icon: IconBuilding,
            href: '/admin/companies',
          },
          {
            id: uniqueId(),
            title: 'Verifications',
            icon: IconCheckbox,
            href: '/admin/companies/verifications',
          },
        ]
      },
      {
        id: uniqueId(),
        title: 'Experience Levels',
        icon: IconStairsUp,
        href: '/admin/experience-levels',
      },
      {
        id: uniqueId(),
        title: 'Industries',
        icon: IconBuildingFactory2,
        href: '/admin/industries',
      },
      {
        id: uniqueId(),
        title: 'Job Functions',
        icon: IconBriefcase,
        href: '/admin/job-functions',
      },
      {
        id: uniqueId(),
        title: 'Job Types',
        icon: IconCategory,
        href: '/admin/job-types',
      },
      {
        id: uniqueId(),
        title: 'Languages',
        icon: IconLanguage,
        href: '/admin/languages',
      },
      {
        id: uniqueId(),
        title: 'Payment Types',
        icon: IconCreditCard,
        href: '/admin/paymenttypes',
      },
      {
        id: uniqueId(),
        title: 'Provinces',
        icon: IconMap,
        href: '/admin/provinces',
      },
      {
        id: uniqueId(),
        title: 'Townships',
        icon: IconMapPin,
        href: '/admin/townships',
      },
    ]
  },
];

export default AdminMenuItems;