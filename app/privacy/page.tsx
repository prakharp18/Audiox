export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto p-8 text-zinc-300 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
      
      <section>
        <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
        <p>
          When you sign in with Google, we collect your email address, name, and profile picture. 
          We use this information solely to create your account and identify you on the platform.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To provide and maintain the Audiox service.</li>
          <li>To allow you to send and receive voice messages.</li>
          <li>To display your public profile to other users.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">3. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information. 
          Your data is stored securely in our database and is not shared with third parties.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-3">4. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at pporwal2019@gmail.com.
        </p>
      </section>
      
      <p className="text-sm text-zinc-500 mt-12">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
