import { useSearchParams } from 'react-router-dom';

const TERMS = [
  {
    h: '1. Acceptance',
    p: 'By using Nestoria, you agree to these terms. If you do not agree, please do not use the platform. We may update these terms from time to time; the date at the bottom indicates the most recent revision.',
  },
  {
    h: '2. Accounts',
    p: 'You are responsible for the security of your account and password. You must be at least 18 years old to make a booking. We may suspend or terminate accounts that abuse the platform or violate these terms.',
  },
  {
    h: '3. Bookings',
    p: 'A booking is a contract between you and the host of the property. Nestoria facilitates the booking and payment but is not a party to the stay itself. Prices shown include all applicable taxes; the host receives the booking total less our 10% platform fee.',
  },
  {
    h: '4. Cancellations and refunds',
    p: 'Free cancellation is available up to 48 hours before check-in. Within 48 hours, the first night is charged. After check-in, no refund will be issued. Hosts may offer credit at their discretion. Refunds are processed back to the original payment method within 7 business days.',
  },
  {
    h: '5. Host responsibilities',
    p: 'Hosts warrant that their listings are accurate, that they have legal authority to rent the property, and that they will honour confirmed bookings. Repeated cancellations by a host may result in delisting.',
  },
  {
    h: '6. Conduct',
    p: 'Guests agree to treat properties with care and respect house rules. Damages may be charged back to the guest at the host\'s reasonable discretion. Harassment of hosts or other guests is grounds for permanent removal from the platform.',
  },
  {
    h: '7. Intellectual property',
    p: 'All Nestoria-branded content — including photographs, illustrations, and editorial copy — is owned by Nestoria Inc. or its content partners. You may share links to listings; please do not reproduce content without permission.',
  },
  {
    h: '8. Limitation of liability',
    p: 'Nestoria is not liable for damages arising from the conduct of hosts, guests, or third parties. Our maximum liability for any claim is limited to the total amount you paid for the booking giving rise to the claim.',
  },
  {
    h: '9. Governing law',
    p: 'These terms are governed by the laws of India. Any dispute will be resolved in the courts of Bangalore, Karnataka.',
  },
  {
    h: '10. Contact',
    p: 'Questions about these terms? Write to legal@nestoria.example.',
  },
];

const PRIVACY = [
  {
    h: 'What we collect',
    p: 'Account information (name, email, phone, password hash), booking history, profile details you choose to add, and basic usage data — pages visited, search queries, IP address, browser. We do not run third-party analytics or advertising scripts.',
  },
  {
    h: 'How we use it',
    p: 'To process bookings, send confirmations, support you when you contact us, prevent fraud, and improve the platform. We never sell your data. We never use your data to train AI models. We never share your identifiable data with hosts beyond what they need to host you.',
  },
  {
    h: 'Cookies',
    p: 'We use one cookie: a session cookie that keeps you logged in. We do not use tracking cookies, advertising cookies, or third-party cookies. Clearing your browser cookies will log you out — that is the only effect.',
  },
  {
    h: 'Third parties',
    p: 'We use Supabase for image storage, Google Identity Services if you choose to sign in with Google, and our payment provider for charges. Each of these handles only the minimum data required for their function. We do not share data with anyone else.',
  },
  {
    h: 'How long we keep it',
    p: 'Account data for as long as the account is active. Booking records for 7 years (required for tax purposes in India). Contact-form messages for 1 year. You can request earlier deletion by writing to us.',
  },
  {
    h: 'Your rights',
    p: 'You can access, correct, or delete your data at any time. Email privacy@nestoria.example and we will respond within 7 days. We will never charge you to exercise these rights.',
  },
  {
    h: 'Security',
    p: 'Passwords are hashed with bcrypt. Connections are TLS-encrypted. The database is access-controlled and audit-logged. If we ever experience a breach affecting your data, we will notify you within 72 hours.',
  },
  {
    h: 'Children',
    p: 'Nestoria is not directed at children under 18. We do not knowingly collect data from minors.',
  },
  {
    h: 'Updates',
    p: 'If we substantively change this policy we will email registered users at least 30 days before the change takes effect.',
  },
  {
    h: 'Contact',
    p: 'Privacy questions go to privacy@nestoria.example.',
  },
];

export default function LegalScreen() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'privacy' ? 'privacy' : 'terms';
  const items = tab === 'terms' ? TERMS : PRIVACY;

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 80, maxWidth: 900 }}>
      <div className="mb-8">
        <div className="eyebrow mb-3">— Legal</div>
        <h1 className="h-1">{tab === 'terms' ? 'Terms of service' : 'Privacy policy'}</h1>
        <p className="text-muted mt-3" style={{ fontSize: 14 }}>Last updated 24 May 2026.</p>
      </div>

      <div className="tabs-bar">
        <button className={tab === 'terms' ? 'is-active' : ''} onClick={() => setParams({})}>Terms</button>
        <button className={tab === 'privacy' ? 'is-active' : ''} onClick={() => setParams({ tab: 'privacy' })}>Privacy</button>
      </div>

      <div className="stack" style={{ '--gap': '32px', marginTop: 16 }}>
        {items.map((s) => (
          <section key={s.h}>
            <h2 className="h-3 mb-3">{s.h}</h2>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--ink-2)', maxWidth: 720 }}>{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
