

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getQuestionData } from '../features/exam/examSlice';

const StyledDropZone = styled(Paper)(({ theme }) => ({
  minHeight: 120,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: '2px dashed #ccc',
  background: '#f9f9f9',
}));

function DragDropQuestionView() {
  const { questionId } = useParams();
  const dispatch = useDispatch();
  const { questionData, loading, error } = useSelector((state) => state.exam);

  useEffect(() => {
    if (questionId) {
      dispatch(getQuestionData(questionId));
    }
  }, [dispatch, questionId]);

  const [zones, setZones] = useState({});

  useEffect(() => {
    if (questionData?.data?.dropdownquestiontext) {
      // initialize empty arrays for each drop zone from API
      const newZones = {};
      questionData.data.dropdownquestiontext.forEach((zone) => {
        newZones[zone.id] = [];
      });
      setZones(newZones);
    }
  }, [questionData]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === 'source' && destination.droppableId !== 'source') {
      const dragged =
        questionData?.data?.dropdownquestiontext?.[0]?.dragdropoption[source.index];
      const newZone = [...zones[destination.droppableId], dragged];
      setZones({ ...zones, [destination.droppableId]: newZone });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={3}>
        {questionData?.data?.dropdownquestiontext?.[0]?.text || 'Loading...'}
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Target Zones from API */}
        <Grid container spacing={3} justifyContent="center" mb={4}>
          {(questionData?.data?.headings || []).map((heading) => (
            <Grid item xs={12} sm={6} md={3} key={heading.id}>
              <Typography fontWeight={600} mb={1} textAlign="center">
                {heading.headings}
              </Typography>
             <Droppable droppableId={heading.id.toString()}>
  {(dropProvided) => (
    <StyledDropZone ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
      {(zones[heading.id] || []).map((item, index) => (
        <Draggable
          key={item.id.toString()}
          draggableId={item.id.toString()}
          index={index}
        >
          {(dragProvided, snapshot) => (
            <Box
              ref={dragProvided.innerRef}
              {...dragProvided.draggableProps}
              {...dragProvided.dragHandleProps}
              sx={{
                backgroundColor: snapshot.isDragging ? '#e0f7fa' : '#fff',
                borderRadius: 1,
                p: 1,
                mb: 1,
                boxShadow: 1,
                fontSize: '0.9rem',
                minWidth: 300,
                maxWidth: '100%',
              }}
            >
              {item.options_value}
            </Box>
          )}
        </Draggable>
      ))}
      {dropProvided.placeholder}
    </StyledDropZone>
  )}
</Droppable>

            </Grid>
          ))}

        </Grid>

        {/* Source Items */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Options
          </Typography>
          <Droppable droppableId="source" direction="horizontal">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                display="flex"
                justifyContent="center"
                flexWrap="wrap"
                gap={2}
              >
                {(questionData?.data?.dropdownquestiontext?.[0]?.dragdropoption || []).map(
                  (item, index) => (
                    <Draggable
                      key={item.id.toString()}
                      draggableId={item.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: 1,
                            p: 1,
                            minWidth: 250,
                            textAlign: 'center',
                            fontSize: '0.9rem',
                            boxShadow: 1,
                          }}
                        >
                          {item.options_value}
                        </Box>
                      )}
                    </Draggable>
                  )
                )}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </Box>
      </DragDropContext>
      {/*  <Box textAlign="center">
        <Button variant="contained" sx={{ backgroundColor: '#f7c948', color: '#000' }}>
          Reveal Answer
        </Button>
      </Box> */}
    </Box>
  );
}

export default DragDropQuestionView;

