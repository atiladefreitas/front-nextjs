export const formatString = (input: string): string => {
	return input
		.toLowerCase() // Convert to lowercase
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove diacritics
		.replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/ç/g, "c"); // Replace 'ç' with 'c'
};

export default formatString;
