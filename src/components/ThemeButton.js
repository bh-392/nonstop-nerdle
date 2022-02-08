import Button from "./Button";

const ThemeButton = ({ setIsThemeModalOpen }) => {
  const handleClick = (e) => {
    e.target.blur();
    setIsThemeModalOpen(true);
  };

  return <Button onClick={handleClick}>Theme</Button>;
};

export default ThemeButton;
