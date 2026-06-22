import { X } from "lucide-react";
import Layout from "@/components/Layout";
import { useLocation } from "wouter";

export default function PrivacyPolicy() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
            <p className="text-blue-100">Last updated: May 6, 2021</p>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="max-w-4xl mx-auto prose prose-sm dark:prose-invert">
            <div className="bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-600 p-6 mb-8 rounded">
              <h2 className="text-xl font-bold text-foreground dark:text-white mt-0 mb-2">Welcome to Gravity Interactive!</h2>
              <p className="text-foreground/80 dark:text-white/80 mb-0">
                The use of our services and websites is subject to agreement to the terms of this Privacy Policy. If you do not agree to the terms of our Privacy Policy, please do not use our services or access our sites.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Our Privacy Commitment</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Gravity Interactive, Inc., its subsidiaries, and affiliates (collectively, "Gravity Interactive") respect the privacy rights of our online visitors and recognize the importance of protecting all information that you may choose to share with us. To further this commitment, we have adopted this Online Privacy Policy ("Privacy Policy") to guide how we collect, store, and use the information you provide us.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Table of Contents</h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/70 dark:text-white/70 mb-8">
              <li>What information does this Privacy Statement cover?</li>
              <li>What types of personally identifiable information do we collect about our users?</li>
              <li>How is your personally identifiable information used and shared?</li>
              <li>What choices do you have about the collection, use, and sharing of your personally identifiable information?</li>
              <li>What kinds of security measures do we take to safeguard your personally identifiable information?</li>
              <li>How can you update your personal information and profile?</li>
              <li>How can you ask questions, or send us comments, about this Privacy Policy?</li>
              <li>How will you know if we amend this Privacy Policy?</li>
              <li>What are the application areas of this Privacy Policy?</li>
            </ul>

            <h3 className="text-xl font-bold text-foreground dark:text-white mb-3">What Information Does This Privacy Statement Cover?</h3>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              This Privacy Policy applies only to personal information collected on the websites where this Privacy Policy is posted, and does not apply to any other information collected by Gravity Interactive through any other means. This Privacy Policy applies to use and sharing of personal information collected on and after the date that this Privacy Policy is posted.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Please note that this Privacy Policy applies only to information submitted and collected online and does not apply to information that may be collected by Gravity Interactive offline. This Privacy Policy applies only to websites maintained by Gravity Interactive, and not to our international affiliates or any websites maintained by other companies or organizations to which we link.
            </p>

            <h3 className="text-xl font-bold text-foreground dark:text-white mb-3">What Types of Personally Identifiable Information Do We Collect?</h3>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              We don't require personal information to access our website. However, if you prefer not to disclose personal information, you will not be able to enjoy certain features of our website. Personal information is information that identifies you and may be used to contact you.
            </p>
            
            <h4 className="text-lg font-semibold text-foreground dark:text-white mb-2">Children</h4>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Our Terms of Agreement specify that memberships are available only to individuals who are 16 years of age or older. Gravity Interactive will not knowingly collect, maintain, or disclose any personal information from children under the age of 16. We take children's privacy seriously and encourage parents to play an active role in their children's online experience at all times.
            </p>

            <h4 className="text-lg font-semibold text-foreground dark:text-white mb-2">Information You Provide to Us</h4>
            <p className="text-foreground/70 dark:text-white/70 mb-4">All of the personal information we receive comes directly from our users. We collect personal information to:</p>
            <ul className="list-disc list-inside space-y-1 text-foreground/70 dark:text-white/70 mb-6">
              <li>Register for our website</li>
              <li>Subscribe to our newsletter</li>
              <li>Join our message boards and forums</li>
              <li>Participate in polls, surveys, and questionnaires</li>
              <li>Participate in contests, sweepstakes, or other promotions</li>
              <li>Purchase a product at one of our online stores</li>
              <li>Receive customer or technical support</li>
            </ul>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Typically, this information includes: name, email address, telephone number, shipping and billing address, and for those purchasing products online, credit card information. We may also collect demographic information such as your age or date of birth, gender, hobbies, and occupation.
            </p>

            <h4 className="text-lg font-semibold text-foreground dark:text-white mb-2">Information Collected Through Technology</h4>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              We collect information through technology to make our websites more interesting and useful to you. For example, when you come to one of our websites, we collect your IP address. An IP address is often associated with the portal through which you enter the Internet, like your ISP (Internet service provider), your company, or your school.
            </p>

            <h4 className="text-lg font-semibold text-foreground dark:text-white mb-2">Cookies</h4>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Our websites use cookies. Cookies are pieces of information that a website sends to your computer while you are viewing the website. We use cookies for a variety of purposes. For example, when you return to one of our websites after logging in, cookies provide information to the website so that the website will remember who you are. You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings.
            </p>

            <h3 className="text-xl font-bold text-foreground dark:text-white mb-3">How Is Your Personally Identifiable Information Used and Shared?</h3>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              We don't share, sell, or rent your personal information to third parties without your consent. Whatever the purpose may be, we will only collect information to the extent reasonably necessary to fulfill your requests and our legitimate business objectives.
            </p>

            <h4 className="text-lg font-semibold text-foreground dark:text-white mb-2">Gravity Interactive Tools and Updates</h4>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Information collected from those who voluntarily submit it to us is used to provide services like newsletter subscription, updates on special events, game news, and email announcements of interest to our users. If you register for access to our blogs or message boards, we will use your personal information to enable you to view and post messages on the boards.
            </p>

            <h4 className="text-lg font-semibold text-foreground dark:text-white mb-2">Third Parties' Use of Personal Information</h4>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Occasionally, we share your personal information with third parties that provide products or services that may be of interest to you. We may use other companies, agents or contractors to perform services necessary to our operations. We will attempt to ensure that these entities do not use your personal information for any other purpose, and that they have agreed to maintain the confidentiality, security, and integrity of the personal information they obtain from us.
            </p>

            <h3 className="text-xl font-bold text-foreground dark:text-white mb-3">Security Measures</h3>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              Gravity Interactive takes reasonable precautions to protect your personal information. We maintain appropriate administrative, technical, and physical safeguards to protect personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is completely secure.
            </p>

            <h3 className="text-xl font-bold text-foreground dark:text-white mb-3">Contact Us</h3>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at our customer support channels. We will be happy to assist you with any concerns you may have regarding your personal information.
            </p>

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
