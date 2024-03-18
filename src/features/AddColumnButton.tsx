import { useState } from "react";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import {
	AddColumnDialog,
	ColumnFormInput,
} from "@/features/Column/ColumnDialog";
import useBoundStore from "@/store/useBoundStore";

function AddColumnButton() {
	const [isAddColumnDialog, setIsAddColumnDialog] = useState(false);
	const addColumn = useBoundStore((state) => state.addColumn);

	return (
		<>
			{isAddColumnDialog && (
				<AddColumnDialog
					open={isAddColumnDialog}
					onOpenChange={setIsAddColumnDialog}
					onSubmit={(values: ColumnFormInput) => {
						addColumn({ title: values.title });
						setIsAddColumnDialog(false);
					}}
					formInput={{ title: "" }}
				/>
			)}
			<Button size="icon" onClick={() => setIsAddColumnDialog(true)}>
				<Plus />
			</Button>
		</>
	);
}

export default AddColumnButton;
