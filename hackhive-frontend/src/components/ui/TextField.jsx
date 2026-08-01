function TextField({

    icon,

    error,

    ...props

}){

    return(

        <div>

            <div
                className="
                    flex
                    items-center
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    transition
                    focus-within:border-indigo-500
                    focus-within:ring-4
                    focus-within:ring-indigo-100
                "
            >

                {

                    icon &&

                    <div className="text-slate-400">

                        {icon}

                    </div>

                }

                <input

                    {...props}

                    className="
                        w-full
                        py-4
                        px-3
                        outline-none
                        bg-transparent
                    "

                />

            </div>

            {

                error &&

                <p className="mt-2 text-sm text-red-500">

                    {error}

                </p>

            }

        </div>

    )

}

export default TextField;