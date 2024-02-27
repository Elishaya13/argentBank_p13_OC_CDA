interface ButtonProps {
    type: string;
    message: string;
  }

const Button = ({ type, message}: ButtonProps ) => {
    return (
        <button className={type}>
            {message}
        </button>
    );
};

export default Button;