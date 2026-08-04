import { Button } from "./Button";

function PrimaryButton({
    children,
    type = "button",
    onClick,
    className = "",
    disabled = false,
    isLoading = false,
    ...props
}) {
    return (
        <Button
            type={type}
            variant="primary"
            size="lg"
            onClick={onClick}
            disabled={disabled}
            isLoading={isLoading}
            className={`w-full ${className}`}
            {...props}
        >
            {children}
        </Button>
    );
}

export default PrimaryButton;
export { PrimaryButton };