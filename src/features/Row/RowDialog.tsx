import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
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
import { Image } from "lucide-react";
import { useEffect } from "react";

const RowFormSchema = z.object({
	name: z.string(),
	url: z
		.string()
		.min(1, { message: "URL is required." })
		.transform((value) => {
			const protocol = /^https?:\/\//;
			if (!protocol.test(value)) value = "https://" + value;
			return value;
		})
		.refine(
			(value) => {
				try {
					new URL(value);

					return true;
				} catch {
					return false;
				}
			},
			{
				message: "Value must be a valid URL.",
			}
		),
	image: z
		.custom<File>((input) => input instanceof File)
		.refine(
			(file) => {
				const image = /^image\//;
				return image.test(file.type);
			},
			{ message: "Only image files are accepted" }
		)
		.refine(
			(file) => {
				return file.size <= 5 * 1024 * 1024;
			},
			{
				message: "File size must be less than 5mb.",
			}
		)
		.optional(),
});

export type RowFormInput = z.infer<typeof RowFormSchema>;

function useRowForm(defaultValues: RowFormInput) {
	return useForm<RowFormInput>({
		resolver: zodResolver(RowFormSchema),
		defaultValues: {
			name: defaultValues.name,
			url: defaultValues.url,
			image: defaultValues.image,
		},
	});
}

interface AddRowDialogProps {
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (values: RowFormInput) => void;
	formInput: RowFormInput;
}

export function AddRowDialog({
	open,
	onOpenChange,
	onSubmit,
	formInput,
}: AddRowDialogProps) {
	const rowForm = useRowForm(formInput);
	const selectedFile = rowForm.watch("image");

	// Manually trigger file input when value changes,
	// if an error occurs, reset the field and retain the displayed error
	useEffect(() => {
		if (!selectedFile) return;
		if (selectedFile.type.startsWith("image/")) return;

		rowForm.trigger("image").then((value) => {
			if (!value) {
				rowForm.resetField("image", {
					keepError: true,
				});
			}
		});
	}, [selectedFile, rowForm]);

	// clears the retained displayed error when dialog is closed
	useEffect(() => {
		rowForm.clearErrors("image");
	}, [open, rowForm]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Link</DialogTitle>
					<DialogDescription>
						Please enter a name and url for the new link.
					</DialogDescription>
				</DialogHeader>
				<Form {...rowForm}>
					<form
						onSubmit={rowForm.handleSubmit((values: RowFormInput) => {
							if (selectedFile) {
								values.image = selectedFile;
							}
							if (values.name === "") {
								values.name = new URL(values.url).hostname;
							}

							onSubmit(values);
						})}
						className="grid grid-cols-5 gap-4 py-4"
						id="add-row-form"
					>
						<div className="col-span-3">
							<FormField
								control={rowForm.control}
								name="name"
								render={({ field }) => {
									return (
										<>
											<FormItem>
												<FormLabel>Name:</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
											</FormItem>
											<FormMessage />
										</>
									);
								}}
							/>
							<FormField
								control={rowForm.control}
								name="url"
								render={({ field }) => {
									return (
										<>
											<FormItem>
												<FormLabel>URL:</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
											</FormItem>
											<FormMessage />
										</>
									);
								}}
							/>
						</div>
						<div className="grid col-span-2 content-center">
							<div className="p-4 grid justify-center">
								<Image className="size-16 rounded" />
							</div>
							<FormField
								control={rowForm.control}
								name="image"
								render={({ field: { value, onChange, ...fieldProps } }) => {
									return (
										<>
											<FormItem>
												<FormControl>
													<Input
														type="file"
														accept="image/*"
														{...fieldProps}
														onChange={(event) => {
															onChange(
																event.target.files && event.target.files[0]
															);
														}}
													/>
												</FormControl>
											</FormItem>
											<FormMessage />
										</>
									);
								}}
							/>
						</div>
					</form>
				</Form>
				<DialogFooter>
					<Button form="add-row-form" type="submit">
						Ok
					</Button>
					<DialogClose>Cancel</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface EditRowDialogProps {
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (values: RowFormInput) => void;
	formInput: RowFormInput;
}

export function EditRowDialog({
	open,
	onOpenChange,
	onSubmit,
	formInput,
}: EditRowDialogProps) {
	const rowForm = useRowForm(formInput);
	const favicon =
		"https://www.google.com/s2/favicons?sz=32&domain_url=" + formInput.url;
	const selectedFile = rowForm.watch("image");

	// Manually trigger file input when value changes,
	// if an error occurs, reset the field and retain the displayed error
	useEffect(() => {
		if (!selectedFile) return;
		if (selectedFile.type.startsWith("image/")) return;

		rowForm.trigger("image").then((value) => {
			if (!value) {
				rowForm.resetField("image", {
					keepError: true,
				});
			}
		});
	}, [selectedFile]);

	// clears the retained displayed error when dialog is closed
	useEffect(() => {
		rowForm.clearErrors("image");
	}, [open]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Link</DialogTitle>
					<DialogDescription>
						Modify the name and url of the link.
					</DialogDescription>
				</DialogHeader>
				<Form {...rowForm}>
					<form
						onSubmit={rowForm.handleSubmit((values: RowFormInput) => {
							if (selectedFile) {
								values.image = selectedFile;
							}
							if (values.name === "") {
								values.name = new URL(values.url).hostname;
							}

							onSubmit(values);
						})}
						className="grid grid-cols-5 gap-4 py-4"
						id="edit-row-form"
					>
						<div className="col-span-3">
							<FormField
								control={rowForm.control}
								name="name"
								render={({ field }) => {
									return (
										<>
											<FormItem>
												<FormLabel>Name:</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
											</FormItem>
											<FormMessage />
										</>
									);
								}}
							/>
							<FormField
								control={rowForm.control}
								name="url"
								render={({ field }) => {
									return (
										<>
											<FormItem>
												<FormLabel>URL:</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
											</FormItem>
											<FormMessage />
										</>
									);
								}}
							/>
						</div>
						<div className="grid col-span-2 content-center">
							<div className="p-4 grid justify-center">
								<img
									className="size-16 rounded"
									src={
										selectedFile ? URL.createObjectURL(selectedFile) : favicon
									}
								/>
							</div>
							<FormField
								control={rowForm.control}
								name="image"
								render={({ field: { value, onChange, ...fieldProps } }) => {
									return (
										<>
											<FormItem>
												<FormControl>
													<Input
														type="file"
														accept="image/*"
														{...fieldProps}
														onChange={(event) => {
															onChange(
																event.target.files && event.target.files[0]
															);
														}}
													/>
												</FormControl>
											</FormItem>
											<FormMessage />
										</>
									);
								}}
							/>
						</div>
					</form>
				</Form>
				<DialogFooter>
					<Button form="edit-row-form" type="submit">
						Ok
					</Button>
					<DialogClose>Cancel</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

interface DeleteRowDialogProps {
	open: boolean;
	onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: () => void;
}

export function DeleteRowDialog({
	open,
	onOpenChange,
	onSubmit,
}: DeleteRowDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="sm:max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Link</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete the entire category?
						<br />
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<form id="delete-row-form" onSubmit={onSubmit} />
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction form="delete-row-form" type="submit">
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
