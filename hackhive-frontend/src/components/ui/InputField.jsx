function InputField({

    label,

    type="text",

    placeholder,

    ...props

}){

    return(

        <div className="space-y-2">

            <label
                className="text-sm font-medium text-gray-700"
            >

                {label}

            </label>

            <input

                type={type}

                placeholder={placeholder}

                className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    py-3
                    outline-none
                    transition
                    focus:border-indigo-500
                    focus:ring-2
                    focus:ring-indigo-200
                "

                {...props}

            />

        </div>

    )

}

export default InputField;