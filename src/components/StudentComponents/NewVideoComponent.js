import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentRecordedClasses } from '../../features/recorded classes/studentRecordedClassSlice';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  Modal,
  Box,
  IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  outline: 'none',
  borderRadius: 2,
};

const formatYoutubeUrl = (url) => {
  if (!url) return '';

  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  if (url.includes('embed')) return url;
  return url;
};

const NewVideoComponent = () => {
  const dispatch = useDispatch();
  const { list: recordings, loading, error, page, totalPages, limit } = useSelector((state) => state.studentRecordings);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {

      dispatch(fetchStudentRecordedClasses({
        token,
        page: 1,
        limit: 10
      }));
    }
  }, [dispatch]);

  const handlePageChange = (event, newPage) => {
    const token = sessionStorage.getItem('accessToken');
    dispatch(fetchStudentRecordedClasses({
      token,
      page: newPage,
      limit
    }));
  };

  const handlePlay = (videoUrl) => {
    const embedUrl = formatYoutubeUrl(videoUrl);
    setSelectedVideo(embedUrl);
  };
  // Filter for new recordings (created in last 7 days)
  const newRecordings = recordings?.filter((rec) => {
    if (rec.r_created_at) {
      const createdDate = new Date(rec.r_created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }
    return true; // Show all if no date
  }) || [];

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>New</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Total recordings: {recordings?.length || 0} | New this week: {newRecordings.length}
      </Typography>

      {newRecordings.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {newRecordings.map((rec) => (
              <Grid item xs={12} sm={6} md={4} key={rec.r_id}>
                <Card sx={{ position: 'relative' }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`${process.env.BASE_URL}${rec.r_thumbnail}`}
                      alt={rec.r_title}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDMwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTQwIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                    <IconButton
                      onClick={() => handlePlay(rec.r_video_url)}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        }
                      }}
                    >
                      <PlayArrowIcon fontSize="large" />
                    </IconButton>
                  </Box>
                  <CardContent>
                    <Typography variant="h6" noWrap>{rec.r_title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {rec.r_duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      By: {rec.r_tutor_name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created: {new Date(rec.r_created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {recordings?.length > 0 ? 'No new recordings this week.' : 'No recordings found.'}
          </Typography>
          {recordings?.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {recordings.length} total recordings available (all older than 7 days)
            </Typography>
          )}
        </Box>
      )}

      <Modal open={!!selectedVideo} onClose={() => setSelectedVideo(null)}>
        <Box sx={modalStyle}>
          <IconButton
            onClick={() => setSelectedVideo(null)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <iframe
            width="100%"
            height="450"
            src={selectedVideo}
            frameBorder="0"
            allowFullScreen
            title="Video Player"
            style={{ borderRadius: 8 }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default NewVideoComponent;
