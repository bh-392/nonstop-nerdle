import styles from "./Button.module.css";

const Button = ({ onClick, children }) => {
  return (
    <button className={styles.base} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
