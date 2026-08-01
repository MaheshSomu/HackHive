function PrimaryButton({

    children,

    type="button",

    onClick,

    className=""

}){

    return(

        <button

            type={type}

            onClick={onClick}

            className={`
                w-full
                rounded-xl
                bg-indigo-600
                py-3
                text-white
                font-semibold
                transition
                duration-300
                hover:bg-indigo-700
                active:scale-95
                shadow-md
                ${className}
            `}
        >

            {children}

        </button>

    )

}

export default PrimaryButton;