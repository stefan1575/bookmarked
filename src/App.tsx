import "./App.css";
import ColumnContainer from "@/features/ColumnContainer";
import AddColumnButton from "@/features/AddColumnButton";
import DragContext from "@/context/DragContext";

function App() {
	return (
		<DragContext>
			<div className="grid grid-flow-col justify-center gap-2">
				<ColumnContainer />
				<AddColumnButton />
			</div>
		</DragContext>
	);
}

export default App;
