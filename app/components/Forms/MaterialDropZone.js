import React, { useState, useCallback, useEffect } from 'react';
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
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../../firebase.config.js';

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
  // const [fileURL, setfileURL] = useState("")

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
      filesVal.map((file, index) => {
        console.log(file);
        if (isImage(file)) {
          const imageRef = ref(storage, `/photo/${file.name}`);
          uploadBytes(imageRef, file).then(() => {
            getDownloadURL(imageRef).then(url => {
              console.log(url);
              previewImage(url);
              onFilesChange(url); // Update the parent state
            }).catch((error) => {
              console.error('Failed to get download URL', error);
            });
          }).catch((error) => {
            console.error('Failed to upload file', error);
          });
        }
      });
      setFiles(filesVal);
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

  // console.log(fileURL);

  // const Previews = ({ filesArray }) => filesArray.map((file, index) => {

  //   if (isImage(file)) {
  //     return (
  //       <div key={index.toString()}>
  //         {imageURL ? (
  //           <div className="imageContainer col fileIconImg">
  //             <figure className="imgWrap">
  //               <img className="smallPreviewImg" src={imageURL} alt="preview" />
  //             </figure>
  //             <DeleteBtn file={file} index={index} />
  //           </div>
  //         ) : (
  //           <p>Loading...</p> // Placeholder while loading the image URL
  //         )}
  //       </div>
  //     );
  //   }

  //   return (
  //     <div key={index.toString()}>
  //       <div className="imageContainer col fileIconImg">
  //         <FileIcon className="smallPreviewImg" alt="preview" />
  //         <DeleteBtn file={file} index={index} />
  //       </div>
  //     </div>
  //   );
  // });

  const previewImage = (imageURL) => {
    <div>
      {imageURL ? (
        <div className="imageContainer col fileIconImg">
          <figure className="imgWrap">
            <img className="smallPreviewImg" src={imageURL} alt="preview" />
          </figure>
          {/* <DeleteBtn file={image} index={index} /> */}
        </div>
      ) : (
        <p>Loading...</p> // Placeholder while loading the image URL
      )}
    </div>
  }

  // Previews.propTypes = { filesArray: PropTypes.array.isRequired };

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
      {/* <div className="row preview">
        {showPreviews && <Previews filesArray={files} />}
      </div> */}
      <Snackbar
        open={openSnackBar}
        message={errorMessage}
        autoHideDuration={4000}
        onClose={handleRequestCloseSnackBar}
      />
    </div>
  );
}

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
