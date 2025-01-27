import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { useSelector, useDispatch } from 'react-redux';
import { TreeTable } from 'enl-components';
import { toggleTree } from '../reducers/treeTbSlice';
import data from './dataTreeTable.js';

const useStyles = makeStyles()((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
}));

function TreeTableDemoIcon() {
  const { classes } = useStyles();

  // Redux State
  const branch = 'icon';
  const treeOpen = useSelector(state => state.treeTable[branch].treeOpen);
  const arrowMore = useSelector(state => state.treeTable[branch].arrowMore);

  // Dispatcher
  const dispatch = useDispatch();

  return (
    <div>
      <div className={classes.root}>
        <TreeTable
          treeOpen={treeOpen}
          toggleTree={(payload) => dispatch(toggleTree(payload))}
          arrowMore={arrowMore}
          dataTable={data}
          branch={branch}
          expandIcon="ion-ios-add-circle-outline"
          collapseIcon="ion-ios-remove-circle-outline"
        />
      </div>
    </div>
  );
}

export default TreeTableDemoIcon;
