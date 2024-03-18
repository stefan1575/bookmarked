import { create, StateCreator } from "zustand";
import { ColumnFormInput } from "@/features/Column/ColumnDialog";
import { RowFormInput } from "@/features/Row/RowDialog";
import { arrayMove } from "@dnd-kit/sortable";
import { UniqueIdentifier } from "@dnd-kit/core";
import { persist, StateStorage } from "zustand/middleware";

interface DragProps {
	activeId: UniqueIdentifier;
	overId: UniqueIdentifier;
}

export interface ColumnProps extends ColumnFormInput {
	id: string;
}

interface ColumnSlice {
	columns: ColumnProps[];
	addColumn: ({ title }: Pick<ColumnProps, "title">) => void;
	editColumn: ({ id, title }: ColumnProps) => void;
	deleteColumn: ({ id }: Pick<ColumnProps, "id">) => void;
	dragColumn: ({ activeId, overId }: DragProps) => void;
	setColumns: ({ columns }: { columns: ColumnProps[] }) => void;
}

const createColumnSlice: StateCreator<ColumnSlice> = (set) => ({
	columns: [],
	addColumn: ({ title }) =>
		set((state) => ({
			columns: [...state.columns, { id: crypto.randomUUID(), title }],
		})),
	editColumn: ({ id, title }) =>
		set((state) => ({
			columns: state.columns.map((column) => {
				if (column.id === id) {
					return {
						...column,
						title,
					};
				}
				return column;
			}),
		})),
	deleteColumn: ({ id }) =>
		set((state) => ({
			columns: state.columns.filter((column) => column.id !== id),
		})),
	dragColumn: ({ activeId, overId }) =>
		set((state) => {
			const activeColumnIndex = state.columns.findIndex(
				(column) => column.id === activeId
			);
			const overColumnIndex = state.columns.findIndex(
				(column) => column.id === overId
			);
			return {
				columns: arrayMove(state.columns, activeColumnIndex, overColumnIndex),
			};
		}),
	setColumns: ({ columns }) =>
		set(() => ({
			columns: columns,
		})),
});

export interface RowProps extends RowFormInput {
	id: string;
	columnId: ColumnProps["id"];
}

interface RowSlice {
	rows: RowProps[];
	addRow: ({ columnId, name, url, image }: Omit<RowProps, "id">) => void;
	editRow: ({ id, name, url, image }: Omit<RowProps, "columnId">) => void;
	deleteRow: ({ id }: Pick<RowProps, "id">) => void;
	deleteRows: ({ columnId }: Pick<RowProps, "columnId">) => void;
	dragRow: ({ activeId, overId }: DragProps) => void;
	dragRowToColumn: ({ activeId, overId }: DragProps) => void;
	setRows: ({ rows }: { rows: RowProps[] }) => void;
}

const createRowSlice: StateCreator<RowSlice> = (set) => ({
	rows: [],
	addRow: ({ columnId, name, url, image }) =>
		set((state) => ({
			rows: [
				...state.rows,
				{
					id: crypto.randomUUID(),
					name,
					url,
					image,
					columnId,
				},
			],
		})),
	editRow: ({ id, name, url, image }) =>
		set((state) => ({
			rows: state.rows.map((row) => {
				if (row.id === id) {
					return {
						...row,
						name,
						url,
						image,
					};
				}
				return row;
			}),
		})),
	deleteRow: ({ id }) =>
		set((state) => ({
			rows: state.rows.filter((row) => row.id !== id),
		})),
	deleteRows: ({ columnId }) =>
		set((state) => ({
			rows: state.rows.filter((row) => row.columnId !== columnId),
		})),
	dragRow: ({ activeId, overId }) =>
		set((state) => {
			const activeRowIndex = state.rows.findIndex((row) => row.id === activeId);
			const overRowIndex = state.rows.findIndex((row) => row.id === overId);

			return {
				rows: arrayMove(
					state.rows.map((row, index) => {
						if (activeRowIndex === index) {
							if (row.columnId !== state.rows[overRowIndex].columnId) {
								return {
									...row,
									columnId: state.rows[overRowIndex].columnId,
								};
							}
						}

						return row;
					}),
					activeRowIndex,
					overRowIndex
				),
			};
		}),
	dragRowToColumn: ({ activeId, overId }) =>
		set((state) => {
			const activeRowIndex = state.rows.findIndex((row) => row.id === activeId);
			return {
				rows: arrayMove(
					state.rows.map((row) => {
						if (row.id === activeId) {
							return {
								...row,
								columnId: overId as ColumnProps["id"],
							};
						}
						return row;
					}),
					activeRowIndex,
					activeRowIndex
				),
			};
		}),
	setRows: ({ rows }) =>
		set(() => ({
			rows: rows,
		})),
});

const useBoundStore = create<
	ColumnSlice & RowSlice,
	[["zustand/persist", StateStorage]]
>(
	persist(
		(...a) => ({
			...createColumnSlice(...a),
			...createRowSlice(...a),
		}),
		{
			name: "store",
		}
	)
);

export default useBoundStore;
