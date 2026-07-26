import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    IconButton,
    Checkbox,
    CircularProgress,
    TextField,
    InputAdornment,
    Pagination,
    useTheme,
    useMediaQuery,
    Tooltip,
    Menu,
    MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import { fetchStudentTopics } from '../../features/exam/examAPI';

/* ─── Keyframe animations injected as a <style> tag ────────────────────── */
const animationStyles = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.93); }
    to   { opacity: 1; transform: scale(1);    }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(249,171,0,0.45); }
    50%       { box-shadow: 0 0 0 8px rgba(249,171,0,0);  }
  }
  @keyframes checkBounce {
    0%   { transform: scale(0.6); }
    60%  { transform: scale(1.25); }
    100% { transform: scale(1);   }
  }
  @keyframes badgePop {
    0%   { transform: scale(0.7); opacity: 0; }
    70%  { transform: scale(1.15); }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes progressFlow {
    from { background-position: 0% 50%; }
    to   { background-position: 100% 50%; }
  }
  .topic-card {
    animation: fadeSlideIn 0.28s cubic-bezier(.22,.68,0,1.2) both;
  }
  .topic-card:nth-child(1) { animation-delay: 0.02s; }
  .topic-card:nth-child(2) { animation-delay: 0.07s; }
  .topic-card:nth-child(3) { animation-delay: 0.12s; }
  .topic-card:nth-child(4) { animation-delay: 0.17s; }
  .topic-card:nth-child(5) { animation-delay: 0.22s; }
  .badge-pop { animation: badgePop 0.35s cubic-bezier(.22,.68,0,1.2) both; }
`;

const CreateTestComponent = ({ handleClose }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const scrollRef = useRef(null);

    const [selectedTopics, setSelectedTopics] = useState([]);
    const [liveTopics, setLiveTopics] = useState([]);
    const [loadingTopics, setLoadingTopics] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [page, setPage] = useState(1);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [pageKey, setPageKey] = useState(0); // forces re-animation on page change
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
    const [sortAnchorEl, setSortAnchorEl] = useState(null);

    const handleSortMenuOpen = (event) => {
        setSortAnchorEl(event.currentTarget);
    };

    const handleSortMenuClose = () => {
        setSortAnchorEl(null);
    };

    const handleSortSelect = (order) => {
        setSortOrder(order);
        setSortAnchorEl(null);
        setPage(1);
        setPageKey(k => k + 1);
    };

    useEffect(() => {
        /* Inject keyframes into document head */
        const styleEl = document.createElement('style');
        styleEl.textContent = animationStyles;
        document.head.appendChild(styleEl);
        return () => document.head.removeChild(styleEl);
    }, []);

    useEffect(() => {
        const loadTopics = async () => {
            setLoadingTopics(true);
            try {
                const data = await fetchStudentTopics();
                setLiveTopics(data);
            } catch (err) {
                console.error('Failed to fetch topics', err);
            } finally {
                setLoadingTopics(false);
            }
        };
        loadTopics();
    }, []);

    const handleContainerScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const totalScrollable = scrollWidth - clientWidth;
            if (totalScrollable > 0) setScrollProgress(scrollLeft / totalScrollable);
        }
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', handleContainerScroll);
            return () => el.removeEventListener('scroll', handleContainerScroll);
        }
    }, [liveTopics]);

    const handleTopicToggle = (topic) => {
        setSelectedTopics(prev =>
            prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
        );
    };

    const handleCreateTest = () => {
        const topicsQuery = selectedTopics.join(',');
        let queryParams = `?mode=question-bank`;
        if (topicsQuery) queryParams += `&topics=${topicsQuery}`;
        navigate(`/student/exam${queryParams}`);
        if (handleClose) handleClose();
    };

    const getCategoryOfTopic = (topicItem) => {
        const d = typeof topicItem === 'string' ? topicItem : topicItem.topic_name;
        const first = d.split('-')[0].trim();
        return first.includes('&') ? first.split('&')[0].trim() : first;
    };

    const uniqueCategories = [...new Set(liveTopics.map(getCategoryOfTopic))].sort((a, b) => a.localeCompare(b));
    const categories = ['All', ...uniqueCategories];

    const sortedTopics = [...liveTopics].sort((a, b) => {
        const dA = typeof a === 'string' ? a : a.topic_name;
        const dB = typeof b === 'string' ? b : b.topic_name;
        if (sortOrder === 'desc') {
            return dB.localeCompare(dA);
        }
        return dA.localeCompare(dB);
    });

    const filteredTopics = sortedTopics.filter(topicItem => {
        const d = typeof topicItem === 'string' ? topicItem : topicItem.topic_name;
        if (!d.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (activeCategory === 'All') return true;
        return getCategoryOfTopic(topicItem) === activeCategory;
    });

    const itemsPerPage = 5;
    const totalPages = Math.ceil(filteredTopics.length / itemsPerPage);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTopics = filteredTopics.slice(startIndex, startIndex + itemsPerPage);

    const pageSelectableTopics = paginatedTopics.filter(t => !(typeof t === 'object' && t.is_completed));
    const pageSelectableIds = pageSelectableTopics.map(t => typeof t === 'string' ? t : t.topic_id);
    const isAllSelectedOnPage = pageSelectableIds.length > 0 && pageSelectableIds.every(id => selectedTopics.includes(id));

    const handleSelectAllOnPageToggle = () => {
        if (isAllSelectedOnPage) {
            setSelectedTopics(prev => prev.filter(id => !pageSelectableIds.includes(id)));
        } else {
            setSelectedTopics(prev => {
                const next = [...prev];
                pageSelectableIds.forEach(id => { if (!next.includes(id)) next.push(id); });
                return next;
            });
        }
    };

    const handleScroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: direction === 'left' ? -150 : 150, behavior: 'smooth' });
        }
    };

    const handlePageChange = (e, value) => {
        setPage(value);
        setPageKey(k => k + 1);
    };

    const canStart = selectedTopics.length > 0;

    /* ─── Colour tokens ──────────────────────────────────────────────── */
    const blue = '#1A73E8';
    const bluePale = '#E8F0FE';
    const gold = '#F9AB00';
    const goldDark = '#E09200';

    return (
        <Box sx={{
            p: { xs: 2, sm: 3 },
            width: '100%',
            position: 'relative',
            bgcolor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: { xs: '92vh', sm: '88vh' },
            overflow: 'hidden',
        }}>

            {/* ── Gradient accent bar at top ────────────────────────────── */}
            <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${blue}, #8AB4F8, ${gold}, ${blue})`,
                backgroundSize: '200% auto',
                animation: 'shimmer 3s linear infinite'
            }} />

            {/* ═══════════════════ FIXED HEADER ═══════════════════════════ */}
            <Box sx={{ flexShrink: 0, pt: 1 }}>

                {/* Title row */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            width: 40, height: 40, borderRadius: '12px',
                            background: `linear-gradient(135deg, ${bluePale}, #C5D9FA)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(26,115,232,0.15)'
                        }}>
                            <FormatListBulletedIcon sx={{ color: blue, fontSize: '20px' }} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight={800} color="text.primary" sx={{ lineHeight: 1.2, letterSpacing: '-0.3px' }}>
                                Select topics
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>
                                Choose topics for your question bank session
                            </Typography>
                        </Box>
                    </Box>

                    {/* Close */}
                    <IconButton onClick={handleClose} size="small" sx={{
                        bgcolor: '#F5F5F5', color: 'text.secondary', width: 32, height: 32,
                        transition: 'all 0.25s',
                        '&:hover': { bgcolor: '#FFEBEE', color: '#D32F2F', transform: 'rotate(90deg)' }
                    }}>
                        <CloseIcon sx={{ fontSize: '18px' }} />
                    </IconButton>
                </Box>

                {/* Search + Sort Bar */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                    <TextField
                        placeholder="Search topics..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={e => { setSearchQuery(e.target.value); setPage(1); setPageKey(k => k + 1); }}
                        fullWidth
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '14px',
                                bgcolor: '#F8F9FA',
                                transition: 'all 0.2s',
                                '& fieldset': { borderColor: '#EBEBEB' },
                                '&:hover fieldset': { borderColor: '#DADCE0' },
                                '&.Mui-focused': {
                                    bgcolor: '#FFFFFF',
                                    '& fieldset': { borderColor: blue, borderWidth: '2px' }
                                },
                            },
                            '& input': { fontSize: '14px', py: 1.1, '&::placeholder': { color: '#9AA0A6' } }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#9AA0A6', fontSize: '19px' }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Sort button */}
                    <Tooltip title="Sort topics" arrow>
                        <Button
                            onClick={handleSortMenuOpen}
                            variant="outlined"
                            size="small"
                            startIcon={<SortByAlphaIcon sx={{ fontSize: '18px', color: blue }} />}
                            sx={{
                                borderRadius: '14px',
                                height: '40px',
                                px: 1.8,
                                minWidth: 'auto',
                                whiteSpace: 'nowrap',
                                borderColor: '#EBEBEB',
                                color: '#3C4043',
                                bgcolor: '#F8F9FA',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '13px',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: blue,
                                    bgcolor: bluePale,
                                    color: blue,
                                }
                            }}
                        >
                            {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
                        </Button>
                    </Tooltip>

                    <Menu
                        anchorEl={sortAnchorEl}
                        open={Boolean(sortAnchorEl)}
                        onClose={handleSortMenuClose}
                        PaperProps={{
                            elevation: 3,
                            sx: {
                                borderRadius: '12px',
                                mt: 1,
                                minWidth: '160px',
                                p: 0.5,
                                '& .MuiMenuItem-root': {
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    borderRadius: '8px',
                                    py: 1,
                                    px: 1.5,
                                    color: '#3C4043',
                                    '&.Mui-selected': {
                                        bgcolor: bluePale,
                                        color: blue,
                                        fontWeight: 700,
                                        '&:hover': { bgcolor: bluePale }
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem
                            selected={sortOrder === 'asc'}
                            onClick={() => handleSortSelect('asc')}
                        >
                            A → Z (Ascending)
                        </MenuItem>
                        <MenuItem
                            selected={sortOrder === 'desc'}
                            onClick={() => handleSortSelect('desc')}
                        >
                            Z → A (Descending)
                        </MenuItem>
                    </Menu>
                </Box>

                {/* Category chips + scroll */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <IconButton size="small" onClick={() => handleScroll('left')}
                        sx={{ p: 0.5, color: 'grey.500', '&:hover': { color: blue, bgcolor: bluePale } }}>
                        <ChevronLeft sx={{ fontSize: '18px' }} />
                    </IconButton>

                    <Box
                        ref={scrollRef}
                        sx={{
                            flex: 1,
                            display: 'flex', gap: 1,
                            overflowX: 'auto', scrollBehavior: 'smooth', py: 0.5,
                            '&::-webkit-scrollbar': { display: 'none' },
                            msOverflowStyle: 'none', scrollbarWidth: 'none',
                        }}
                    >
                        {categories.map(cat => {
                            const active = cat === activeCategory;
                            return (
                                <Button
                                    key={cat}
                                    onClick={() => { setActiveCategory(cat); setPage(1); setPageKey(k => k + 1); }}
                                    disableElevation
                                    sx={{
                                        borderRadius: '20px',
                                        textTransform: 'none',
                                        whiteSpace: 'nowrap',
                                        px: 2,
                                        py: 0.4,
                                        minWidth: 'auto',
                                        fontSize: '13px',
                                        fontWeight: active ? 700 : 500,
                                        bgcolor: active ? blue : '#F1F3F4',
                                        color: active ? '#FFFFFF' : '#3C4043',
                                        border: 'none',
                                        transition: 'all 0.2s cubic-bezier(.22,.68,0,1.2)',
                                        transform: active ? 'scale(1.06)' : 'scale(1)',
                                        boxShadow: active ? `0 4px 12px rgba(26,115,232,0.3)` : 'none',
                                        '&:hover': {
                                            bgcolor: active ? '#1557B0' : '#E8EAED',
                                            transform: 'scale(1.05)',
                                            boxShadow: active ? `0 4px 14px rgba(26,115,232,0.35)` : '0 2px 8px rgba(0,0,0,0.08)'
                                        }
                                    }}
                                >
                                    {cat}
                                </Button>
                            );
                        })}
                    </Box>

                    <IconButton size="small" onClick={() => handleScroll('right')}
                        sx={{ p: 0.5, color: 'grey.500', '&:hover': { color: blue, bgcolor: bluePale } }}>
                        <ChevronRight sx={{ fontSize: '18px' }} />
                    </IconButton>
                </Box>

                {/* Scroll progress bar */}
                <Box sx={{ height: '3px', bgcolor: '#EBEBEB', borderRadius: '2px', mb: 2, mx: 3, overflow: 'hidden' }}>
                    <Box sx={{
                        height: '100%',
                        width: '30%',
                        ml: `${scrollProgress * 70}%`,
                        background: `linear-gradient(90deg, ${blue}, #8AB4F8)`,
                        borderRadius: '2px',
                        transition: 'margin-left 0.15s ease-out'
                    }} />
                </Box>

                {/* Select-all + selected badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, px: 0.5 }}>
                    <Box
                        onClick={handleSelectAllOnPageToggle}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', userSelect: 'none',
                            borderRadius: '8px', px: 1, py: 0.5,
                            transition: 'all 0.15s',
                            '&:hover': { bgcolor: '#F5F5F5' }
                        }}
                    >
                        <Checkbox
                            checked={isAllSelectedOnPage}
                            disableRipple
                            sx={{
                                p: 0,
                                color: '#DADCE0',
                                '&.Mui-checked': { color: blue },
                                '& .MuiSvgIcon-root': { fontSize: '20px' }
                            }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#5F6368', fontSize: '13px' }}>
                            Select all on this page
                        </Typography>
                    </Box>

                    {canStart && (
                        <Box key={selectedTopics.length} className="badge-pop" sx={{
                            display: 'flex', alignItems: 'center', gap: 0.6,
                            bgcolor: bluePale, color: blue,
                            px: 1.6, py: 0.5, borderRadius: '20px',
                            fontWeight: 700, fontSize: '13px',
                            border: `1.5px solid ${blue}22`,
                        }}>
                            <CheckCircleIcon sx={{ fontSize: '15px' }} />
                            {selectedTopics.length} selected
                        </Box>
                    )}
                </Box>
            </Box>

            {/* ═══════════════ SCROLLABLE TOPIC LIST ══════════════════════ */}
            <Box sx={{
                flex: 1, overflowY: 'auto', pr: 0.5, my: 0.5,
                '&::-webkit-scrollbar': { width: '5px' },
                '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                '&::-webkit-scrollbar-thumb': {
                    bgcolor: '#E0E0E0', borderRadius: '4px',
                    '&:hover': { bgcolor: '#BDBDBD' }
                }
            }}>
                {loadingTopics ? (
                    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={6} gap={2}>
                        <CircularProgress size={32} thickness={4} sx={{ color: blue }} />
                        <Typography variant="body2" color="text.secondary">Loading topics...</Typography>
                    </Box>
                ) : filteredTopics.length === 0 ? (
                    <Box textAlign="center" py={5}>
                        <SearchIcon sx={{ fontSize: '48px', color: '#DADCE0', mb: 1 }} />
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            {liveTopics.length === 0 ? 'No topics available.' : 'No topics match your search.'}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                            Try a different search or category
                        </Typography>
                    </Box>
                ) : (
                    <Box key={pageKey} sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                        {paginatedTopics.map((topicItem, index) => {
                            const topicDisplay = typeof topicItem === 'string' ? topicItem : topicItem.topic_name;
                            const topicValue = typeof topicItem === 'string' ? topicItem : topicItem.topic_id;
                            const isCompleted = typeof topicItem === 'object' && topicItem.is_completed;
                            const isSelected = selectedTopics.includes(topicValue) && !isCompleted;

                            return (
                                <Paper
                                    key={`topic-${topicValue}-${index}`}
                                    className="topic-card"
                                    elevation={0}
                                    onClick={() => { if (!isCompleted) handleTopicToggle(topicValue); }}
                                    sx={{
                                        p: '14px 16px',
                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                        cursor: isCompleted ? 'default' : 'pointer',
                                        border: '1.5px solid',
                                        borderColor: isCompleted
                                            ? '#66BB6A'
                                            : isSelected ? blue : '#EBEBEB',
                                        bgcolor: isCompleted
                                            ? '#F1F8F1'
                                            : isSelected ? bluePale : '#FAFAFA',
                                        borderRadius: '14px',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        transition: 'all 0.22s cubic-bezier(.22,.68,0,1.2)',
                                        transform: isSelected ? 'translateX(4px)' : 'translateX(0)',
                                        boxShadow: isSelected
                                            ? `0 4px 16px rgba(26,115,232,0.15)`
                                            : '0 1px 3px rgba(0,0,0,0.04)',
                                        '&:hover': !isCompleted ? {
                                            borderColor: isSelected ? blue : '#BDBDBD',
                                            bgcolor: isSelected ? '#DAE9FD' : '#F3F4F6',
                                            transform: 'translateX(4px)',
                                            boxShadow: isSelected
                                                ? '0 6px 20px rgba(26,115,232,0.2)'
                                                : '0 4px 12px rgba(0,0,0,0.06)'
                                        } : {}
                                    }}
                                >
                                    {/* Left accent bar when selected */}
                                    {isSelected && (
                                        <Box sx={{
                                            position: 'absolute', left: 0, top: 0, bottom: 0,
                                            width: '4px', bgcolor: blue, borderRadius: '14px 0 0 14px'
                                        }} />
                                    )}

                                    {/* Checkbox */}
                                    <Box sx={{
                                        flexShrink: 0,
                                        transition: 'transform 0.25s cubic-bezier(.22,.68,0,1.2)',
                                        transform: isSelected ? 'scale(1)' : 'scale(0.95)',
                                    }}>
                                        {isCompleted ? (
                                            <EmojiEventsIcon sx={{ color: '#66BB6A', fontSize: '22px' }} />
                                        ) : isSelected ? (
                                            <CheckCircleIcon sx={{
                                                color: blue, fontSize: '22px',
                                                animation: 'checkBounce 0.3s cubic-bezier(.22,.68,0,1.2)'
                                            }} />
                                        ) : (
                                            <RadioButtonUncheckedIcon sx={{ color: '#DADCE0', fontSize: '22px' }} />
                                        )}
                                    </Box>

                                    {/* Topic name */}
                                    <Typography
                                        variant="body2"
                                        fontWeight={isSelected || isCompleted ? 600 : 500}
                                        color={isSelected ? blue : isCompleted ? '#388E3C' : 'text.primary'}
                                        sx={{
                                            flex: 1,
                                            fontSize: { xs: '13px', sm: '14px' },
                                            wordBreak: 'break-word',
                                            lineHeight: 1.45,
                                            transition: 'color 0.2s'
                                        }}
                                    >
                                        {topicDisplay}
                                    </Typography>

                                    {/* Completed badge */}
                                    {isCompleted && (
                                        <Box sx={{
                                            flexShrink: 0,
                                            bgcolor: '#E8F5E9', color: '#2E7D32',
                                            px: 1.2, py: 0.3,
                                            borderRadius: '10px',
                                            fontSize: '11px', fontWeight: 700,
                                            border: '1px solid #C8E6C9'
                                        }}>
                                            Done ✓
                                        </Box>
                                    )}
                                </Paper>
                            );
                        })}
                    </Box>
                )}
            </Box>

            {/* ═══════════════════ FIXED FOOTER ════════════════════════════ */}
            <Box sx={{ flexShrink: 0, mt: 'auto' }}>

                {/* Pagination */}
                {filteredTopics.length > 0 && totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5, mb: 2 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            size={isMobile ? 'small' : 'medium'}
                            siblingCount={isMobile ? 0 : 1}
                            boundaryCount={isMobile ? 1 : 2}
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    fontWeight: 600,
                                    fontSize: '13px',
                                    borderRadius: '10px',
                                    border: '1.5px solid #EBEBEB',
                                    bgcolor: '#FAFAFA',
                                    transition: 'all 0.18s',
                                    '&:hover': { bgcolor: bluePale, borderColor: `${blue}55`, color: blue },
                                    '&.Mui-selected': {
                                        background: `linear-gradient(135deg, ${blue}, #4285F4) !important`,
                                        color: '#FFFFFF !important',
                                        borderColor: `${blue} !important`,
                                        boxShadow: `0 4px 12px rgba(26,115,232,0.35)`,
                                    }
                                }
                            }}
                        />
                    </Box>
                )}

                {/* Divider */}
                <Box sx={{ height: '1px', bgcolor: '#F0F0F0', mb: 2 }} />

                {/* Action buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                        onClick={handleClose}
                        sx={{
                            color: '#5F6368', fontWeight: 600,
                            textTransform: 'none', fontSize: '14px',
                            borderRadius: '10px', px: 2.5, py: 1,
                            transition: 'all 0.18s',
                            '&:hover': {
                                bgcolor: '#F5F5F5', color: '#202124',
                                transform: 'translateX(-2px)'
                            }
                        }}
                    >
                        Cancel
                    </Button>

                    <Tooltip
                        title={canStart ? '' : 'Select at least one topic to start'}
                        arrow
                        placement="top"
                    >
                        <span>
                            <Button
                                variant="contained"
                                onClick={handleCreateTest}
                                disabled={!canStart}
                                disableElevation
                                sx={{
                                    background: canStart
                                        ? `linear-gradient(135deg, ${gold} 0%, ${goldDark} 100%)`
                                        : '#EEEEEE',
                                    color: canStart ? '#1A1A1A' : '#BDBDBD',
                                    fontWeight: 700,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontSize: '14px',
                                    px: 3.5, py: 1.1,
                                    letterSpacing: '0.2px',
                                    transition: 'all 0.25s cubic-bezier(.22,.68,0,1.2)',
                                    animation: canStart ? 'glowPulse 2s infinite' : 'none',
                                    transform: canStart ? 'scale(1)' : 'scale(0.97)',
                                    '&:hover': canStart ? {
                                        background: `linear-gradient(135deg, ${goldDark} 0%, #C97E00 100%)`,
                                        transform: 'scale(1.04) translateY(-1px)',
                                        boxShadow: `0 8px 24px rgba(249,171,0,0.45)`
                                    } : {},
                                    '&.Mui-disabled': {
                                        background: '#EEEEEE',
                                        color: '#BDBDBD'
                                    }
                                }}
                            >
                                {canStart
                                    ? `Start test (${selectedTopics.length}) →`
                                    : 'Start test →'
                                }
                            </Button>
                        </span>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateTestComponent;
