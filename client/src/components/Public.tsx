import { useContext, ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";


type Props = {
  children: ReactElement;
}

const Public: React.FC<Props> = ({ children }) => {
  const authContext = useContext(AuthContext);
  const location = useLocation();
  
  if (!authContext?.user || location.pathname === "/register") {
    return children;
  } else {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
};

export default Public;