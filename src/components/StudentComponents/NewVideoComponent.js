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
  IconButton,
  TextField
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { fetchStudentRecordedClasses } from '../../features/recorded classes/studentRecordedClassSlice';

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
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11)
      return `https://www.youtube.com/embed/${match[2]}`;
    if (url.includes('embed')) return url;
    return url;
  }
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch)
      return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview`;
    return url;
  }
  return url;
};

const NewVideoGrid = () => {
  const dispatch = useDispatch();
  const {
    list: recordings,
    loading,
    error,
    page,
    totalPages,
    limit
  } = useSelector((state) => state.studentRecordings);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Initial load
  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      dispatch(fetchStudentRecordedClasses({ token, page: 1, limit: 12, searchQuery: "" }));
    }
  }, [dispatch, limit]);

  // Debounced search handler
  const handleSearch = (value) => {
    setSearchTerm(value);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      const token = sessionStorage.getItem('accessToken');
      dispatch(
        fetchStudentRecordedClasses({
          token,
          page: 1,
          limit: 12,
          searchQuery: value.trim(),
        })
      );
    }, 300);

    setTypingTimeout(timeout);
  };

  // Pagination handler
  const handlePageChange = (event, newPage) => {
    const token = sessionStorage.getItem('accessToken');
    dispatch(
      fetchStudentRecordedClasses({
        token,
        page: newPage,
        limit,
        searchQuery: searchTerm.trim(),
      })
    );
  };

  if (loading)
    return <CircularProgress sx={{ display: 'block', margin: '40px auto' }} />;

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div style={{ padding: '20px' }}>

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, maxWidth: 500, margin: '0 auto' }}>
        <TextField
          fullWidth
          placeholder="Search recorded classes..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            flex: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px 0 0 12px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              "& fieldset": { borderColor: "#b8b8b8" },
              "&:hover fieldset": { borderColor: "#2c3e50" },
              "&.Mui-focused fieldset": { borderColor: "#2c3e50", borderWidth: "2px" },
            },
            "& input": { padding: "18px 14px", fontSize: "15px" },
          }}
        />
        <IconButton
          color="primary"
          onClick={() => {
            const token = sessionStorage.getItem('accessToken');
            dispatch(
              fetchStudentRecordedClasses({
                token,
                page: 1,
                limit: 12,
                searchQuery: searchTerm.trim(),
              })
            );
          }}
          sx={{
            borderRadius: "0 12px 12px 0",
            backgroundColor: "#2c3e50",
            color: "#fff",
            "&:hover": { backgroundColor: "#1b2733" },
          }}
        >
          <SearchIcon />
        </IconButton>
      </Box>

      {recordings && recordings.length > 0 ? (
        <>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            paddingTop="50px"
          >
            {recordings.map((rec) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={rec.r_id}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    width: "100%",
                    maxWidth: 300,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: 2,
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 5,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', height: 200 }}>
                    <CardMedia
                      component="img"
                      image={`${process.env.REACT_APP_API_URL.replace('/davidsacademy', '')}${rec.r_thumbnail}`}
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
                      onClick={() => setSelectedVideo(formatVideoUrl(rec.r_video_url))}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.8)',
                        },
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
                      Tutor: {rec.r_tutor_name}
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
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'center',
              }}
            />
          )}
        </>
      ) : (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 4, textAlign: 'center' }}
        >
          No recordings found.
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
