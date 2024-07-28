import "./App.css";

import Dropdown from "./components/Dropdown/Dropdown";
import DropdownItem from "./components/DropdownItem/DropdownItem";

const App = () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8]; 
  return (
    <div className="App">
      <div className="content">
        <Dropdown
          buttonText="Dropdown button"
          content={
            <>
              {items.map((item, id) => (
                <DropdownItem key={id}>{`Item ${item}`}</DropdownItem>
              ))}
            </>
          }
        />
      </div>
    </div>
  );
};

export default App;
