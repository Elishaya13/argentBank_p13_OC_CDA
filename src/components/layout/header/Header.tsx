import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/argentBankLogo.png';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/authSlice';
import { RootState } from '../../../store/store';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.user);
  const [isLogged, setIsLogged] = useState(false);

  /* Change l'etat de isLogged si un token d'auth existe  */
  useEffect(() => {
    if (token !== null) {
      setIsLogged(true);
      navigate('/profile');
    } else {
      setIsLogged(false);
    }
  }, [navigate, token]);

  /* Deconnecte l'utilisateur et change l'etat de isLogged */
  const SignOut = () => {
    dispatch(logout());
    setIsLogged(false);
  };

  return (
    <nav className='main-nav'>
      <Link to='/'>
        <img className='main-nav-logo-image' src={logo} alt='Argent Bank Logo' />
        <h1 className='sr-only'>Argent Bank</h1>
      </Link>

      {isLogged ? (
        <div>
          <Link to='/profile' className='main-nav-item'>
            <i className='fa fa-user-circle'></i>
            {user ? user.firstName : 'Loading...'}
          </Link>
          <Link to='/' className='main-nav-item' onClick={SignOut}>
            <i className='fa fa-sign-out'></i>
            Sign Out
          </Link>
        </div>
      ) : (
        <div>
          <Link to='/login' className='main-nav-item'>
            <i className='fa fa-user-circle'></i>
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
