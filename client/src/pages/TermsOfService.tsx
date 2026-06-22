import Layout from "@/components/Layout";

export default function TermsOfService() {
  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/10 border-b border-border py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground mt-2 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="container py-12 max-w-4xl mx-auto">
        <div className="space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the Ragnarok Universe gaming portal ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all the terms and conditions, you may not access or use the Service. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your account information remains accurate and up to date</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Age Verification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 13 years of age to use this Service. Certain features, including the Point Shop and in-game purchases, may require you to be at least 20 years of age. By using these features, you confirm that you meet the applicable age requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Prohibited Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You agree not to engage in any of the following:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Using the Service for any unlawful purpose</li>
              <li>Attempting to gain unauthorized access to any part of the Service</li>
              <li>Transmitting any harmful, offensive, or disruptive content</li>
              <li>Impersonating any person or entity</li>
              <li>Interfering with or disrupting the integrity of the Service</li>
              <li>Using automated tools to scrape or extract data without permission</li>
              <li>Engaging in cheating, hacking, or exploiting game mechanics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service and its original content, features, and functionality are and will remain the exclusive property of Gravity Co., Ltd. and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Gravity Co., Ltd.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Virtual Items and Point Shop</h2>
            <p className="text-muted-foreground leading-relaxed">
              Virtual items, currency, and other digital goods purchased through the Point Shop are licensed to you, not sold. These items have no real-world monetary value and cannot be exchanged for real currency. All purchases are final and non-refundable unless required by applicable law. We reserve the right to modify, suspend, or discontinue any virtual items at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Gravity Co., Ltd. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service, even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the "Last updated" date. Your continued use of the Service after changes constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at:<br />
              <strong className="text-foreground">Gravity Co., Ltd.</strong><br />
              Email: legal@gravity.co.kr<br />
              Address: Seoul, South Korea
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
