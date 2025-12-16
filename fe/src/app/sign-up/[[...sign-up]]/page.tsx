import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Panel - Black with branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col p-12">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 mb-auto">
                    <Image
                        src="/logo.png"
                        alt="Madlen AI"
                        width={48}
                        height={48}
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full"
                    />
                    <span className="text-white text-xl lg:text-2xl font-semibold">
                        Madlen<span className="text-madlen-500">.ai</span>
                    </span>
                </Link>

                {/* Quote Section */}
                <div className="mt-auto">
                    <blockquote className="text-white/90 text-lg lg:text-xl xl:text-2xl leading-relaxed mb-6">
                        &apos;Start your AI journey today. Access Llama, Gemma, Mistral, DeepSeek and more - switch between models seamlessly while keeping your conversation context.&apos;
                    </blockquote>
                    <div>
                        <p className="text-white font-medium text-base lg:text-lg">Madlen AI</p>
                        <p className="text-white/60 text-sm lg:text-base">Free AI Chat Platform</p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Sign Up Form */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Madlen AI"
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full"
                            />
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8 lg:mb-12">
                        <div className="hidden lg:block mb-4 lg:mb-6">
                            <Image
                                src="/logo.png"
                                alt="Madlen AI"
                                width={64}
                                height={64}
                                className="mx-auto w-16 h-16 lg:w-20 lg:h-20 rounded-full"
                            />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-3 lg:mb-4 text-slate-900 tracking-tight">
                            Join <span className="font-semibold">Madlen AI</span>
                        </h1>
                        <p className="text-base lg:text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
                            Create your free account and start chatting with AI.
                        </p>
                    </div>

                    {/* Clerk Sign Up */}
                    <div className="flex justify-center">
                        <SignUp
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-xl border border-slate-200 rounded-xl",
                                    headerTitle: "text-xl lg:text-2xl font-medium text-slate-900",
                                    headerSubtitle: "text-slate-600",
                                    socialButtonsBlockButton: "border-slate-300 hover:bg-slate-50",
                                    formFieldInput: "border-slate-300 focus:ring-madlen-500 focus:border-madlen-500",
                                    formButtonPrimary: "bg-slate-900 hover:bg-slate-800",
                                    footerActionLink: "text-madlen-600 hover:text-madlen-700",
                                }
                            }}
                        />
                    </div>

                    {/* Footer text */}
                    <div className="mt-6 lg:mt-8 text-center">
                        <p className="text-xs lg:text-sm text-slate-500">
                            No credit card required • 100% Free
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
