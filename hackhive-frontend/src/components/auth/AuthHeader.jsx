function AuthHeader({ title, subtitle }) {
    return (
        <div className="mb-8">

            <h1 className="text-4xl font-black text-slate-900">

                {title}

            </h1>

            <p className="mt-3 text-slate-500 leading-7">

                {subtitle}

            </p>

        </div>
    );
}

export default AuthHeader;