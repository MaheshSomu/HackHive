import { Card } from "@/components/ui/card";

function AuthCard({ children }) {

    return (

        <Card className="rounded-3xl border-0 p-10 shadow-2xl">

            {children}

        </Card>

    );

}

export default AuthCard;