import { useLocation } from "wouter";
import Layout from "@/components/Layout";

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
          <div className="container">
            <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
            <p className="text-blue-100">Last updated: May 24, 2018</p>
          </div>
        </div>

        {/* Content */}
        <div className="container py-12">
          <div className="max-w-4xl mx-auto prose prose-sm dark:prose-invert">
            <div className="bg-blue-50 dark:bg-slate-800 border-l-4 border-blue-600 p-6 mb-8 rounded">
              <h2 className="text-xl font-bold text-foreground dark:text-white mt-0 mb-2">Accepting the Terms</h2>
              <p className="text-foreground/80 dark:text-white/80 mb-0">
                If you reside outside of the Republic of Korea, the terms of this agreement govern the relationship between you and Wemade Connect regarding your play or use of, or participation in, Wemade Connect mobile games and related services.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">1. Parties</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>1.1.</strong> These Terms create a legally binding agreement between you ("User" or "you") and Wemade Connect in relation to the Services.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>1.2.</strong> Natural persons as opposed to any kinds of legal entities shall have the right to create an account. By accessing, using and/or submitting content or messages to or through our Services, you represent and agree that you have the legal capacity to agree to accept the Terms of Service in the jurisdiction where you reside.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              <strong>1.3.</strong> You agree to comply with the Terms of Service on behalf of yourself and, at your discretion, any minor children for whom you are the parent or legal guardian and whom you have authorized to use our Services using your account.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">2. About Accessing and Using Our Services</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>2.1 Limited License:</strong> Subject to your agreement and complete compliance with the Terms of Service, we grant you a non-exclusive, non-transferable, non-sublicensable, revocable limited license to access and use our Services for your own personal and non-commercial use.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>2.2 Revocation of Limited License:</strong> We reserve the right to revoke the limited license granted to you in our sole and absolute discretion. We may also limit or terminate your right to access or use our Services or part thereof, maintain or delete your account and any items associated therewith, including but not limited to any Virtual Money or Virtual Goods, without any liability to you.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>2.3 System Outage:</strong> There may be times when our Services or any part thereof are not available for technical or maintenance related reasons. You agree that Wemade Connect has no responsibility and is not liable for unavailability of the Services or any loss caused by such system outages.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>2.4 Game Rules:</strong> The specific game rules, scoring rules, controls and guidelines for each Service form part of the Terms of Service and you agree that you shall comply with them.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>2.5 Third Party Charges:</strong> You are responsible for the internet connection and/or mobile charges that you may incur for playing the Games or using the Services. We are not responsible or liable to you for any credit card or bank-related charges and fees related to your transactions.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              <strong>2.6 Equipment/Internet:</strong> You are responsible for obtaining and maintaining your device, operating system, data connection or network environment, and any services necessary for using the Service under your own responsibility and at your own expense.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">3. Accounts</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>3.1 Guest Account:</strong> If you use the Services without creating a Wemade Connect account, we will create and assign to your device an identifier that is similar to an account number ("Guest Accounts"). Please note that you may not receive customer support or use Virtual Money or Virtual Goods if you change your mobile device without creating a Wemade Connect account.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>3.2 SNS Account:</strong> You may allow our Services to interact with a third party social network or platform. If you choose to connect through a third-party social network such as Facebook, we may collect personal information from your profile on such third-party social networks, such as your name, username, and photograph.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>3.3 Responsibility of Account User:</strong> You are solely and fully responsible for keeping your login details confidential and all uses of your account. You may not use anyone else's account or permit others to use your account at any time. You acknowledge and agree to accept full responsibility for all fees and purchases made through your account.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>3.4 Termination of Inactive Account:</strong> We reserve the right to terminate your account without any notice if your account has not been accessed for more than 1 year since your last accessed time. Any Virtual Money and/or Virtual Goods associated with the terminated account will also be deleted, and no refund will be offered.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              <strong>3.5 Effect of Account Termination:</strong> You understand that if you delete your account, or if we terminate and/or delete your account, you may lose access to any data previously associated with your account.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">4. Virtual Goods and Virtual Money</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>4.1:</strong> Our Services may include fictional currencies such as coins, gold coins and points ("Virtual Money") and virtual items or services for use with our Services ("Virtual Goods"). You can buy Virtual Money from us for real money if you are a legal adult in your country of residence.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>4.2:</strong> You do not own Virtual Goods or Virtual Money but instead you purchase a limited personal revocable license to use Virtual Goods or Virtual Money exclusively within the Services. Virtual Money and Virtual Goods have no cash value and can never be exchanged for real money, goods or services from us or anyone else.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-4">
              <strong>4.3:</strong> You agree that all sales of Virtual Money and Virtual Goods are final and that we will not refund any transaction once it has been made. A license to use Virtual Goods or Virtual Money is granted immediately when your purchase is complete.
            </p>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              <strong>4.4:</strong> We reserve the right to control, regulate, change or remove any Virtual Money or Virtual Goods in our sole discretion and without any liability to you.
            </p>

            <h2 className="text-2xl font-bold text-foreground dark:text-white mb-4">Eligibility</h2>
            <p className="text-foreground/70 dark:text-white/70 mb-6">
              By agreeing with these Terms, you represent that you are thirteen (13) years of age or older. If you are a minor, you represent that your legal guardian has reviewed and agreed to these Terms. Wemade Connect may amend any portion of these Terms at any time by posting or displaying the amended Terms within and/or on the Games, or any of the Websites.
            </p>

            <div className="bg-yellow-50 dark:bg-slate-800 border-l-4 border-yellow-600 p-6 mb-8 rounded">
              <p className="text-foreground/80 dark:text-white/80 mb-0">
                <strong>Important:</strong> By downloading or playing the Game, accessing and/or using the Services, and/or creating a Wemade Connect account, you accept and agree to be bound by these Terms of Service, the Privacy Policy, and Wemade Connect's community standards.
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
