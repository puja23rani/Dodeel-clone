import React from 'react';
import { Helmet } from 'react-helmet';
import { makeStyles } from 'tss-react/mui';
import brand from 'enl-api/dummy/brand';
import { SourceReader, PapperBlock } from 'enl-components';
import {
  BasicTree,
  CustomTree,
} from './demos';

const useStyles = makeStyles()(() => ({
  root: {
    flexGrow: 1,
  }
}));

function TreeView() {
  const title = brand.name + ' - UI Elements';
  const description = brand.desc;
  const {
    classes
  } = useStyles();
  const docSrc = 'containers/UiElements/demos/TreeView/';
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <div className={classes.root}>
        <PapperBlock
          title="Basic Tree View"
          icon="subdirectory_arrow_right"
          desc="Tree views can be used to represent a file system navigator displaying folders and files, an item representing a folder can be expanded to reveal the contents of the folder, which may be files, folders, or both."
        >
          <div>
            <BasicTree />
            <SourceReader componentName={docSrc + 'Basic.js'} />
          </div>
        </PapperBlock>
      </div>
      <div className={classes.root}>
        <PapperBlock
          title="Customized tree view"
          icon="sort"
          desc="Custom icons, border and animation"
        >
          <div>
            <CustomTree />
            <SourceReader componentName={docSrc + 'Custom.js'} />
          </div>
        </PapperBlock>
      </div>
    </div>
  );
}

export default TreeView;
