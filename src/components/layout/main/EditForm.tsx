
import { useDispatch } from 'react-redux';
import Button from './Button';
import { AppDispatch, RootState } from '../../../store/store';
import { putUser, toggleEditing } from '../../../store/authSlice';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface EditFormProps {
  userName: string;
  userFirstName: string;
}


const EditForm = ({ userName, userFirstName }: EditFormProps) => {
  const dispatch: AppDispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const [firstName, setFirstName] = useState(userFirstName);
  const [lastName, setLastName] = useState(userName);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (token) {
      dispatch(putUser({ token, user: { firstName, lastName } }));
      dispatch(toggleEditing());
    }
  };

  return (
    <form className='form edit-form' onSubmit={handleSubmit}>
      <h2>Welcome back</h2>
      <div className='inputs-form'>
        <div className='input-group'>
          <div className='input-element'>
            <label className='sr-only' htmlFor='first-name'>
              First Name
            </label>
            <input
              type='text'
              id='first-name'
              name='first-name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onFocus={() => setFirstName('')}
              required
            />
          </div>
          <div className='input-element'>
            <label className='sr-only' htmlFor='last-name'>
              Last Name
            </label>
            <input
              type='text'
              id='last-name'
              name='last-name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onFocus={() => setFirstName('')}
              required
            />
          </div>
        </div>
        <div className='button-group'>
          <Button type='edit-form-btn' message='Save' submit={true} />
          <Button
            type='edit-form-btn'
            message='Cancel'
            onClick={() => dispatch(toggleEditing())}
          />
        </div>
      </div>
    </form>
  );
};

export default EditForm;
