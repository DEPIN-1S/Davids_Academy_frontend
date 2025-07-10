import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import { Box } from '@mui/material';

const DragDropQuestionComponent = () => {
const [value, setValue] = useState(0);
 return (
    <>
         <AppBar position="static">
         <Toolbar>
           <Typography variant="h6">Tutorial</Typography>
          {/* Add Logo and other elements as needed */}
         </Toolbar>
        </AppBar>
</>
  );
};

export default DragDropQuestionComponent;
