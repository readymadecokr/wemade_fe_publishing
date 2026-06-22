import { useLocation } from "wouter";
import Layout from "@/components/Layout";

export default function CookiePolicy() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-black mb-2">Cookie Policy</h1>
            <p className="text-blue-100">Last updated: May 6, 2021</p>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="max-w-4xl mx-auto prose prose-sm dark:prose-invert">
            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">What Are Cookies?</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Cookies are pieces of information that a website sends to your computer while you are viewing the website. We and other companies use cookies for a variety of purposes. For example, when you return to one of our websites after logging in, cookies provide information to the website so that the website will remember who you are.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">How We Use Cookies</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              We use cookies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/70 dark:text-white/70 mb-6">
              <li>Remember your login information and preferences</li>
              <li>Understand how you use our website and services</li>
              <li>Improve your browsing experience</li>
              <li>Personalize content and advertisements</li>
              <li>Analyze traffic patterns on our websites</li>
              <li>Provide you with a smoother web experience</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Types of Cookies</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>Session Cookies:</strong> These cookies are temporary and are deleted when you close your browser. They help us remember information about your current session.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>Persistent Cookies:</strong> These cookies remain on your computer for a longer period of time. They help us remember your preferences and login information across multiple visits.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              <strong>Third-Party Cookies:</strong> We may allow third parties to place cookies on your computer for analytics, advertising, and other purposes. These third parties have their own privacy policies.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Cookie Management</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You can do this through your browser settings. Each browser is a little different, so look at your browser Help menu to learn the correct way to modify your cookies.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              <strong>Important:</strong> If you turn cookies off, you won't have access to many features that make your web experience smoother, and some of our services may not function properly.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Web Beacons and Similar Technologies</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Our websites use a variety of technical methods for tracking purposes, including web beacons. Web beacons are small pieces of data that are embedded in images on the pages of websites. We use these technical methods to analyze the traffic patterns on our websites, such as the frequency with which our users visit various parts of our websites. These technical methods may involve the transmission of information either directly to us or to another party authorized by us to collect information on our behalf.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Your Privacy Rights</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              We respect your privacy rights regarding cookies. You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/70 dark:text-white/70 mb-6">
              <li>Know what cookies are being used on our website</li>
              <li>Control which cookies are stored on your device</li>
              <li>Delete cookies from your device at any time</li>
              <li>Opt out of certain types of cookies</li>
              <li>Request information about how your data is used</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Third-Party Links</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Our website may contain links to third-party websites. These websites may use their own cookies and tracking technologies. We are not responsible for the privacy practices of these third-party websites. We encourage you to review the cookie policies of any third-party websites before providing your personal information.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Changes to This Cookie Policy</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date at the top of this page.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Contact Us</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us through our customer support channels. We are happy to answer any questions you may have about our cookie practices.
            </p>

            <div className="bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-600 p-6 mb-8 rounded">
              <p className="text-foreground/80 dark:text-white/80 mb-0">
                <strong>Note:</strong> By continuing to use our website, you consent to our use of cookies as described in this Cookie Policy. You can withdraw your consent at any time by adjusting your browser settings or contacting us directly.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-border dark:border-slate-700">
              <button
                onClick={() => setLocation("/")}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
