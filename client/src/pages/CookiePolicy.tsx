import Layout from "@/components/Layout";

export default function CookiePolicy() {
  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-primary/10 border-b border-border py-10">
        <div className="container">
          <h1 className="text-3xl font-bold text-foreground">Cookie Policy</h1>
          <p className="text-muted-foreground mt-2 text-sm">Last updated: June 2026</p>
        </div>
      </div>

      <div className="container py-12 max-w-4xl mx-auto">
        <div className="space-y-8">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners. Cookies help us remember your preferences, keep you logged in, and understand how you use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Types of Cookies We Use</h2>

            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Essential Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account authentication. You cannot opt out of these cookies as they are required for the Service to work.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Performance Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies collect information about how visitors use our website, such as which pages are visited most often and whether users receive error messages. This data helps us improve the performance and user experience of our Service.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Functional Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  These cookies allow the website to remember choices you make (such as your preferred language or theme setting) and provide enhanced, more personalized features.
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Analytics Cookies</h3>
                <p className="text-sm text-muted-foreground">
                  We use analytics cookies to understand how users interact with our Service. This helps us measure and improve the performance of our website. The data collected is aggregated and anonymized.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Specific Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-3 border border-border font-semibold text-foreground">Cookie Name</th>
                    <th className="text-left p-3 border border-border font-semibold text-foreground">Purpose</th>
                    <th className="text-left p-3 border border-border font-semibold text-foreground">Duration</th>
                    <th className="text-left p-3 border border-border font-semibold text-foreground">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border border-border text-muted-foreground font-mono text-xs">rou_session</td>
                    <td className="p-3 border border-border text-muted-foreground">User authentication session</td>
                    <td className="p-3 border border-border text-muted-foreground">1 year</td>
                    <td className="p-3 border border-border text-muted-foreground">Essential</td>
                  </tr>
                  <tr className="bg-muted/30">
                    <td className="p-3 border border-border text-muted-foreground font-mono text-xs">theme</td>
                    <td className="p-3 border border-border text-muted-foreground">User theme preference (dark/light)</td>
                    <td className="p-3 border border-border text-muted-foreground">1 year</td>
                    <td className="p-3 border border-border text-muted-foreground">Functional</td>
                  </tr>
                  <tr>
                    <td className="p-3 border border-border text-muted-foreground font-mono text-xs">_umami</td>
                    <td className="p-3 border border-border text-muted-foreground">Anonymous analytics tracking</td>
                    <td className="p-3 border border-border text-muted-foreground">1 year</td>
                    <td className="p-3 border border-border text-muted-foreground">Analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong className="text-foreground">Browser Settings:</strong> Most browsers allow you to refuse or delete cookies through their settings. Note that disabling cookies may affect the functionality of our Service.</li>
              <li><strong className="text-foreground">Theme Preference:</strong> You can change your theme preference at any time using the toggle in the navigation bar.</li>
              <li><strong className="text-foreground">Opt-out Tools:</strong> For analytics cookies, you may use browser extensions or opt-out tools provided by analytics providers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Third-Party Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Some cookies on our site are placed by third-party services. These third parties have their own privacy policies and cookie practices. We do not have control over these cookies. Please refer to the respective third-party privacy policies for more information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. We encourage you to periodically review this page for the latest information on our cookie practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, please contact us at:<br />
              <strong className="text-foreground">Gravity Co., Ltd.</strong><br />
              Email: privacy@gravity.co.kr
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
