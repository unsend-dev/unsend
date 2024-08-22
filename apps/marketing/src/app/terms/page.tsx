import React from "react";

const TermsOfService = () => {
  return (
    <div className="mx-auto mt-20">
      <div className="flex flex-col gap-12">
        <div>
          <h1 className="text-2xl font-semibold">Terms of Service</h1>
          <p className="mb-4 text-muted-foreground">
            Last Updated: Apr 22, 2024
          </p>

          <p className="mb-4 text-primary">
            By using Unsend, you agree to these Terms of Service. Unsend
            reserves the right to modify these Terms at any time. By continuing
            to use the Service, you agree to the updated Terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">1. Agreement</h2>
          <p className="mb-4 opacity-90">
            By using Unsend, you agree to these Terms of Service. Unsend
            reserves the right to modify these Terms at any time. By continuing
            to use the Service, you agree to the updated Terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">2. Eligibility</h2>
          <p className="mb-4 opacity-90">
            You must be at least 13 years old to use the Service. By using the
            Service, you represent that you meet this age requirement.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">3. Acceptable Use</h2>
          <p className="mb-4 opacity-90">
            You agree not to use the Service for any illegal or harmful
            activities. We reserve the right to terminate your access to the
            Service if you violate this provision.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">4. Termination</h2>
          <p className="mb-4 opacity-90">
            We reserve the right to suspend or terminate your access to the
            Service at any time, with or without notice, for any reason.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            5. Disclaimers and Limitation of Liability
          </h2>
          <p className="mb-4 opacity-90">
            The Service is provided "as is" and "as available," without
            warranties of any kind. We disclaim all liability for any damages or
            losses arising from your use of the Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">6. Governing Law</h2>
          <p className="mb-4 opacity-90">
            These Terms shall be governed by the laws of US. Any disputes
            arising from these Terms shall be resolved in the courts located in
            US.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">7. Privacy</h2>
          <p className="mb-4 opacity-90">
            Please read our{" "}
            <a className="underline" href="/privacy">
              privacy policy
            </a>
            .
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">8. Contact</h2>
          <p className="mb-4 opacity-90">
            If you have any questions or concerns regarding these Terms, please
            contact us at hello@unsend.dev.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
