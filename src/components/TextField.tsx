"use client";

import React, { forwardRef, useId } from "react";

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label: string;
	helperText?: string;
	error?: boolean;
	fullWidth?: boolean;
};

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
	(
		{
			label,
			helperText,
			error = false,
			fullWidth = true,
			id,
			className,
			disabled,
			placeholder,
			...rest
		},
		ref
	) => {
		const autoId = useId();
		const inputId = id ?? autoId;
		const helperId = helperText ? `${inputId}-helper-text` : undefined;
		const borderColor = error ? "border-red-500" : "border-slate-400";
		const focusColor = error
			? "focus:border-red-600 focus:ring-red-600"
			: "focus:border-blue-600 focus:ring-blue-600";
		const labelColor = error
			? "text-red-600 peer-focus:text-red-600"
			: "text-slate-600 peer-focus:text-blue-600";

		return (
			<div className={fullWidth ? "w-full" : "inline-block"}>
				<div className="relative">
					<input
						{...rest}
						ref={ref}
						id={inputId}
						disabled={disabled}
						placeholder={placeholder ?? " "}
						aria-invalid={error || undefined}
						aria-describedby={helperId}
						className={[
							"peer block w-full rounded-md border bg-white px-3 py-3 text-sm text-slate-900 shadow-sm transition",
							"focus:outline-none focus:ring-1",
							"disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
							borderColor,
							focusColor,
							className,
						]
							.filter(Boolean)
							.join(" ")}
					/>
					<label
						htmlFor={inputId}
						className={[
							"pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs transition-all",
							"peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500",
							labelColor,
						].join(" ")}
					>
						{label}
					</label>
				</div>
				{helperText && (
					<p
						id={helperId}
						className={[
							"mt-1 text-xs",
							error ? "text-red-600" : "text-slate-500",
						].join(" ")}
					>
						{helperText}
					</p>
				)}
			</div>
		);
	}
);

TextField.displayName = "TextField";

export default TextField;
