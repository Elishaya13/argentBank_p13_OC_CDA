import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUser } from '../../store/authSlice';
import AccountCard from '../../components/layout/main/AccountCard.tsx';

const Profile = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  if (token === null) {
    window.location.href = '/login';
  }

  useEffect(() => {
    if (token) {
      dispatch(getUser(token));
    } else {
      window.location.href = '/login';
    }
  }, [dispatch, token]);

  return (
    <main className='main bg-dark'>
      <div className='header'>
        <h1>
          Welcome back
          <br />
          {user && (
            <p>
              {user.firstName} {user.lastName}!
            </p>
          )}
        </h1>
        <button className='edit-button'>Edit Name</button>
      </div>
      <h2 className='sr-only'>Accounts</h2>
      <AccountCard
        title='Argent Bank Checking (x8349)'
        amount={2082.79}
        description='Available Balance'
      />
      <AccountCard
        title='Argent Bank Savings (x6712)'
        amount={10928.42}
        description='Available Balance'
      />
      <AccountCard
        title='Argent Bank Credit Card (x8349)'
        amount={184.3}
        description='Current Balance'
      />
    </main>
  );
};

export default Profile;
