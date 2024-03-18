import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { AddRowDialog, RowFormInput } from "@/features/Row/RowDialog";
import useBoundStore from "@/store/useBoundStore";
import { ColumnProps } from "@/store/useBoundStore";

interface AddRowButtonProps {
	columnId: ColumnProps["id"];
}

function AddRowButton({ columnId }: AddRowButtonProps) {
	const [isAddRowDialog, setIsAddRowDialog] = useState(false);
	const addRow = useBoundStore((state) => state.addRow);

	return (
		<>
			{isAddRowDialog && (
				<AddRowDialog
					open={isAddRowDialog}
					onOpenChange={setIsAddRowDialog}
					onSubmit={(values: RowFormInput) => {
						addRow({
							name: values.name,
							url: values.url,
							image: values.image,
							columnId,
						});
						setIsAddRowDialog(false);
					}}
					formInput={{
						name: "",
						url: "",
					}}
				/>
			)}
			<Button
				onClick={() => {
					setIsAddRowDialog(true);
				}}
			>
				<div className="flex mr-auto items-center ">
					<PlusCircle className="mr-4 size-6" />
					<div className="font-semibold">Add New Link</div>
				</div>
			</Button>
		</>
	);
}

export default AddRowButton;
