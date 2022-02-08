import styles from "./Message.module.css";

const Message = ({ message: { type, content } }) => {
  const className = `${styles.container} ${styles["container-" + type]}`;
  return <div className={className}>{content}</div>;
};

export default Message;
