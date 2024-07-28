import { forwardRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

import "./DropdownButton.css";

const DropdownButton = forwardRef((props, ref) => {
  const { children, toggle, open } = props;

  return (
    <div
      onClick={toggle}
      className={`dropdown-btn ${open ? "button-open" : null}`}
      ref={ref}
    >
      {children}
      <span className="toggle-icon">
        {open ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
      </span>
    </div>
  );
});

export default DropdownButton;
