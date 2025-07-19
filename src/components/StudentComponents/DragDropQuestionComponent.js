import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd';


const dragItems = [
  { id: 'item-1', content: 'Administer high-flow oxygen via a non-rebreather mask.' },
  { id: 'item-2', content: 'Administer high-flow oxygen via a non-rebreather mask.' },
  { id: 'item-3', content: 'Administer high-flow oxygen via a non-rebreather mask.' },
  { id: 'item-4', content: 'Administer high-flow oxygen via a non-rebreather mask.' },
];

const targetZones = [
  { id: 'drop-1', label: 'Action to take' },
  { id: 'drop-2', label: 'Parameter to Monitor' },
  { id: 'drop-3', label: 'Most likely experiencing' },
];

const StyledDropZone = styled(Paper)(({ theme }) => ({
  minHeight: 120,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  border: '2px dashed #ccc',
  background: '#f9f9f9',
}));

const DragDropQuestionComponent = () => {
  const [items, setItems] = useState(dragItems);
  const [zones, setZones] = useState({
    'drop-1': [],
    'drop-2': [],
    'drop-3': [],
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // dragging from items to zone
    if (source.droppableId === 'source' && destination.droppableId !== 'source') {
      const dragged = items[source.index];
      const newZone = [...zones[destination.droppableId], dragged];
      setZones({ ...zones, [destination.droppableId]: newZone });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h6" fontWeight={700} textAlign="center" mb={3}>
        Drag the actions into the appropriate categories
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3} justifyContent="center" mb={4}>
          {targetZones.map((zone) => (
            <Grid item xs={12} sm={6} md={3} key={zone.id}>
              <Typography fontWeight={600} mb={1} textAlign="center">
                {zone.label}
              </Typography>
              <Droppable droppableId={zone.id}>
                {(provided) => (
                  <StyledDropZone ref={provided.innerRef} {...provided.droppableProps}>
                    {zones[zone.id].map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              backgroundColor: '#fff',
                              borderRadius: 1,
                              p: 1,
                              mb: 1,
                              boxShadow: 1,
                              fontSize: '0.9rem',
                            }}
                          >
                            {item.content}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </StyledDropZone>
                )}
              </Droppable>
            </Grid>
          ))}
        </Grid>

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
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
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
                        {item.content}
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </Box>
      </DragDropContext>

      <Box textAlign="center">
        <Button variant="contained" sx={{ backgroundColor: '#f7c948', color: '#000' }}>
          Reveal Answer
        </Button>
      </Box>
    </Box>
  );
};

export default DragDropQuestionComponent;
