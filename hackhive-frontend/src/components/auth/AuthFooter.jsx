import { Link } from "react-router-dom";

function AuthFooter({ text, linkText, to }) {
    return (
        <div className="mt-8 text-center text-sm text-slate-500">

            {text}

            <Link
                to={to}
                className="ml-2 font-semibold text-indigo-600 hover:text-indigo-700"
            >
                {linkText}
            </Link>

        </div>
    );
}

export default AuthFooter;