import { useContext, ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


type Props = {
  children: ReactElement;
}

const RequireAuth: React.FC<Props> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();

  if (authContext?.user) {
    return children;
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;