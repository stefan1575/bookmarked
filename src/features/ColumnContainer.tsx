import {
	SortableContext,
	horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import useBoundStore from "@/store/useBoundStore";
import Column from "@/features/Column/Column";
import { useEffect } from "react";

function ColumnContainer() {
	const columns = useBoundStore((state) => state.columns);
	const columnIds = columns.filter((column) => column.id);
	const updateStore = () => {
		useBoundStore.persist.rehydrate();
	};

	useEffect(() => {
		document.addEventListener("visibilitychange", updateStore);
		window.addEventListener("focus", updateStore);
		return () => {
			document.removeEventListener("visibilitychange", updateStore);
			window.removeEventListener("focus", updateStore);
		};
	}, []);

	return (
		<SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
			<div className="grid grid-flow-col gap-2">
				{columns.map((column) => (
					<Column key={column.id} {...column} />
				))}
			</div>
		</SortableContext>
	);
}

export default ColumnContainer;
