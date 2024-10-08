import Swal from "sweetalert2";

export const showErrorAlert = (message: string) => {
	return Swal.fire({
		icon: "error",
		title: "Oops...",
		text: message,
		confirmButtonColor: "#3085d6",
	});
};

export const showSuccessAlert = (message: string) => {
	return Swal.fire({
		icon: "success",
		title: "Sucesso!",
		text: message,
		confirmButtonColor: "#28a745",
	});
};

export const showInfoAlert = (message: string) => {
	return Swal.fire({
		icon: "info",
		title: "Information",
		text: message,
		confirmButtonColor: "#17a2b8",
	});
};

export const showConfirmationAlert = (message: string) => {
	return Swal.fire({
		icon: "warning",
		title: "Are you sure?",
		text: message,
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "Yes",
		cancelButtonText: "No",
	});
};
