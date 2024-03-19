import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ColumnProps } from "@/store/useBoundStore";
import useBoundStore from "@/store/useBoundStore";
import ColumnDropdownMenu from "@/features/Column/ColumnDropdownMenu";
import RowContainer from "@/features/Column/RowContainer";
import AddRowButton from "@/features/Column/AddRowButton";

function Column({ id, title }: ColumnProps) {
	const column = { id, title };
	const rows = useBoundStore((state) => state.rows);

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: id, data: { type: "Column", column } });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const filteredRows = rows.filter((row) => row.columnId === id);

	if (isDragging) {
		return (
			<div
				className="grid grid-cols-[12rem] auto-rows-min gap-2 opacity-30"
				ref={setNodeRef}
				style={style}
			>
				<div className="grid relative">
					<Button
						className="overflow-hidden hover:cursor-move active:cursor-move"
						{...attributes}
						{...listeners}
					>
						<div className="overflow-hidden text-ellipsis font-semibold">
							{title}
						</div>
					</Button>
					<ColumnDropdownMenu column={column} />
				</div>
				<RowContainer filteredRows={filteredRows} />
				<AddRowButton columnId={id} />
			</div>
		);
	}

	return (
		<div
			className="grid auto-cols-[12rem] auto-rows-min gap-2"
			ref={setNodeRef}
			style={style}
		>
			<div className="grid relative">
				<Button
					className="overflow-hidden hover:cursor-move active:cursor-move"
					{...attributes}
					{...listeners}
				>
					<div className="overflow-hidden text-ellipsis font-semibold mx-2">
						{title}
					</div>
				</Button>
				<ColumnDropdownMenu column={column} />
			</div>
			<RowContainer filteredRows={filteredRows} />
			<AddRowButton columnId={id} />
		</div>
	);
}

export default Column;
