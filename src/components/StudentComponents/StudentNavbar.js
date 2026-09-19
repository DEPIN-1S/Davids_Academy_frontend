import React from "react";
import { Box, Button, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { label: "My Q-Bank", path: "/student/question-bank" },
  { label: "Recorded Classes", path: "/student/recorded-class" },
  // { label: 'Notes', path: '/student/notes' },
  { label: " Mock Tests", path: "/student/tests" },
];
const StudentNavbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <Box
      className="student-nav-futuristic"
      sx={{
        backgroundColor: "transparent",
        borderRadius: { xs: "0 0 10px 10px", sm: "0 0 20px 20px" },
        padding: { xs: "0.5rem", sm: "0.75rem 1rem" },
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        overflowX: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        gap: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={isMobile ? 1 : 3}
        alignItems="center"
        width="100%"
        sx={{ minWidth: "max-content" }}
      >
        {navItems.map(({ label, path }) => {
          const isActive = location.pathname === path;

          return (
            <Button
              key={label}
              onClick={() => navigate(path)}
              fullWidth={isMobile}
              disableRipple
              sx={{
                textTransform: "none",
                backgroundColor: isActive ? "#67e8f9" : "transparent",
                color: isActive ? "#04121f" : "#c9d6ee",
                borderRadius: "12px",
                fontWeight: isActive ? 700 : 500,
                fontFamily: '"Outfit", "Inter", sans-serif',
                padding: { xs: "6px 10px", sm: "8px 16px" },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                justifyContent: "center",
                whiteSpace: "nowrap",
                "&:hover": {
                  backgroundColor: isActive ? "#67e8f9" : "rgba(34, 211, 238, 0.12)",
                },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default StudentNavbar;
