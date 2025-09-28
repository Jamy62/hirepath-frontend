
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import GuestRoute from '../components/guards/GuestRoute';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout.js')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout.js')));

const Dashboard = Loadable(lazy(() => import('../views/admin/dashboard/Dashboard.js')));
const Users = Loadable(lazy(() => import('../views/admin/Users/Users.js')));
const Plans = Loadable(lazy(() => import('../views/admin/plans/Plans.js')));
const Companies = Loadable(lazy(() => import('../views/admin/companies/Companies.js')));
const ExperienceLevels = Loadable(lazy(() => import('../views/admin/experience-levels/ExperienceLevels.js')));
const Industries = Loadable(lazy(() => import('../views/admin/industries/Industries.js')));
const JobFunctions = Loadable(lazy(() => import('../views/admin/jobfunctions/JobFunctions.js')));
const JobTypes = Loadable(lazy(() => import('../views/admin/jobtypes/JobTypes.js')));
const Languages = Loadable(lazy(() => import('../views/admin/languages/Languages.js')));
const PaymentMethods = Loadable(lazy(() => import('../views/admin/payment-methods/PaymentMethods.js')));
const Provinces = Loadable(lazy(() => import('../views/admin/provinces/Provinces.js')));
const Townships = Loadable(lazy(() => import('../views/admin/townships/Townships.js')));

const DynamicEdit = Loadable(lazy(() => import('../views/admin/DynamicEdit.js')));
const DynamicCreate = Loadable(lazy(() => import('../views/admin/DynamicCreate.js')));

const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage.js')));
const Icons = Loadable(lazy(() => import('../views/icons/Icons.js')));
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage.js')));
const Shadow = Loadable(lazy(() => import('../views/utilities/Shadow.js')));
const Error = Loadable(lazy(() => import('../views/authentication/Error.js')));
const Register = Loadable(lazy(() => import('../views/authentication/Register.js')));
const Login = Loadable(lazy(() => import('../views/authentication/Login.js')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/admin/dashboard" /> },
      { path: '/admin/dashboard', exact: true, element: <Dashboard /> },
      { path: '/admin/users', exact: true, element: <Users /> },
      { path: '/admin/plans', exact: true, element: <Plans /> },
      { path: '/admin/companies', exact: true, element: <Companies /> },
      { path: '/admin/experience-levels', exact: true, element: <ExperienceLevels /> },
      { path: 'admin/industries', exact: true, element: <Industries /> },
      { path: 'admin/job-functions', exact: true, element: <JobFunctions /> },
      { path: 'admin/job-types', exact: true, element: <JobTypes /> },
      { path: 'admin/languages', exact: true, element: <Languages /> },
      { path: 'admin/payment-methods', exact: true, element: <PaymentMethods /> },
      { path: 'admin/provinces', exact: true, element: <Provinces /> },
      { path: 'admin/townships', exact: true, element: <Townships /> },

      { path: '/admin/edit', exact: true, element: <DynamicEdit /> },
      { path: '/admin/create', exact: true, element: <DynamicCreate /> },

      { path: '/sample-page', exact: true, element: <SamplePage /> },
      { path: '/icons', exact: true, element: <Icons /> },
      { path: '/ui/typography', exact: true, element: <TypographyPage /> },
      { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      {
        path: '/auth/register',
        element: (
          <GuestRoute>
            <Register />
          </GuestRoute>
        ),
      },
      {
        path: '/auth/login',
        element: (
          <GuestRoute>
            <Login />
          </GuestRoute>
        ),
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
