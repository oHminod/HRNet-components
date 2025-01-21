import { CustomSelect, DatePicker } from "./lib";

const App = () => (
  <div className="p-10">
    <h1 className="text-4xl font-bold p-6">Hello React</h1>
    <DatePicker name="dateOfBirth" />
    <label htmlFor="customSelect">
      Animal{"  "}
      <CustomSelect
        options={["Veaux", "Vaches", "Cochons"]}
        placeholder="Select an option"
        name="customSelect"
      />
    </label>
  </div>
);

export default App;
