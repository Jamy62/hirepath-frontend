import PropTypes from 'prop-types';
import {
  Toolbar, Typography, IconButton, Tooltip, alpha
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AdminTableToolbar = (props) => {
  const { title, selected, onEdit, onDelete, onCreate, onView } = props;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      onDelete();
    }
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(selected && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {selected ? (
        <>
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
            1 selected
          </Typography>
          {onView && (
            <Tooltip title="View">
              <IconButton onClick={onView}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Edit">
              <IconButton onClick={onEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete">
              <IconButton onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      ) : (
        <>
          <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>

          {onCreate && (
            <Tooltip title="Create">
              <IconButton onClick={onCreate}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </Toolbar>
  );
}

AdminTableToolbar.propTypes = {
  title: PropTypes.string.isRequired,
  selected: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCreate: PropTypes.func,
  onView: PropTypes.func,
};

export default AdminTableToolbar;