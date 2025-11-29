import {
  IconBriefcase,
  IconUser,
  IconListCheck
} from '@tabler/icons-react';
import { uniqueId } from 'lodash';

const UserMenuItems = [
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
];

export default UserMenuItems;