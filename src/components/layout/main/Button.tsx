interface ButtonProps {
  type: string;
  message: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  submit?: boolean;
}

const Button = ({ type, message, onClick, submit }: ButtonProps) => {
  return (
    <button
      type={submit ? 'submit' : 'button'}
      className={type}
      onClick={onClick}
    >
      {message}
    </button>
  );
};

export default Button;
