import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const ColumnFormSchema = z.object({
	title: z.string().min(1, { message: "Title is required." }),
});

export type ColumnFormInput = z.infer<typeof ColumnFormSchema>;

function useColumnForm(defaultValues: ColumnFormInput) {
	return useForm<ColumnFormInput>({
		resolver: zodResolver(ColumnFormSchema),
		defaultValues: {
			title: defaultValues.title,
		},
	});
}

interface AddColumnDialogProps {
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (values: ColumnFormInput) => void;
	formInput: ColumnFormInput;
}

export function AddColumnDialog({
	open,
	onOpenChange,
	onSubmit,
	formInput,
}: AddColumnDialogProps) {
	const columnForm = useColumnForm(formInput);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add Category</DialogTitle>
					<DialogDescription>
						Please enter a title for the new category.
					</DialogDescription>
				</DialogHeader>
				<Form {...columnForm}>
					<form
						onSubmit={columnForm.handleSubmit(onSubmit)}
						id="add-column-form"
					>
						<FormField
							control={columnForm.control}
							name="title"
							render={({ field }) => (
								<>
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
									<FormMessage />
								</>
							)}
						/>
						<FormMessage />
					</form>
				</Form>
				<DialogFooter>
					<Button form="add-column-form" type="submit">
						Ok
					</Button>
					<DialogClose>Cancel</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface EditColumnDialogProps {
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (values: ColumnFormInput) => void;
	formInput: ColumnFormInput;
}

export function EditColumnDialog({
	open,
	onOpenChange,
	onSubmit,
	formInput,
}: EditColumnDialogProps) {
	const columnForm = useColumnForm(formInput);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Edit Category</DialogTitle>
					<DialogDescription>
						Modify the title of the category.
					</DialogDescription>
				</DialogHeader>
				<Form {...columnForm}>
					<form
						onSubmit={columnForm.handleSubmit(onSubmit)}
						id="edit-column-form"
					>
						<FormField
							control={columnForm.control}
							name="title"
							render={({ field }) => (
								<>
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
									<FormMessage />
								</>
							)}
						/>
						<FormMessage />
					</form>
				</Form>
				<DialogFooter>
					<Button form="edit-column-form" type="submit">
						Ok
					</Button>
					<DialogClose>Cancel</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface DeleteColumnDialogProps {
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: () => void;
}

export function DeleteColumnDialog({
	open,
	onOpenChange,
	onSubmit,
}: DeleteColumnDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="sm:max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Category</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete the entire category?
						<br />
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form id="delete-column-form" onSubmit={onSubmit} />
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction form="delete-column-form" type="submit">
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
