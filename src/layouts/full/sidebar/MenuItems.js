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
  IconDeviceDesktop
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
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
        icon: IconBuilding,
        href: '/admin/companies',
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
        title: 'Payment Methods',
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
  // {
  //   navlabel: true,
  //   subheader: 'Utilities',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Typography',
  //   icon: IconTypography,
  //   href: '/ui/typography',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Shadow',
  //   icon: IconCopy,
  //   href: '/ui/shadow',
  // },
  // {
  //   navlabel: true,
  //   subheader: 'Auth',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Login',
  //   icon: IconLogin,
  //   href: '/auth/login',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Register',
  //   icon: IconUserPlus,
  //   href: '/auth/register',
  // },
  // {
  //   navlabel: true,
  //   subheader: 'Extra',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Icons',
  //   icon: IconMoodHappy,
  //   href: '/icons',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Sample Page',
  //   icon: IconAperture,
  //   href: '/sample-page',
  // },
];

export default Menuitems;
