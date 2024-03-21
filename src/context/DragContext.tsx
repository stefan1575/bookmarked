import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	DragOverlay,
	pointerWithin,
} from "@dnd-kit/core";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ColumnProps, RowProps } from "@/store/useBoundStore";
import Column from "@/features/Column/Column";
import Row from "@/features/Row/Row";
import useBoundStore from "@/store/useBoundStore";

interface DragContextProps {
	children: React.ReactNode;
}

function DragContext({ children }: DragContextProps) {
	const [draggedColumn, setDraggedColumn] = useState<ColumnProps | null>(null);
	const [draggedRow, setDraggedRow] = useState<RowProps | null>(null);

	const dragColumn = useBoundStore((state) => state.dragColumn);
	const dragRow = useBoundStore((state) => state.dragRow);
	const dragRowToColumn = useBoundStore((state) => state.dragRowToColumn);

	const sensor = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		})
	);

	return (
		<DndContext
			collisionDetection={pointerWithin}
			sensors={sensor}
			onDragStart={(event) => {
				if (event.active.data.current?.type === "Column") {
					setDraggedColumn(event.active.data.current.column);
					return;
				}

				if (event.active.data.current?.type === "Row") {
					setDraggedRow(event.active.data.current.row);
					return;
				}
			}}
			onDragOver={(event) => {
				const { active, over } = event;
				if (!over) return;
				if (active.id === over.id) return;

				const activeRow = active.data.current?.type === "Row";
				const activeColumn = active.data.current?.type === "Column";

				const overRow = over.data.current?.type === "Row";
				const overColumn = over.data.current?.type === "Column";

				if (activeRow && !activeColumn) {
					if (activeRow && overRow) {
						dragRow({
							activeId: active.id,
							overId: over.id,
						});
					}

					if (activeRow && overColumn) {
						dragRowToColumn({
							activeId: active.id,
							overId: over.id,
						});
					}
				}

				if (activeColumn && !activeRow) {
					if (activeColumn && overColumn) {
						dragColumn({ activeId: active.id, overId: over.id });
					}

					if (activeColumn && overRow) {
						dragColumn({
							activeId: active.id,
							overId: over.data.current?.row.columnId,
						});
					}
				}
			}}
			onDragEnd={() => {
				setDraggedColumn(null);
				setDraggedRow(null);
			}}
		>
			{children}
			{createPortal(
				<DragOverlay>
					{draggedColumn && <Column {...draggedColumn} />}
					{draggedRow && <Row {...draggedRow} />}
				</DragOverlay>,
				document.body
			)}
		</DndContext>
	);
}

export default DragContext;
