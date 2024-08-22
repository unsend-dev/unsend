import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="mx-auto mt-20">
      <div className="flex flex-col gap-12">
        <div>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
          <p className="mb-4 text-muted-foreground">
            Last Updated: Aug 22, 2024
          </p>

          <p className="mb-4 text-primary">
            Unsend is committed to protecting your privacy. This Privacy Policy
            outlines how we collect, use, and disclose your information when you
            use Unsend.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">
            1. Information We Collect
          </h2>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            Personal Information
          </h3>
          <p className="mb-4 opacity-90 ">
            When you create an account, we collect your email address and name.
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Usage Data</h3>
          <p className="mb-4 opacity-90 ">
            We automatically collect information about how you interact with the
            Service, such as pages visited and features used.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>
          <p className="mb-4 opacity-90 ">
            We use your information for the following purposes:
          </p>
          <ul className="list-disc list-inside mb-4 opacity-90">
            <li>To provide and maintain the Service</li>
            <li>To improve and personalize your experience with the Service</li>
            <li>
              To communicate with you about updates, promotions, and customer
              support
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            3. Sharing Your Information
          </h2>
          <p className="mb-4 opacity-90">
            We do not sell, rent or your personal information with third
            parties.
          </p>
          <p className="mb-4 opacity-90">
            We are using following third party services to run this service.
          </p>
          <ul className="list-disc list-inside mb-4 opacity-90 gap-2 flex flex-col mt-2">
            <li>
              <a
                href="https://railway.app/"
                className=" underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Railway
              </a>
              : this is where unsend is hosted. currently in US region
            </li>
            <li>
              <a
                href="https://aws.amazon.com/ses/"
                className=" underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                AWS
              </a>
              : unsend uses AWS SES to process your mails
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-4 opacity-90">
            We take reasonable steps to protect your information from
            unauthorized access, use, or disclosure. However, no method of
            transmission or storage is completely secure, and we cannot
            guarantee the absolute security of your information.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
          <p className="mb-4 opacity-90">
            We retain your personal information for as long as necessary to
            provide the Service, comply with legal obligations, resolve
            disputes, and enforce our agreements.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
          <p className="mb-4 opacity-90">
            You may access, update, or request the deletion of your personal
            information by contacting us at hello@unsend.dev.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
          <p className="mb-4 opacity-90">
            The Service is not intended for users under 13 years old. We do not
            knowingly collect personal information from children under 13. If
            you are a parent or guardian and believe your child has provided us
            with personal information, please contact us at hello@unsend.dev.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            8. Changes to This Policy
          </h2>
          <p className="mb-4 opacity-90">
            We may update this Policy from time to time. We will notify you of
            any changes by posting the updated Policy on this page. By
            continuing to use the Service, you agree to be bound by the updated
            Policy.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
          <p className="mb-4 opacity-90">
            If you have any questions or concerns regarding this Privacy Policy,
            please contact us at hello@unsend.dev.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
