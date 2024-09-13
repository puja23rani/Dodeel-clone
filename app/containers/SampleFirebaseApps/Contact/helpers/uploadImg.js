import dummy from 'enl-api/dummy/dummyContents';
import {
  getStorage, ref,
  uploadBytesResumable, getDownloadURL
} from 'firebase/storage';

const uploadImg = (file, callback) => {
  if (file === null || file === undefined || file === '') {
    callback(dummy.user.avatar);
    return;
  }

  const storage = getStorage();

  const metadata = { contentType: 'image/jpeg' };
  const uploadRef = ref(storage, 'images/' + file.name);
  const uploadTask = uploadBytesResumable(uploadRef, file, metadata);

  // Get the download URL
  uploadTask.on('state_changed',
    (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
        default:
          console.log('Upload is completed');
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          console.error('User doesn\'t have permission to access the object');
          break;
        case 'storage/canceled':
          console.error('User canceled the upload');
          break;
        default:
          console.error('Unknown error occurred, inspect error.serverResponse');
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        callback(downloadURL);
        console.log('File available at', downloadURL);
      });
    }
  );
};

export default uploadImg;
