import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import GetAppOutlinedIcon from '@mui/icons-material/GetAppOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import JavascriptIcon from '@mui/icons-material/Javascript';
import CssIcon from '@mui/icons-material/Css';
import HtmlIcon from '@mui/icons-material/Html';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import PhpIcon from '@mui/icons-material/Php';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { Box, Skeleton,TextField } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Files() {
  const [fileData, setFileData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Fetch data using fetch API
    fetch('https://quick-share-cors.vercel.app/getallfiles')
      .then(response => response.json())
      .then(data => {
        setFileData((data.files).reverse());
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleDeleteClick = (fileId) => {
    fetch(`https://quick-share-cors.vercel.app/deletefile?id=${fileId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      setSnackbarMessage(data.message);
      setSnackbarOpen(true);
      // Update file list by filtering out the deleted file
      setFileData(prevFileData => prevFileData.filter(file => file._id !== fileId));
    })
    .catch(error => {
      console.error('Error deleting file:', error);
    });
  };

  const getIconForFileType = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <ImageOutlinedIcon sx={{ fontSize: 65 }} />;
    } else if (fileType === 'application/pdf') {
      return <PictureAsPdfOutlinedIcon sx={{ fontSize: 65 }} />;
    } else if (fileType.startsWith('video/')) {
      return <MovieOutlinedIcon sx={{ fontSize: 65 }} />;
    } else if (fileType.startsWith('audio/')) {
      return <MusicNoteOutlinedIcon sx={{ fontSize: 65 }} />;
    } else if (fileType === 'text/javascript') {
      return <JavascriptIcon sx={{ fontSize: 65 }} />;
    } else if (fileType === 'text/css') {
      return <CssIcon sx={{ fontSize: 65 }} />;
    } else if (fileType === 'text/html') {
      return <HtmlIcon sx={{ fontSize: 65 }} />;
    } else if (fileType === 'text/java') {
      return <CodeOutlinedIcon sx={{ fontSize: 65 }} />;
    } else if (fileType === 'text/python') {
      return <CodeOutlinedIcon sx={{ fontSize: 65 }} />;
    } else if (fileType === 'text/cpp' || fileType === 'text/c') {
      return <CodeOutlinedIcon sx={{ fontSize: 65 }} />;
    } else if (fileType === 'text/php') {
      return <PhpIcon sx={{ fontSize: 65 }} />;
    } else if (fileType === 'application/x-zip-compressed') {
      return <FolderZipOutlinedIcon sx={{ fontSize: 65 }} />;
    } else {
      return <InsertDriveFileOutlinedIcon sx={{ fontSize: 65 }} />;
    }
  };

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Asia/Kolkata',
    hour12: true,
  };

  return (
    <div style={{ marginInline: '10px', marginTop: '90px', marginBottom: '90px' }}>
    {loading ? (
      // Display skeleton loading components while data is loading
      Array.from({ length: 5 }).map((_, index) => (
        <Card key={index} sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }} elevation={3}>
          <CardContent>
            <Typography variant="body1">
              <Skeleton width={'100%'} />
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton variant="circle" width={65} height={65} />
              <Box sx={{ marginLeft: 2 }}>
                <Typography variant="body2">
                  <Skeleton width={100} />
                </Typography>
                <Typography variant="body2">
                  <Skeleton width={60} />
                </Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            <IconButton disabled>
              <DeleteOutlinedIcon />
            </IconButton>
            <IconButton disabled>
              <GetAppOutlinedIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))
    ) : (
      // Display content when data is available
      fileData.map(file => (
        <Card key={file._id} sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }} elevation={3}>
          <CardContent>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black', width: '100%' }}>
              {file.fileDescription}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {getIconForFileType(file.fileType)}
              <Box sx={{ marginLeft: 2 }}>
                <Typography variant="body2" sx={{ color: 'grey' }}>{new Date(file.uploadedDate).toLocaleString('en-IN', options)}</Typography>
                <Typography variant="body2" sx={{ color: 'grey' }}>{(file.fileSize / 1024).toFixed(2)} KB</Typography>
              </Box>
            </Box>
          </CardContent>
          <CardActions>
            {/* Delete Button */}
            <IconButton color="error" onClick={() => handleDeleteClick(file._id)}>
              <DeleteOutlinedIcon />
            </IconButton>

            {/* Download Button */}
            <a href={file.fileUrl} rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <IconButton
              color="primary"
              
            > 
              <GetAppOutlinedIcon />
            </IconButton>
            </a>
          </CardActions>
        </Card>
      ))
    )}
    {/* Snackbar for showing success message */}
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={500}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={() => setSnackbarOpen(false)}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={() => setSnackbarOpen(false)}
        severity="success"
      >
        {snackbarMessage}
      </MuiAlert>
    </Snackbar>
  </div>
  );
}

export default Files;