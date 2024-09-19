import React, { useState, useCallback } from 'react';
import { makeStyles } from 'tss-react/mui';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import FileIcon from '@mui/icons-material/Description';
import ActionDelete from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import CloudUpload from '@mui/icons-material/CloudUpload';
import 'enl-styles/vendors/react-dropzone/react-dropzone.css';
import isImage from './helpers/helpers.js';
import Popup from '../Popup/Popup.js';

const useStyles = makeStyles()((theme) => ({
  rightIcon: {
    marginLeft: theme.spacing(1),
    '& svg': {
      fill: theme.palette.common.white
    }
  },
  button: {
    marginTop: 20
  }
}));

function MaterialDropZone(props) {
  const [openSnackBar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [files, setFiles] = useState(props.files); // eslint-disable-line
  const [acceptedFiles] = useState(props.acceptedFiles); // eslint-disable-line

  const {
    classes,
  } = useStyles();
  const {
    showPreviews,
    maxSize,
    onFilesChange,
    showButton,
    filesLimit,
    ...rest
  } = props;

  // const onDrop = useCallback((filesVal) => {
  //   let oldFiles = files;
  //   const filesLimitVal = filesLimit || '3';
  //   oldFiles = oldFiles.concat(filesVal);
  //   if (oldFiles.length > filesLimit) {
  //     setOpenSnackbar(true);
  //     setErrorMessage(`Cannot upload more than ${filesLimitVal} items.`);
  //   } else {
  //     setFiles(oldFiles);
  //   }
  // }, [files, filesLimit]);

  const onDropRejected = () => {
    setOpenSnackbar(true);
    setErrorMessage('File too big, max size is 3MB');
  };

  const onDrop = useCallback((filesVal) => {
    const filesLimitVal = filesLimit || 1;
    if (filesVal.length > filesLimitVal) {
      setOpenSnackbar(true);
      setErrorMessage(`You can only upload ${filesLimitVal} file.`);
    } else {
      setFiles(filesVal);
      onFilesChange(filesVal); // Update the parent state
    }
  }, [filesLimit, onFilesChange]);


  const handleRequestCloseSnackBar = () => {
    setOpenSnackbar(false);
  };

  const handleRemove = useCallback((file, fileIndex) => {
    // This is to prevent memory leaks.
    window.URL.revokeObjectURL(file.preview);

    setFiles(thisFiles => {
      const tempFiles = [...thisFiles];
      tempFiles.splice(fileIndex, 1);
      return tempFiles;
    });
  }, [files]);

  const fileSizeLimit = maxSize || 3000000;

  const DeleteBtn = ({ file, index }) => (
    <div className="middle">
      <IconButton onClick={() => handleRemove(file, index)} size="large">
        <ActionDelete className="removeBtn" />
      </IconButton>
    </div>
  );

  DeleteBtn.propTypes = {
    file: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  };

  const Previews = ({ filesArray }) => filesArray.map((file, index) => {
    const base64Img = URL.createObjectURL(file);
    if (isImage(file)) {
      return (
        <div key={index.toString()}>
          <div className="imageContainer col fileIconImg">
            <figure className="imgWrap"><img className="smallPreviewImg" src={base64Img} alt="preview" /></figure>
            <DeleteBtn file={file} index={index} />
          </div>
        </div>
      );
    }
    return (
      <div key={index.toString()}>
        <div className="imageContainer col fileIconImg">
          <FileIcon className="smallPreviewImg" alt="preview" />
          <DeleteBtn file={file} index={index} />
        </div>
      </div>
    );
  });

  Previews.propTypes = { filesArray: PropTypes.array.isRequired };

  let dropzoneRef;

  return (
    <div>
      <Dropzone
        accept={acceptedFiles.join(',')}
        onDrop={onDrop}
        onDropRejected={onDropRejected}
        maxSize={fileSizeLimit}
        ref={(node) => { dropzoneRef = node; }}
        noClick
        noKeyboard
        {...rest}
      >
        {({ getInputProps }) => (
          <>
            <input {...getInputProps()} />
            {showButton && (
              <Button
                className={classes.button}
                fullWidth
                variant="contained"
                onClick={() => dropzoneRef.open()}
                color="secondary"
              >
                {'Click to upload file(s)'}
                <span className={classes.rightIcon}>
                  <CloudUpload />
                </span>
              </Button>
            )}
          </>
        )}
      </Dropzone>
      <div className="row preview">
        {showPreviews && <Previews filesArray={files} />}
      </div>
      <Snackbar
        open={openSnackBar}
        message={errorMessage}
        autoHideDuration={4000}
        onClose={handleRequestCloseSnackBar}
      />
      {/* <Popup
        open={openSnackBar}
        message={errorMessage}
        onClose={handleRequestCloseSnackBar}
        severity={"error"} // You can change this to "error", "warning", etc.
      /> */}
    </div>
  );
}

// MaterialDropZone.propTypes = {
//   files: PropTypes.array.isRequired,
//   text: PropTypes.string.isRequired,
//   acceptedFiles: PropTypes.array,
//   showPreviews: PropTypes.bool.isRequired,
//   showButton: PropTypes.bool,
//   maxSize: PropTypes.number.isRequired,
//   filesLimit: PropTypes.number.isRequired,
// };

// MaterialDropZone.defaultProps = {
//   acceptedFiles: [],
//   showButton: true,
// };

MaterialDropZone.propTypes = {
  files: PropTypes.array.isRequired,
  acceptedFiles: PropTypes.array,
  showPreviews: PropTypes.bool.isRequired,
  showButton: PropTypes.bool,
  maxSize: PropTypes.number.isRequired,
  filesLimit: PropTypes.number, // Change here
  onFilesChange: PropTypes.func.isRequired, // Add this line to PropTypes
};

MaterialDropZone.defaultProps = {
  acceptedFiles: [],
  showButton: true,
  filesLimit: 1, // Set the default limit to 1
};


export default MaterialDropZone;
