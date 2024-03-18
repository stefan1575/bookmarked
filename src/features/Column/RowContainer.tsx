import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { RowProps } from "@/store/useBoundStore";
import Row from "@/features/Row/Row";

interface RowContainerProps {
	filteredRows: RowProps[];
}

function RowContainer({ filteredRows }: RowContainerProps) {
	const rowIds = filteredRows.map((row) => row.id);
	return (
		<SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
			<div className="contents">
				{filteredRows.map((row) => (
					<Row key={row.id} {...row} />
				))}
			</div>
		</SortableContext>
	);
}

export default RowContainer;
