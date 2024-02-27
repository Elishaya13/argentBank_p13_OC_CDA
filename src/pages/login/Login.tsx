
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { AppDispatch } from '../../store/store';


const Login = () => {
  const dispatch:AppDispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginUser({ email, password, rememberMe }));
  };

  const handleRememberMeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRememberMe(event.target.checked);
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
      </section>
    </main>
  );
};

export default Login;
