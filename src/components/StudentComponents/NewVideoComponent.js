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

const NewVideoComponent = ({ courseId, subjectId }) => {
  const dispatch = useDispatch();
  const { list: recordings, loading, error, page, totalPages, limit } = useSelector((state) => state.studentRecordings);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchStudentRecordedClasses({ 
        token, 
        searchQuery: '', 
        page: 1, 
        limit: 10, 
        courseId, 
        subjectId 
      }));
    }
  }, [dispatch, courseId, subjectId]);

  // Debug: Log the data structure
  console.log('All recordings:', recordings);
  console.log('First recording:', recordings?.[0]);

  const handlePageChange = (event, newPage) => {
    const token = localStorage.getItem('accessToken');
    dispatch(fetchStudentRecordedClasses({ 
      token, 
      searchQuery: '', 
      page: newPage, 
      limit, 
      courseId, 
      subjectId 
    }));
  };

  const handlePlay = (videoUrl) => {
    const embedUrl = formatYoutubeUrl(videoUrl);
    setSelectedVideo(embedUrl);
  };

  // More flexible filtering for "new" recordings
  const newRecordings = recordings?.filter((rec) => {
    // Option 1: Check for 'new', 'isNew', or 'is_new' flag
    if (rec.new === true || rec.isNew === true || rec.is_new === true) return true;
    
    // Option 2: Check if created in the last 7 days
    const dateFields = ['created_at', 'r_created_at', 'createdAt', 'date_created'];
    for (let field of dateFields) {
      if (rec[field]) {
        const createdDate = new Date(rec[field]);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (createdDate > weekAgo) return true;
      }
    }
    
    // Option 3: For testing - show all recordings (remove this later)
    return true;
  }) || [];

  if (loading) return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>New</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Total recordings: {recordings?.length || 0} | Showing: {newRecordings.length}
      </Typography>
      
      {newRecordings.length > 0 ? (
        <>
          <Grid container spacing={2}>
            {newRecordings.map((rec) => (
              <Grid item xs={12} sm={6} md={4} key={rec.r_id || rec.id}>
                <Card sx={{ position: 'relative' }}>
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={rec.r_thumbnail ? `https://lunarsenterprises.com:6040/${rec.r_thumbnail}` : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDMwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTQwIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'}
                      alt={rec.r_title || rec.title || 'Video'}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDMwMCAxNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTQwIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                    <IconButton 
                      onClick={() => handlePlay(rec.r_video_url || rec.video_url || rec.url)}
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
                    <Typography variant="h6" noWrap>
                      {rec.r_title || rec.title || 'Untitled Video'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {rec.r_duration || rec.duration || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      By: {rec.r_tutor_name || rec.tutor_name || rec.instructor || 'Unknown'}
                    </Typography>
                    <Button 
                      startIcon={<AddIcon />} 
                      size="small" 
                      sx={{ mt: 1 }}
                    >
                      Add to playlist
                    </Button>
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
            No new recordings found.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {recordings?.length > 0 ? `${recordings.length} total recordings available` : 'No recordings loaded'}
          </Typography>
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
