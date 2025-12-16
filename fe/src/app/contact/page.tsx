import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <Link href="/" className="text-madlen-500 hover:text-madlen-600 text-sm font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Contact Us</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-3">Get in Touch</h2>
                            <p className="text-slate-600 leading-relaxed">
                                We&apos;d love to hear from you! Whether you have questions, feedback, or just want to say hello,
                                feel free to reach out to us.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <h3 className="font-semibold text-slate-800 mb-2">📧 Email</h3>
                                <a href="mailto:support@madlen.ai" className="text-madlen-500 hover:text-madlen-600">
                                    support@madlen.ai
                                </a>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-xl">
                                <h3 className="font-semibold text-slate-800 mb-2">💬 Social</h3>
                                <p className="text-slate-600">Follow us on social media for updates</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-3">Support</h2>
                            <p className="text-slate-600 leading-relaxed">
                                For technical support or bug reports, please include as much detail as possible
                                about the issue you&apos;re experiencing, including the AI model you were using and
                                any error messages you received.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-slate-200">
                            <p className="text-sm text-slate-500">
                                We typically respond within 24-48 hours during business days.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
