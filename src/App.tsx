import { DatePicker } from "../dist/";
import { CustomSelect } from "./lib";

const App = () => (
  <div>
    <h1 className="text-4xl font-bold p-6">Hello React</h1>
    <DatePicker name="dateOfBirth" />
    <CustomSelect
      options={["Veaux", "Vaches", "Cochons"]}
      placeholder="Select an option"
      name="customSelect"
    />
  </div>
);

export default App;
