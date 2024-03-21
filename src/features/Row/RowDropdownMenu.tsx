import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { RowProps } from "@/store/useBoundStore";
import useBoundStore from "@/store/useBoundStore";
import {
	DeleteRowDialog,
	EditRowDialog,
	RowFormInput,
} from "@/features/Row/RowDialog";
import { MoreVertical } from "lucide-react";

interface RowDropdownMenuProps {
	row: Omit<RowProps, "columnId">;
}

function RowDropdownMenu({ row }: RowDropdownMenuProps) {
	const [isEditRowDialog, setIsEditRowDialog] = useState(false);
	const [isDeleteRowDialog, setIsDeleteRowDialog] = useState(false);
	const editRow = useBoundStore((state) => state.editRow);
	const deleteRow = useBoundStore((state) => state.deleteRow);
	const { id } = row;

	return (
		<>
			{isEditRowDialog && (
				<EditRowDialog
					open={isEditRowDialog}
					onOpenChange={setIsEditRowDialog}
					formInput={row}
					onSubmit={(values: RowFormInput) => {
						editRow({
							id,
							name: values.name,
							url: values.url,
							image: values.image,
						});
						setIsEditRowDialog(false);
					}}
				/>
			)}
			<DeleteRowDialog
				open={isDeleteRowDialog}
				onOpenChange={setIsDeleteRowDialog}
				onSubmit={() => {
					deleteRow({ id });
					setIsDeleteRowDialog(false);
				}}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger className="absolute inset-y-0 right-2">
					<MoreVertical className="size-5 hover:bg-slate-300 rounded" />
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => setIsEditRowDialog(true)}>
						Edit
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setIsDeleteRowDialog(true)}>
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

export default RowDropdownMenu;
