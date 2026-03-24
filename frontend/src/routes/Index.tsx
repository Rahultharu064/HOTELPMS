import type { RouteObject } from 'react-router-dom';
import Homepage from '../pages/publicwebsite/Homepage';
import AboutusPage from '../pages/publicwebsite/AboutusPage';
import ContactUsPage from '../pages/publicwebsite/ContactUsPage';
import Roompage from '../pages/publicwebsite/Roompage';
import RoomDetailspage from '../pages/publicwebsite/RoomDetailspage';
import DashboardPage from '../pages/frontoffice/DashboardPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: '/about',
    element: <AboutusPage />,
  },
  {
    path: '/contact',
    element: <ContactUsPage />,
  },
  {
    path: '/rooms',
    element: <Roompage />,
  },
  {
    path: '/rooms/:id',
    element: <RoomDetailspage />,
  },
  {
    path: '/frontoffice',
    element: <DashboardPage />,
  },
  {
    path: '/frontoffice/dashboard',
    element: <DashboardPage />,
  },
  // Add other module routes (Admin, FrontOffice, etc.) here as they are implemented
];

export default routes;
