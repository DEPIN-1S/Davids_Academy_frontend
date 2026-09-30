import { useSelector } from "react-redux";

// const ProtectedRoutes = ({ children, allowedRoles = [] }) => {
//   const { user } = useSelector((state) => state.user);

//   // Only check if user's role is allowed, without checking accessToken or user presence
//   if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
//     return <Navigate to="/" />; // or optionally a 403 Forbidden page
//   }

//   return children;
// };

// export default ProtectedRoutes;

const ProtectedRoutes = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.user);

  if (allowedRoles.length > 0 && (!user || !allowedRoles.includes(user.role))) {
    // Remove navigation redirect
    return null; // Or return some "Access Denied" component
  }

  return children;
};

export default ProtectedRoutes;
