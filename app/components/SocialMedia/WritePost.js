import React, { useState } from "react";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Send from "@mui/icons-material/Send";
import Fab from "@mui/material/Fab";
import MenuItem from "@mui/material/MenuItem";
import ActionDelete from "@mui/icons-material/Delete";
import FormControl from "@mui/material/FormControl";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import dummy from "enl-api/dummy/dummyContents";
import { injectIntl, FormattedMessage } from "react-intl";
import useStyles from "./jss/writePost-jss";
import messages from "./messages";

function isImage(file) {
  const fileName = file.name || file.path;
  const suffix = fileName.substr(fileName.indexOf(".") + 1).toLowerCase();
  if (
    suffix === "jpg" ||
    suffix === "jpeg" ||
    suffix === "bmp" ||
    suffix === "png"
  ) {
    return true;
  }
  return false;
}

function WritePost(props) {
  const [privacy, setPrivacy] = useState("public");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const { submitPost, intl } = props;
  const { classes, cx } = useStyles();

  const onDrop = (filesVal) => {
    let oldFiles = files;
    const filesLimit = 2;
    oldFiles = oldFiles.concat(filesVal);
    if (oldFiles.length > filesLimit) {
      //console.log('Cannot upload more than ' + filesLimit + ' items.');
    } else {
      setFiles(filesVal);
    }
  };

  const handleChange = (event) => {
    setPrivacy(event.target.value);
  };

  const handleWrite = (event) => {
    setMessage(event.target.value);
  };

  const handlePost = (messageParam, filesParam, privacyParam) => {
    // Submit Post to reducer
    submitPost(messageParam, filesParam, privacyParam);
    // Reset all fields
    setPrivacy("public");
    setFiles([]);
    setMessage("");
  };

  const handleRemove = (file, fileIndex) => {
    const thisFiles = files;
    // This is to prevent memory leaks.
    window.URL.revokeObjectURL(file.preview);

    thisFiles.splice(fileIndex, 1);
    setFiles(thisFiles);
  };

  let dropzoneRef;
  const acceptedFiles = ["image/jpeg", "image/png", "image/bmp"];
  const fileSizeLimit = 3000000;
  const deleteBtn = (file, index) => (
    <div className={cx(classes.removeBtn, "middle")}>
      <IconButton onClick={() => handleRemove(file, index)} size="large">
        <ActionDelete className="removeBtn" />
      </IconButton>
    </div>
  );
  const previews = (filesArray) =>
    filesArray.map((file, index) => {
      const path = URL.createObjectURL(file) || "/pic" + file.path;
      if (isImage(file)) {
        return (
          <div key={index.toString()}>
            <figure>
              <img src={path} alt="preview" />
            </figure>
            {deleteBtn(file, index)}
          </div>
        );
      }
      return false;
    });
  return (
    <div className={classes.statusWrap}>
      <Paper className={classes.inputMessage}>
        <Avatar
          alt="avatar"
          src={dummy.user.avatar}
          className={classes.avatarMini}
        />
        <textarea
          row="2"
          placeholder={intl.formatMessage(messages.placeholder)}
          value={message}
          onChange={handleWrite}
        />
        <Dropzone
          className={classes.hiddenDropzone}
          accept={acceptedFiles.join(",")}
          acceptClassName="stripes"
          onDrop={onDrop}
          maxSize={fileSizeLimit}
          ref={(node) => {
            dropzoneRef = node;
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
        <div className={classes.preview}>{previews(files)}</div>
        <div className={classes.control}>
          <Tooltip
            id="tooltip-upload"
            title={intl.formatMessage(messages.upload)}
          >
            <IconButton
              className={classes.button}
              component="button"
              onClick={() => {
                dropzoneRef.open();
              }}
              size="large"
            >
              <PhotoCamera />
            </IconButton>
          </Tooltip>
          <div className={classes.privacy}>
            <FormControl variant="standard" className={classes.formControl}>
              <Select
                variant="standard"
                value={privacy}
                onChange={handleChange}
                name="privacy"
                className={classes.selectEmpty}
              >
                <MenuItem value="public">
                  <FormattedMessage {...messages.public} />
                </MenuItem>
                <MenuItem value="friends">
                  <FormattedMessage {...messages.friends} />
                </MenuItem>
                <MenuItem value="private">
                  <FormattedMessage {...messages.only_me} />
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <Tooltip id="tooltip-post" title={intl.formatMessage(messages.post)}>
            <Fab
              onClick={() => handlePost(message, files, privacy)}
              size="small"
              color="secondary"
              aria-label="send"
              className={classes.sendBtn}
            >
              <Send />
            </Fab>
          </Tooltip>
        </div>
      </Paper>
    </div>
  );
}

WritePost.propTypes = {
  submitPost: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(WritePost);
