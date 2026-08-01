import AuthLayout from "../../components/layout/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthHeader from "../../components/auth/AuthHeader";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthFooter from "../../components/auth/AuthFooter";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Mail } from "lucide-react";

function Login() {
    return (
        <AuthLayout>

            <AuthCard>

                <AuthHeader
                    title="Welcome Back 👋"
                    subtitle="Sign in to continue your HackHive journey."
                />

                <div className="space-y-6">

                    <div>

                        <Label>Email Address</Label>

                        <div className="relative mt-2">

                            <Mail
                                className="absolute left-4 top-3.5 text-slate-400"
                                size={18}
                            />

                            <Input
                                className="h-12 rounded-xl pl-11"
                                placeholder="Enter your email"
                            />

                        </div>

                    </div>

                    <div>

                        <Label>Password</Label>

                        <div className="mt-2">
                            <PasswordInput
                                placeholder="Enter your password"
                            />
                        </div>

                    </div>

                    <div className="flex items-center justify-between">

                        <div className="flex items-center space-x-2">

                            <Checkbox id="remember"/>

                            <Label htmlFor="remember">

                                Remember me

                            </Label>

                        </div>

                        <button
                            className="text-sm font-medium text-indigo-600 hover:underline"
                        >

                            Forgot Password?

                        </button>

                    </div>

                    <Button
                        className="h-12 w-full rounded-xl"
                    >

                        Login

                    </Button>

                </div>

                <AuthFooter
                    text="Don't have an account?"
                    linkText="Register"
                    to="/register"
                />

            </AuthCard>

        </AuthLayout>
    );
}

export default Login;