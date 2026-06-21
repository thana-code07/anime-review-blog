const variants = {
  primary:
    "bg-brown-900 text-white hover:bg-brown-800 focus-visible:outline-brown-900",
  ghost:
    "bg-transparent text-brown-800 hover:text-brown-500 focus-visible:outline-brown-800",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center rounded-full px-6 py-3 text-base font-medium leading-none transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
