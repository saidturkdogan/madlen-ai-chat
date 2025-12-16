import Link from 'next/link';

export default function PrivacyPage() {
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
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
                <p className="text-slate-500 mb-8">Last updated: December 2025</p>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 prose prose-slate max-w-none">
                    <h2>1. Information We Collect</h2>
                    <p>When you use Madlen AI, we may collect the following information:</p>
                    <ul>
                        <li><strong>Account Information:</strong> Email address and authentication data when you sign up</li>
                        <li><strong>Chat Data:</strong> Messages and conversations you have with AI models</li>
                        <li><strong>Usage Data:</strong> Information about how you use our Service</li>
                        <li><strong>Device Information:</strong> Browser type, device type, and IP address</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the collected information to:</p>
                    <ul>
                        <li>Provide and maintain the Service</li>
                        <li>Save your chat history for your convenience</li>
                        <li>Improve and personalize your experience</li>
                        <li>Communicate with you about the Service</li>
                        <li>Ensure security and prevent abuse</li>
                    </ul>

                    <h2>3. Data Storage and Security</h2>
                    <p>
                        Your data is stored securely using industry-standard encryption. We implement
                        appropriate technical and organizational measures to protect your personal information
                        against unauthorized access, alteration, or destruction.
                    </p>

                    <h2>4. Third-Party Services</h2>
                    <p>We use the following third-party services:</p>
                    <ul>
                        <li><strong>Clerk:</strong> For authentication and user management</li>
                        <li><strong>OpenRouter:</strong> To process AI chat requests (your messages are sent to AI providers)</li>
                    </ul>
                    <p>
                        Please review the privacy policies of these third-party services for information on
                        how they handle your data.
                    </p>

                    <h2>5. Data Retention</h2>
                    <p>
                        We retain your chat history and account data for as long as your account is active.
                        You can delete your chat sessions at any time. If you wish to delete your account
                        entirely, please contact us.
                    </p>

                    <h2>6. Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Request deletion of your data</li>
                        <li>Export your chat history</li>
                        <li>Opt out of non-essential communications</li>
                    </ul>

                    <h2>7. Cookies</h2>
                    <p>
                        We use essential cookies to maintain your session and preferences. We do not use
                        tracking cookies for advertising purposes.
                    </p>

                    <h2>8. Children&apos;s Privacy</h2>
                    <p>
                        Our Service is not intended for children under 13. We do not knowingly collect
                        personal information from children under 13.
                    </p>

                    <h2>9. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any
                        changes by posting the new policy on this page.
                    </p>

                    <h2>10. Contact Us</h2>
                    <p>
                        If you have questions about this Privacy Policy, please contact us at{' '}
                        <a href="mailto:support@madlen.ai" className="text-madlen-500">support@madlen.ai</a>.
                    </p>
                </div>
            </main>
        </div>
    );
}
