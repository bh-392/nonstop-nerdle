import styles from "./Button.module.css";

const Button = ({ onClick, children, additionalStyle }) => {
  return (
    <button className={styles.base} onClick={onClick} style={additionalStyle}>
      {children}
    </button>
  );
};

export default Button;
