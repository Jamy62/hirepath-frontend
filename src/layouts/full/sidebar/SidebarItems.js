import React from 'react';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import { useAuth } from 'src/contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const SidebarItems = ({ items }) => {
  const { pathname } = useLocation();
  const { token } = useAuth();
  const { t } = useTranslation();
  const pathDirect = pathname;

  const translateMenuItems = (menuItems) => {
    return menuItems.map((item) => {
      const translatedItem = { ...item };
      if (translatedItem.title) {
        translatedItem.title = t(translatedItem.title);
      }
      if (translatedItem.subheader) {
        translatedItem.subheader = t(translatedItem.subheader);
      }
      if (translatedItem.children) {
        translatedItem.children = translateMenuItems(translatedItem.children);
      }
      return translatedItem;
    });
  };

  const translatedItems = items ? translateMenuItems(items) : [];

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {translatedItems.map((item) => {
          if (item.href === '/user/applications' && !token) {
            return null;
          }
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;
          }
          else {
            return <NavItem item={item} key={item.id} pathDirect={pathDirect} />;
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;