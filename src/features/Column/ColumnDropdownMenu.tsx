import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
	ColumnFormInput,
	DeleteColumnDialog,
	EditColumnDialog,
} from "./ColumnDialog";
import { ColumnProps } from "@/store/useBoundStore";
import useBoundStore from "@/store/useBoundStore";
import { useState } from "react";
import { MoreVertical } from "lucide-react";

interface ColumnDropdownMenuProps {
	column: ColumnProps;
}

function ColumnDropdownMenu({ column }: ColumnDropdownMenuProps) {
	const [isEditColumnDialog, setIsEditColumnDialog] = useState(false);
	const [isDeleteColumnDialog, setIsDeleteColumnDialog] = useState(false);
	const editColumn = useBoundStore((state) => state.editColumn);
	const deleteColumn = useBoundStore((state) => state.deleteColumn);
	const deleteRows = useBoundStore((state) => state.deleteRows);

	const { id } = column;
	return (
		<>
			{isEditColumnDialog && (
				<EditColumnDialog
					open={isEditColumnDialog}
					onOpenChange={setIsEditColumnDialog}
					formInput={column}
					onSubmit={(values: ColumnFormInput) => {
						editColumn({ id, title: values.title });
						setIsEditColumnDialog(false);
					}}
				/>
			)}
			<DeleteColumnDialog
				open={isDeleteColumnDialog}
				onOpenChange={setIsDeleteColumnDialog}
				onSubmit={() => {
					deleteColumn({ id });
					deleteRows({ columnId: id });
					setIsDeleteColumnDialog(false);
				}}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger className="absolute inset-y-0 right-2">
					<MoreVertical
						color="white"
						className="size-5 rounded hover:bg-slate-700"
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => setIsEditColumnDialog(true)}>
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsDeleteColumnDialog(true)}>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

export default ColumnDropdownMenu;
