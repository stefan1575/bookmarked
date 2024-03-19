import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RowProps } from "@/store/useBoundStore";
import RowDropdownMenu from "@/features/Row/RowDropdownMenu";

function Row({ id, name, url, image }: RowProps) {
	const row = { id, name, url, image };
	const displayedImage = image
		? URL.createObjectURL(image)
		: "https://www.google.com/s2/favicons?sz=32&domain_url=" + url;

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: id, data: { type: "Row", row } });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	if (isDragging) {
		return (
			<div className="grid relative opacity-30">
				<Button
					variant="outline"
					ref={setNodeRef}
					{...attributes}
					{...listeners}
					style={style}
					asChild
				>
					<a href={url}>
						<div className="flex mr-auto items-center">
							<img src={displayedImage} className="size-4 mr-4" />
							<div>
								<div className="overflow-hidden text-ellipsis font-semibold">
									{name}
								</div>
							</div>
						</div>
					</a>
				</Button>
				<RowDropdownMenu row={row} />
			</div>
		);
	}

	return (
		<div className="grid relative">
			<Button
				variant="outline"
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				style={style}
				className="shadow shadow-gray block overflow-hidden"
				asChild
			>
				<a href={url}>
					<div className="flex mr-auto items-center">
						<img src={displayedImage} className="size-4 mr-3.5" />
						<div className="overflow-hidden">
							<div className="overflow-hidden text-ellipsis font-semibold mr-2">
								{name}
							</div>
						</div>
					</div>
				</a>
			</Button>
			<RowDropdownMenu row={row} />
		</div>
	);
}

export default Row;
