import Swal from "sweetalert2";

export const showSuccessPopup = (message: string) => {
	Swal.fire({
		icon: "success",
		title: "Success",
		text: message,
	});
};

export const showConfirmationPopup = (message: string) => {
	return Swal.fire({
		title: "Are you sure?",
		text: message,
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Yes, do it!",
		cancelButtonText: "No, cancel!",
	});
};

export const showErrorPopup = (message: string) => {
	Swal.fire({
		icon: "error",
		title: "Error",
		text: message,
	});
};

export const showWarningPopup = (message: string) => {
	Swal.fire({
		icon: "warning",
		title: "Warning",
		text: message,
	});
};
