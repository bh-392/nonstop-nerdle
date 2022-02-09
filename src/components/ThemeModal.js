import { THEME_OPTIONS } from "../constants";
import Button from "./Button";
import styles from "./ThemeModal.module.css";

const Modal = ({ setCurrentTheme, setIsThemeModalOpen }) => {
  const handleSetTheme = (theme) => {
    localStorage.setItem("theme", theme);
    setCurrentTheme(theme);
  };

  const handleCloseModal = () => {
    setIsThemeModalOpen(false);
  };

  const handleCloseModalByClickingOverlay = (e) => {
    if (e.target.getAttribute("class").includes("overlay")) {
      setIsThemeModalOpen(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleCloseModalByClickingOverlay}>
      <div className={styles.container}>
        <p>Theme</p>
        {THEME_OPTIONS.map((theme) => (
          <Button
            key={theme}
            onClick={() => handleSetTheme(theme)}
            additionalStyle={{ paddingLeft: 40, paddingRight: 40 }}
          >
            {theme}
          </Button>
        ))}
        <Button onClick={handleCloseModal}>Close</Button>
      </div>
    </div>
  );
};

export default Modal;
