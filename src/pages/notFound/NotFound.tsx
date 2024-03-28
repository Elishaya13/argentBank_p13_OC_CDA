
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store/store";


const NotFound = () => {
  const token = useSelector((state: RootState) => state.auth.token) as string;
  const link = token ? '/profile' : '/';

  console.log(token)

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to={link}>Go to {token ? 'Profile' : 'Home'}</Link>
    </div>
  );
};

export default NotFound;