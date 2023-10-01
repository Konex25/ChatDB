import { Select, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

LanguageDropdown.propTypes = {
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentLanguage: PropTypes.string.isRequired,
  changeLanguage: PropTypes.func.isRequired,
};
function LanguageDropdown({ languages, currentLanguage, changeLanguage }) {
  const handleLanguageChange = (event) => {
    changeLanguage(event.target.value);
  };

  return (
    <Select value={currentLanguage} onChange={handleLanguageChange}>
      {languages.map((language) => (
        <MenuItem key={language.value} value={language.value}>
          {language.label}
        </MenuItem>
      ))}
    </Select>
  );
}

export default LanguageDropdown;
