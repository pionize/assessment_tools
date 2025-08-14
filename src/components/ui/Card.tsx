interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	variant?: "default" | "success" | "danger" | "info";
	padding?: "none" | "sm" | "default" | "lg";
	className?: string;
}

const Card = ({
	children,
	className = "",
	variant = "default",
	padding = "default",
	...props
}: CardProps) => {
	const baseClasses = "bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg";

	const variantClasses = {
		default: "rounded-2xl",
		success: "rounded-2xl border-green-200 bg-gradient-to-r from-green-50/50 to-emerald-50/50",
		danger: "rounded-2xl border-red-200 bg-gradient-to-r from-red-50/50 to-red-100/50",
		info: "rounded-2xl border-blue-200 bg-gradient-to-r from-blue-50/50 to-sky-50/50",
	};

	const paddingClasses = {
		none: "",
		sm: "p-4",
		default: "p-8",
		lg: "p-10",
	};

	const classes = `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${paddingClasses[padding as keyof typeof paddingClasses]} ${className}`;

	return (
		<div className={classes} {...props}>
			{children}
		</div>
	);
};

export default Card;
