import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { getUser, toggleEditing } from '../../store/authSlice';
import AccountCard from '../../components/layout/main/AccountCard.tsx';
import Button from '../../components/layout/main/Button.tsx';
import EditForm from '../../components/layout/main/EditForm.tsx';

const Profile = () => {
  const dispatch: AppDispatch = useDispatch();
  const isEditing = useSelector((state: RootState) => state.auth.isEditing);
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);

  console.log(user)
  console.log(token)
  

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
    <main className={isEditing ? 'main bg-grey' : 'main bg-dark'}>
      <div className='header'>
        {user &&
          (isEditing ? (
            <EditForm userName={user.lastName} userFirstName={user.firstName} />
          ) : (
            <h1>
              Welcome back
              <br></br>
              {user.firstName} {user.lastName}!
            </h1>
          ))}
        {!isEditing &&(
          <Button
          type='edit-button'
          message='Edit Name'
          onClick={() => dispatch(toggleEditing())}
        />
        )  }
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
