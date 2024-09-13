import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from 'tss-react/mui';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import SearchIcon from '@mui/icons-material/Search';

const useStyles = makeStyles()((theme) => ({
  search: {
    display: 'block',
    background: theme.palette.background.paper,
    marginBottom: 10,
    borderRadius: theme.rounded.medium,
    boxShadow: theme.shadows[2],
    '& > div': {
      width: '100%',
      border: 'none'
    },
    '& input': {
      padding: '16px'
    }
  }
}));

function SearchIcons(props) {
  const { filterText, handleSearch } = props;
  const {
    classes
  } = useStyles();
  return (
    <FormControl variant="standard" fullWidth className={classes.search}>
      <Input
        id="search_filter"
        type="text"
        placeholder="Search more than 800 icons"
        value={filterText}
        onChange={handleSearch}
        endAdornment={(
          <InputAdornment position="end">
            <IconButton aria-label="Search filter" size="large">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        )}
      />
    </FormControl>
  );
}

SearchIcons.propTypes = {
  filterText: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

export default SearchIcons;
