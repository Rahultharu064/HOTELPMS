import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, FileText } from "lucide-react";
import PageHero from "../../components/publicwebsite/Homepage/layout/PageHero";

type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const LAST_UPDATED = "November 10, 2026";

const LegalDocument = ({
  title,
  intro,
  sections,
  icon: Icon,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  icon: typeof ShieldCheck;
}) => {
  useEffect(() => {
    document.title = `${title} | Itahari Namuna College`;
  }, [title]);

  return (
  <main className="min-h-[60vh] bg-neutral-light pb-16 sm:pb-20">
    <PageHero
      title={title}
      subtitle={intro}
      breadcrumbs={[{ label: "Home", to: "/" }, { label: title }]}
      image="/hero122.png"
    />

    <div className="container-custom -mt-8 relative z-10">
      <article className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm sm:rounded-3xl">
        <header className="flex flex-col gap-4 border-b border-neutral-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-green/8 text-primary-green">
              <Icon size={21} strokeWidth={1.8} />
            </span>
            <div>
              <p className="text-sm font-semibold text-primary-dark">Itahari Namuna College</p>
              <p className="mt-0.5 text-xs text-neutral-text-secondary">Hotel &amp; Property Management</p>
            </div>
          </div>
          <p className="text-xs text-neutral-text-secondary">Last updated {LAST_UPDATED}</p>
        </header>

        <div className="divide-y divide-neutral-border px-5 sm:px-8">
          {sections.map((section, index) => (
            <section key={section.title} className="py-6 sm:py-7">
              <h2 className="text-lg font-semibold tracking-tight text-primary-dark sm:text-xl">
                <span className="mr-2 text-sm font-medium text-primary-green">{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-neutral-text-secondary sm:text-[15px]">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && (
                  <ul className="list-disc space-y-2 pl-5 marker:text-primary-green">
                    {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="m-5 flex flex-col gap-3 rounded-xl bg-[#f5f6f1] p-4 sm:m-8 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <p className="text-sm font-semibold text-primary-dark">Questions about this document?</p>
            <p className="mt-1 text-sm text-neutral-text-secondary">Contact the college hotel team for help.</p>
          </div>
          <Link to="/contact" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            Contact us <ArrowRight size={16} />
          </Link>
        </div>
      </article>
    </div>
  </main>
  );
};

export const PrivacyPolicyPage = () => (
  <LegalDocument
    title="Privacy Policy"
    intro="How Itahari Namuna College handles information when you browse, create an account, or make a hotel booking."
    icon={ShieldCheck}
    sections={[
      {
        title: "Who this policy covers",
        paragraphs: [
          "This policy applies to the Itahari Namuna College hotel and property-management website and the guest services available through it. It explains what information may be used to manage guest accounts, enquiries, reservations, and hotel operations.",
          "The site supports hospitality operations associated with the college. If a separate notice is shown for a particular service, that notice also applies to that service.",
        ],
      },
      {
        title: "Information you provide",
        paragraphs: ["Depending on how you use the site, you may provide information such as:"],
        bullets: [
          "Contact and account details, such as your name, email address, and phone number.",
          "Reservation details, including selected room, stay dates, guest count, and special requests.",
          "Identity-document details or an uploaded proof image when requested as part of a booking or check-in process.",
          "Messages, feedback, or other information you choose to send to the hotel team.",
        ],
      },
      {
        title: "How information is used",
        paragraphs: ["Information is used for the purposes connected to the service you request, including to:"],
        bullets: [
          "Create and maintain guest accounts and respond to enquiries.",
          "Check room options, prepare and manage reservations, and support check-in and check-out.",
          "Record payments and provide booking-related updates or service messages.",
          "Support hotel operations, protect accounts and transactions, and troubleshoot the website.",
          "Review guest feedback and improve the services offered by the college hotel.",
        ],
      },
      {
        title: "Payments and service providers",
        paragraphs: [
          "If you select an online payment option, the payment is handled through the payment provider presented during checkout. That provider may process payment details under its own privacy terms. The hotel website receives information needed to identify and update the related transaction; do not send card or payment credentials through general contact messages.",
          "The website may rely on service providers to host, operate, or maintain parts of the service. Access should be limited to what is needed to provide those services and support the hotel’s operations.",
        ],
      },
      {
        title: "Identity documents and sensitive details",
        paragraphs: [
          "Please provide identity information only when it is requested for a booking or guest-verification step. Avoid including identity numbers or document images in general enquiries, reviews, or other fields that do not request them.",
          "If you believe you uploaded information by mistake, contact the hotel team through the Contact page and tell us which account or reservation it relates to. Do not include the full identity number in your message.",
        ],
      },
      {
        title: "Storage, security, and retention",
        paragraphs: [
          "The college uses administrative and technical measures intended to protect information handled by the site. No website or method of electronic storage can be guaranteed completely secure, so please keep your password private and sign out on shared devices.",
          "Information is retained for as long as it is needed to manage the account, reservation, hotel operations, and applicable record-keeping requirements. Retention can vary by the type of information and the reason it was collected.",
        ],
      },
      {
        title: "Your choices and requests",
        paragraphs: [
          "You can review and update some account details through your guest profile. You may also contact the hotel team to ask about access, correction, or deletion of information associated with your account or a reservation. We may need to verify your identity and may retain records that are required for an active booking or legitimate record-keeping purpose.",
        ],
      },
      {
        title: "Children and third-party links",
        paragraphs: [
          "The booking service is intended to be used by adults making or managing a reservation. A parent or guardian should handle a booking involving a minor and provide only details needed for the stay.",
          "Links to payment providers or other external websites are governed by those services’ own privacy notices. The college does not control their independent practices.",
        ],
      },
      {
        title: "Updates and contact",
        paragraphs: [
          "This policy may be updated when the website or guest services change. The latest revision date is shown above. For privacy questions or requests, use the Contact page and identify the account or booking involved without including unnecessary sensitive information.",
        ],
      },
    ]}
  />
);

export const TermsOfServicePage = () => (
  <LegalDocument
    title="Terms of Service"
    intro="The basic terms for using the Itahari Namuna College hotel website and its guest booking services."
    icon={FileText}
    sections={[
      {
        title: "Using this website",
        paragraphs: [
          "This website is provided by Itahari Namuna College for information about its hotel services and to support guest enquiries, accounts, and reservations. By using the website, you agree to use it lawfully and provide information that is accurate to the best of your knowledge.",
          "You must not misuse the website, attempt to access another person’s account, interfere with its operation, or submit content that is unlawful, misleading, or harmful to others.",
        ],
      },
      {
        title: "Accounts and account security",
        paragraphs: [
          "You are responsible for keeping your login details private and for activity carried out through your account. Notify the hotel team if you suspect someone has accessed your account without permission. Account access may be restricted when needed to protect guests or the service.",
        ],
      },
      {
        title: "Room information and availability",
        paragraphs: [
          "Room descriptions, images, amenities, prices, and availability are provided to help you plan a stay. Availability and rates can change until a reservation is completed and confirmed. If any information appears incorrect, contact the hotel team before relying on it.",
          "A search or selection is not itself a confirmed reservation. Follow the booking process and review the dates, guest details, selected room, and total shown before submitting your booking.",
        ],
      },
      {
        title: "Reservations and payment",
        paragraphs: [
          "You must provide current and complete information needed to manage the reservation, including guest contact and stay details. The booking is subject to the room, dates, and total displayed in the final booking flow and any confirmation issued by the hotel.",
          "Payment options are presented during checkout and may be processed by an external payment provider. A payment status shown by the site or provider is used to update the reservation; keep your confirmation for reference and contact the hotel if a payment appears to have succeeded but the booking is not confirmed.",
          "Any applicable deposit, cancellation, amendment, arrival, departure, or refund conditions should be reviewed in the booking information or confirmation for your specific stay. Contact the hotel team if a condition is unclear before completing the reservation.",
        ],
      },
      {
        title: "Guest conduct and property rules",
        paragraphs: [
          "Guests are expected to follow the property’s directions and reasonable safety, occupancy, and conduct requirements during a stay. The hotel may contact the guest listed on a reservation when information needs clarification or an operational issue arises.",
          "Where identity verification is requested, the guest is responsible for providing accurate details through the designated booking or check-in step. Do not send identity documents through unrelated forms or public review content.",
        ],
      },
      {
        title: "Reviews and other submissions",
        paragraphs: [
          "If you submit a review, enquiry, or other content, you are responsible for ensuring it is truthful, relevant, and does not disclose another person’s private information. The college may moderate or remove content that is abusive, unlawful, or unrelated to the service.",
        ],
      },
      {
        title: "External services and website availability",
        paragraphs: [
          "Some functions may depend on external payment, hosting, or communication services. Those services may have separate terms. The website may occasionally be unavailable for maintenance or technical reasons, and features may be changed to keep the service operating safely.",
        ],
      },
      {
        title: "Changes and contact",
        paragraphs: [
          "These terms may be updated as the website or hotel services change. The latest revision date appears above. Continued use after an update means you are using the current website under the revised terms. For questions about these terms or a reservation, contact the hotel team through the Contact page.",
        ],
      },
    ]}
  />
);
