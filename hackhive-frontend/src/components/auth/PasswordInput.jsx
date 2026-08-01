import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

function PasswordInput(props){

    const [show,setShow]=useState(false);

    return(

        <div className="relative">

            <Lock
                size={18}
                className="absolute left-4 top-3.5 text-slate-400"
            />

            <Input

                {...props}

                type={show ? "text":"password"}

                className="h-12 rounded-xl pl-11 pr-12"

            />

            <button

                type="button"

                onClick={()=>setShow(!show)}

                className="absolute right-4 top-3"

            >

                {

                    show

                    ?

                    <EyeOff size={18}/>

                    :

                    <Eye size={18}/>

                }

            </button>

        </div>

    )

}

export default PasswordInput;