import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
  Modal,
  Box,
  IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { fetchStudentRecordedClasses } from '../../features/recorded classes/studentRecordedClassSlice';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";

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

const formatVideoUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube')) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return `https://www.youtube.com/embed/${match[2]}`;
    if (url.includes('embed')) return url;
    return url;
  }
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch) return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview`;
    return url;
  }
  return url;
};

const NewVideoGrid = () => {
  const dispatch = useDispatch();
  const { list: recordings, loading, error, page, totalPages, limit } = useSelector(
    (state) => state.studentRecordings
  );

  console.log("🎥 Recordings Data:", recordings);

  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchStudentRecordedClasses({ token, page: 1, limit: 12 }));
    }
  }, [dispatch, limit]);

  const handlePageChange = (event, newPage) => {
    const token = sessionStorage.getItem('accessToken');
    dispatch(fetchStudentRecordedClasses({ token, page: newPage, limit }));
  };

  const handlePlay = (videoUrl) => {
    setSelectedVideo(formatVideoUrl(videoUrl));
  };

  if (loading)
    return <CircularProgress sx={{ display: 'block', margin: '40px auto' }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div style={{ padding: '20px' }}>
      <Typography py={3} variant="h5" fontWeight={600} gutterBottom>
        Recorded Classes
      </Typography>

      {recordings && recordings.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {recordings.map((rec) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={rec.r_id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    width: '100%',
                    maxWidth: 330,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    boxShadow: 2,
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 5,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', height: 200 }}>
                    <CardMedia
                      component="img"
                      image={`https://lunarsenterprises.com:6040${rec.r_thumbnail}`}
                      alt={rec.r_title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjVmNWY1Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+Cg==';
                      }}
                    />
                    <IconButton
                      onClick={() => handlePlay(rec.r_video_url)}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                      }}
                    >
                      <PlayArrowIcon fontSize="large" />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ px: 1 }}>
                    <Typography variant="subtitle1" noWrap>
                      {rec.r_title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" noWrap>
                      Tutor Name : {rec.r_tutor_name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" display="block">
                      Duration: {rec.r_duration}
                    </Typography>

                    {rec.r_record_date && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Date: {new Date(rec.r_record_date).toLocaleDateString('en-IN')}
                      </Typography>
                    )}
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
              sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}
            />
          )}
        </>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 4, textAlign: 'center' }}
        >
          No recordings available.
        </Typography>
      )}

      {/* Video Modal */}
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

export default NewVideoGrid;
