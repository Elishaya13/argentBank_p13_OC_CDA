
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { AppDispatch, RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { rememberMe as remember} from '../../store/authSlice';
import { useSelector } from 'react-redux';


const Login = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useSelector((state: RootState) => state.auth.error);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await dispatch(loginUser({ email, password}));    
    navigate('/profile');
  };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {   
    dispatch(remember(event.target.checked));
  };

  return (
    <main className='main bg-dark'>
      <section className='sign-in-content'>
        <i className='fa fa-user-circle sign-in-icon'></i>
        <h1>Sign In</h1>
        <form onSubmit={onSubmit}>
          <div className='input-wrapper'>
            <label htmlFor='email'>Username</label>
            <input
              type='text'
              id='email'
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='input-wrapper'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='input-remember'>
            <input
              type='checkbox'
              id='remember-me'
              onChange={handleRememberMeChange}
            />
            <label htmlFor='remember-me'>Remember me</label>
          </div>
          <button type='submit' className='sign-in-button'>
            Sign In
          </button>
        </form>
        {error && <p className='error'>Identifiants incorrects, veuillez réessayer</p>}
      </section>
    </main>
  );
};

export default Login;
