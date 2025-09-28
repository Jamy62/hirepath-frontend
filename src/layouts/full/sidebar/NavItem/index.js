import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { ListItemIcon, ListItem, List, styled, ListItemText, useTheme, Collapse,
} from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

const NavItem = ({ item, level = 1, pathDirect, onClick }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const [collapse, setCollapse] = useState(false);

  const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

  const ListItemStyled = styled(ListItem)(() => ({
    whiteSpace: 'nowrap',
    marginBottom: '2px',
    padding: '8px 10px',
    borderRadius: '8px',
    backgroundColor: 'inherit',
    color: theme.palette.text.secondary,
    paddingLeft: level > 1 ? `${level * 10}px !important` : '10px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
    },
  }));

  if (item.children) {
    return (
      <>
        <ListItemStyled component="div" disablePadding key={item.id} onClick={() => setCollapse(!collapse)} sx={{cursor: 'pointer'}}>
          <ListItemIcon sx={{ minWidth: '36px', p: '3px 0', color: 'inherit' }}>
            {itemIcon}
          </ListItemIcon>
          <ListItemText>
            <>{item.title}</>
          </ListItemText>
          {collapse ? <IconChevronUp /> : <IconChevronDown />}
        </ListItemStyled>

        <Collapse in={collapse} unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                level={level + 1}
                pathDirect={pathDirect}
                onClick={onClick}
              />
            ))}
          </List>
        </Collapse>
      </>
    );
  }

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled
        button
        component={NavLink}
        to={item.href}
        disabled={item.disabled}
        selected={pathDirect === item.href}
        onClick={onClick}
      >
        <ListItemIcon sx={{ minWidth: '36px', p: '3px 0', color: 'inherit' }}>
          {itemIcon}
        </ListItemIcon>
        <ListItemText>
          <>{item.title}</>
        </ListItemText>
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavItem;
