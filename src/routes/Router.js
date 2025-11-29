
import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

import GuestRoute from '../components/guards/GuestRoute';
import PrivateRoute from '../components/guards/PrivateRoute';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout.js')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout.js')));

const Dashboard = Loadable(lazy(() => import('../views/admin/dashboard/Dashboard.js')));
const Users = Loadable(lazy(() => import('../views/admin/Users/Users.js')));
const Admins = Loadable(lazy(() => import('../views/admin/admins/Admins.js')))
const Plans = Loadable(lazy(() => import('../views/admin/plans/Plans.js')));
const Companies = Loadable(lazy(() => import('../views/admin/companies/Companies.js')));
const CompanyVerificationRequests = Loadable(lazy(() => import('../views/admin/companies/CompanyVerificationRequests.js')));
const ExperienceLevels = Loadable(lazy(() => import('../views/admin/experience-levels/ExperienceLevels.js')));
const Industries = Loadable(lazy(() => import('../views/admin/industries/Industries.js')));
const JobFunctions = Loadable(lazy(() => import('../views/admin/jobfunctions/JobFunctions.js')));
const JobTypes = Loadable(lazy(() => import('../views/admin/jobtypes/JobTypes.js')));
const Languages = Loadable(lazy(() => import('../views/admin/languages/Languages.js')));
const PaymentTypes = Loadable(lazy(() => import('../views/admin/paymenttypes/./PaymentTypes')));
const Provinces = Loadable(lazy(() => import('../views/admin/provinces/Provinces.js')));
const Townships = Loadable(lazy(() => import('../views/admin/townships/Townships.js')));

const DynamicEdit = Loadable(lazy(() => import('../views/admin/DynamicEdit.js')));
const DynamicCreate = Loadable(lazy(() => import('../views/admin/DynamicCreate.js')));

const Profile = Loadable(lazy(() => import('../views/user/Profile.js')));
const UserProfileGuest = Loadable(lazy(() => import('../views/user/UserProfileGuest.js')));
const Applications = Loadable(lazy(() => import('../views/user/Applications.js')));

const CompanyDashboard = Loadable(lazy(() => import('../views/company/Dashboard')));
const CompanyProfile = Loadable(lazy(() => import('../views/company/Profile.js')));
const CompanyProfileGuest = Loadable(lazy(() => import('../views/company/CompanyProfileGuest.js')));
const JobCreate = Loadable(lazy(() => import('../views/company/JobCreate.js')));
const Applicants = Loadable(lazy(() => import('../views/company/Applicants.js')));
const Positions = Loadable(lazy(() => import('../views/company/Positions.js')));
const Employees = Loadable(lazy(() => import('../views/company/Employees.js')));
const CompanyJobs = Loadable(lazy(() => import('../views/company/CompanyJobs.js')));
const PaymentMethods = Loadable(lazy(() => import('../views/company/PaymentMethods.js')));
const Plan = Loadable(lazy(() => import('../views/company/Plan.js')));
const ResumeViewer = Loadable(lazy(() => import('../views/company/ResumeViewer.js')));
const CompanyVerify = Loadable(lazy(() => import('../views/company/CompanyVerify.js')));

const Landing = Loadable(lazy(() => import('../views/public/Landing.js')));
const JobFeed = Loadable(lazy(() => import('../views/public/JobFeed.js')));
const JobDetail = Loadable(lazy(() => import('../views/public/JobDetail.js')));

const Error = Loadable(lazy(() => import('../views/authentication/Error.js')));
const Register = Loadable(lazy(() => import('../views/authentication/Register.js')));
const Login = Loadable(lazy(() => import('../views/authentication/Login.js')));

const Router = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '', element: <Landing /> },
    ]
  },
  {
    path: '/public',
    element: <FullLayout />,
    children: [
      { path: 'jobs', exact: true, element: <JobFeed /> },
      { path: 'job/:guid', exact: true, element: <JobDetail /> }
    ]
  },
  {
    path: '/admin',
    element: <PrivateRoute><FullLayout /></PrivateRoute>,
    children: [
      { path: '', element: <Navigate to="/admin/dashboard" /> },
      { path: 'dashboard', exact: true, element: <Dashboard /> },
      { path: 'users', exact: true, element: <Users /> },
      { path: 'admins', exact: true, element: <Admins /> },
      { path: 'plans', exact: true, element: <Plans /> },
      { path: 'companies', exact: true, element: <Companies /> },
      { path: 'companies/verifications', exact: true, element: <CompanyVerificationRequests /> },
      { path: 'experience-levels', exact: true, element: <ExperienceLevels /> },
      { path: 'industries', exact: true, element: <Industries /> },
      { path: 'job-functions', exact: true, element: <JobFunctions /> },
      { path: 'job-types', exact: true, element: <JobTypes /> },
      { path: 'languages', exact: true, element: <Languages /> },
      { path: 'paymenttypes', exact: true, element: <PaymentTypes /> },
      { path: 'provinces', exact: true, element: <Provinces /> },
      { path: 'townships', exact: true, element: <Townships /> },

      { path: 'edit', exact: true, element: <DynamicEdit /> },
      { path: 'create', exact: true, element: <DynamicCreate /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/user',
    element: <PrivateRoute><FullLayout /></PrivateRoute>,
    children: [
      { path: '', element: <Navigate to="/user/profile" /> },
      { path: 'profile', exact: true, element: <Profile /> },
      { path: 'profile/guest/:userGuid', exact: true, element: <UserProfileGuest /> },
      { path: 'applications', exact: true, element: <Applications /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/company',
    element: <PrivateRoute><FullLayout /></PrivateRoute>,
    children: [
      { path: '', element: <Navigate to="/company/dashboard" /> },
      { path: 'dashboard', exact: true, element: <CompanyDashboard /> },
      { path: 'profile', exact: true, element: <CompanyProfile /> },
      { path: 'profile/guest/:companyGuid', exact: true, element: <CompanyProfileGuest /> },
      { path: 'job/create', exact: true, element: <JobCreate /> },
      { path: 'applicants', exact: true, element: <Applicants /> },
      { path: 'resume/viewer/:resumeGuid', exact: true, element: <ResumeViewer /> },
      { path: 'positions', exact: true, element: <Positions /> },
      { path: 'employees', exact: true, element: <Employees /> },
      { path: 'jobs', exact: true, element: <CompanyJobs /> },
      { path: 'payment-methods', exact: true, element: <PaymentMethods /> },
      { path: 'plan', exact: true, element: <Plan /> },
      { path: 'verify', exact: true, element: <CompanyVerify /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      {
        path: 'register',
        element: (
          <GuestRoute>
            <Register />
          </GuestRoute>
        ),
      },
      {
        path: 'login',
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