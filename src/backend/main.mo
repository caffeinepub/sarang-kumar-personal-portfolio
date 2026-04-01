import Authorization "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor {
  let accessControlState = Authorization.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ── Types ────────────────────────────────────────────────────────
  type Listing = {
    id: Nat;
    title: Text;
    description: Text;
    category: Text;
    price: Text;
    techTags: [Text];
    status: Text;
    featured: Bool;
  };

  type ServicePackage = {
    id: Nat;
    name: Text;
    description: Text;
    price: Text;
    features: [Text];
    popular: Bool;
  };

  type Inquiry = {
    id: Nat;
    caller: Principal;
    clientName: Text;
    email: Text;
    phone: Text;
    message: Text;
    serviceType: Text;
    status: Text;
    notes: Text;
    timestamp: Int;
  };

  type UserActivity = {
    id: Nat;
    principal: Principal;
    principalText: Text;
    action: Text;
    detail: Text;
    timestamp: Int;
  };

  type SearchTermCount = {
    term: Text;
    count: Nat;
  };

  // ── State ────────────────────────────────────────────────────────
  stable var listings: [Listing] = [
    { id=1; title="Corporate Business Website"; description="Professional 5-10 page corporate website with modern design, contact forms, and SEO optimization."; category="Corporate"; price="₹15,000"; techTags=["React","Tailwind","SEO"]; status="available"; featured=true },
    { id=2; title="E-Commerce Store"; description="Full-featured online store with product catalog, cart, payment integration, and admin panel."; category="E-Commerce"; price="₹25,000"; techTags=["React","Node.js","Payment Gateway"]; status="available"; featured=true },
    { id=3; title="Restaurant/Food Business Website"; description="Beautiful menu showcase website with online ordering, table booking, and gallery."; category="Food & Dining"; price="₹12,000"; techTags=["React","Tailwind","Animations"]; status="available"; featured=false },
    { id=4; title="Real Estate Portal"; description="Property listing portal with search, filters, inquiry forms, and agent dashboard."; category="Real Estate"; price="₹30,000"; techTags=["React","Maps API","Database"]; status="available"; featured=true },
    { id=5; title="Education / Coaching Website"; description="Online course platform with student enrollment, video lessons, and certificate generation."; category="Education"; price="₹18,000"; techTags=["React","Video","LMS"]; status="available"; featured=false },
    { id=6; title="Portfolio / Personal Brand Website"; description="Stunning personal portfolio to showcase your work, skills, and attract clients or employers."; category="Portfolio"; price="₹8,000"; techTags=["React","Animations","SEO"]; status="available"; featured=false }
  ];
  stable var nextListingId: Nat = 7;

  stable var packages: [ServicePackage] = [
    { id=1; name="Starter"; description="Perfect for individuals and small businesses just getting started online."; price="₹8,000"; features=["Up to 5 Pages","Responsive Design","Contact Form","Basic SEO","1 Month Support"]; popular=false },
    { id=2; name="Professional"; description="Ideal for growing businesses that need a strong online presence."; price="₹18,000"; features=["Up to 10 Pages","Custom Design","CMS Integration","Advanced SEO","Payment Gateway","3 Months Support"]; popular=true },
    { id=3; name="Enterprise"; description="Full-scale solution for established businesses and complex requirements."; price="₹35,000"; features=["Unlimited Pages","Custom Features","Admin Dashboard","API Integrations","E-Commerce","Priority Support","6 Months Support"]; popular=false }
  ];
  stable var nextPackageId: Nat = 4;

  stable var inquiries: [Inquiry] = [];
  stable var nextInquiryId: Nat = 1;

  stable var activityLog: [UserActivity] = [];
  stable var nextActivityId: Nat = 1;

  // ── AI Agent ─────────────────────────────────────────────────────
  func containsKeyword(text: Text, keyword: Text) : Bool {
    let lowerText = Text.toLowercase(text);
    let lowerKeyword = Text.toLowercase(keyword);
    Text.contains(lowerText, #text lowerKeyword)
  };

  public query func askAgent(userQuery: Text) : async Text {
    let q = Text.toLowercase(userQuery);

    // Greetings
    if (containsKeyword(q, "hello") or containsKeyword(q, "hi ") or containsKeyword(q, "hey") or q == "hi") {
      return "Hello! Welcome to SK Web Solutions. I'm your virtual assistant. I can help you with information about our services, pricing, website marketplace, or anything about Sarang Kumar. How can I assist you today?"
    };

    // Pricing
    if (containsKeyword(q, "price") or containsKeyword(q, "cost") or containsKeyword(q, "fee") or containsKeyword(q, "charge") or containsKeyword(q, "rate") or containsKeyword(q, "how much")) {
      return "Our service packages are:\n\n• Starter – ₹8,000: Up to 5 pages, responsive design, contact form, basic SEO, 1 month support.\n• Professional – ₹18,000: Up to 10 pages, custom design, CMS, advanced SEO, payment gateway, 3 months support.\n• Enterprise – ₹35,000: Unlimited pages, custom features, admin dashboard, API integrations, e-commerce, 6 months support.\n\nIndividual website templates start from ₹8,000. Want to get a custom quote? Submit an inquiry through our Contact page!"
    };

    // Services
    if (containsKeyword(q, "service") or containsKeyword(q, "what do you do") or containsKeyword(q, "what you offer") or containsKeyword(q, "offer") or containsKeyword(q, "provide")) {
      return "SK Web Solutions offers:\n\n• Custom Website Design & Development\n• E-Commerce Stores\n• Corporate & Business Websites\n• Portfolio & Personal Brand Sites\n• Restaurant & Food Business Sites\n• Real Estate Portals\n• Education & Coaching Platforms\n• Website Redesign & Revamp\n• Ongoing Maintenance & Support\n• SEO Optimization\n\nAll websites are built with modern React technology, fully responsive, and professionally designed. Visit our Services page for detailed packages!"
    };

    // E-commerce
    if (containsKeyword(q, "ecommerce") or containsKeyword(q, "e-commerce") or containsKeyword(q, "online store") or containsKeyword(q, "shop")) {
      return "Yes! We build full-featured E-Commerce stores starting at ₹25,000. Features include:\n\n• Product catalog with categories\n• Shopping cart & wishlist\n• Payment gateway integration\n• Admin panel for orders & inventory\n• Customer accounts\n• Mobile-responsive design\n\nInterested? Submit an inquiry and Sarang will get back to you within 24 hours!"
    };

    // Contact
    if (containsKeyword(q, "contact") or containsKeyword(q, "reach") or containsKeyword(q, "email") or containsKeyword(q, "phone") or containsKeyword(q, "whatsapp") or containsKeyword(q, "call")) {
      return "You can reach Sarang Kumar through:\n\n• Email: sarangkumar408@gmail.com\n• LinkedIn: linkedin.com/in/sarang-kumar-854214257\n• Contact Form: Use the Contact page on this website to submit your requirements\n\nSarang typically responds within 24 hours. For urgent queries, mention it in your message!"
    };

    // Inquiry / Hire
    if (containsKeyword(q, "hire") or containsKeyword(q, "enquir") or containsKeyword(q, "inquir") or containsKeyword(q, "book") or containsKeyword(q, "order") or containsKeyword(q, "get started") or containsKeyword(q, "start a project")) {
      return "Great! Here's how to get started:\n\n1. Go to the Contact page on this website\n2. Fill in your name, email, and project requirements\n3. Select the service type\n4. Submit the inquiry form\n\nSarang will review your requirements and get back to you within 24 hours with a detailed proposal and timeline. You can also email directly at sarangkumar408@gmail.com!"
    };

    // Marketplace / Listings
    if (containsKeyword(q, "marketplace") or containsKeyword(q, "listing") or containsKeyword(q, "template") or containsKeyword(q, "ready") or containsKeyword(q, "available website")) {
      return "Our Website Marketplace has ready-to-deploy website templates including:\n\n• Corporate Business Website – ₹15,000\n• E-Commerce Store – ₹25,000\n• Restaurant/Food Business Website – ₹12,000\n• Real Estate Portal – ₹30,000\n• Education/Coaching Website – ₹18,000\n• Portfolio/Personal Brand Website – ₹8,000\n\nVisit the Marketplace tab to browse all listings with full details, features, and tech stack!"
    };

    // About Sarang / Personal
    if (containsKeyword(q, "sarang") or containsKeyword(q, "who are you") or containsKeyword(q, "about you") or containsKeyword(q, "developer") or containsKeyword(q, "designer") or containsKeyword(q, "founder") or containsKeyword(q, "owner")) {
      return "Sarang Kumar is a professional Web Designer & Developer based in Hyderabad, India. He is the founder of SK Web Solutions.\n\nSkills & Expertise:\n• Website Design & Development (React, HTML, CSS, JavaScript, Tailwind)\n• Data Analysis\n• Credit Management\n• Business Process Automation\n\nSarang has built multiple business websites across industries including corporate, e-commerce, real estate, food & dining, and education. He combines technical expertise with business understanding to deliver websites that drive real results.\n\nView his full personal portfolio using the \"Personal Portfolio\" button at the top of the site!"
    };

    // Skills / Technology
    if (containsKeyword(q, "skill") or containsKeyword(q, "tech") or containsKeyword(q, "technology") or containsKeyword(q, "react") or containsKeyword(q, "javascript") or containsKeyword(q, "html") or containsKeyword(q, "css")) {
      return "SK Web Solutions builds websites using modern technologies:\n\n• Frontend: React, TypeScript, Tailwind CSS, HTML5, CSS3\n• Animations: Framer Motion\n• Backend: Node.js, ICP (Internet Computer)\n• E-Commerce: Payment gateway integrations\n• APIs: RESTful APIs, third-party integrations\n• SEO: On-page optimization, meta tags, performance\n• Data: Analytics, reporting dashboards\n\nAll websites are mobile-responsive, fast-loading, and built to modern standards!"
    };

    // Timeline / How long
    if (containsKeyword(q, "time") or containsKeyword(q, "how long") or containsKeyword(q, "days") or containsKeyword(q, "weeks") or containsKeyword(q, "deliver") or containsKeyword(q, "deadline")) {
      return "Project timelines depend on complexity:\n\n• Simple Portfolio/Landing Page: 3-5 days\n• Business Website (5-10 pages): 7-14 days\n• E-Commerce Store: 14-21 days\n• Custom Web Application: 21-45 days\n\nRush delivery is available for urgent projects. Timeline will be confirmed after reviewing your requirements. Submit an inquiry to get a precise estimate!"
    };

    // Support / Maintenance
    if (containsKeyword(q, "support") or containsKeyword(q, "maintain") or containsKeyword(q, "update") or containsKeyword(q, "bug") or containsKeyword(q, "fix")) {
      return "All our packages include post-delivery support:\n\n• Starter: 1 month free support\n• Professional: 3 months free support\n• Enterprise: 6 months free support\n\nAfter the free support period, maintenance plans are available at competitive rates. This covers bug fixes, content updates, security patches, and minor feature additions. Contact us for a custom maintenance plan!"
    };

    // SEO
    if (containsKeyword(q, "seo") or containsKeyword(q, "google") or containsKeyword(q, "search engine") or containsKeyword(q, "rank") or containsKeyword(q, "visibility")) {
      return "Yes, we optimize all websites for search engines! Our SEO services include:\n\n• On-page SEO (meta titles, descriptions, headings)\n• Fast loading speed optimization\n• Mobile-responsive design (Google ranking factor)\n• Structured data markup\n• Google Search Console submission\n• Sitemap generation\n\nBasic SEO is included in all packages. Advanced SEO campaigns are available as an add-on. Get in touch to discuss your visibility goals!"
    };

    // Refund / Guarantee
    if (containsKeyword(q, "refund") or containsKeyword(q, "guarantee") or containsKeyword(q, "warranty") or containsKeyword(q, "satisfaction")) {
      return "SK Web Solutions is committed to 100% client satisfaction. Here's our approach:\n\n• We share design mockups before development begins\n• Multiple revision rounds are included\n• You approve before final delivery\n• Post-delivery support is included in all packages\n\nFor specific refund or revision policies, please discuss this during the inquiry stage. We believe in transparent communication and ensuring you love your website!"
    };

    // Portfolio examples
    if (containsKeyword(q, "portfolio") or containsKeyword(q, "example") or containsKeyword(q, "sample") or containsKeyword(q, "previous work") or containsKeyword(q, "showcase")) {
      return "You can view Sarang's work in two ways:\n\n1. Personal Portfolio – Click the \"Personal Portfolio\" button at the top of this page to see his professional showcase, skills, and experience.\n\n2. AI Demo Productions – Visit https://sarangkumarnetwork.my.canva.site/sarang-productions for more creative work samples.\n\n3. Website Marketplace – The listings in our marketplace represent types of websites we build. Each listing shows the tech stack and features included."
    };

    // Location
    if (containsKeyword(q, "location") or containsKeyword(q, "where") or containsKeyword(q, "hyderabad") or containsKeyword(q, "india") or containsKeyword(q, "city")) {
      return "SK Web Solutions is based in Hyderabad, India. We serve clients across India and internationally. Since all our work is delivered digitally, we can work with clients anywhere in the world! Communication happens via email, phone, and video calls."
    };

    // Payment methods
    if (containsKeyword(q, "payment") or containsKeyword(q, "pay") or containsKeyword(q, "upi") or containsKeyword(q, "bank") or containsKeyword(q, "transfer")) {
      return "We accept multiple payment methods for your convenience:\n\n• UPI (Google Pay, PhonePe, Paytm)\n• Bank Transfer (NEFT/IMPS)\n• PayPal (for international clients)\n\nTypically, payment is split: 50% advance to start the project, 50% upon delivery. For smaller projects, full payment upfront may apply. All payment details will be confirmed during the inquiry process."
    };

    // Thank you
    if (containsKeyword(q, "thank") or containsKeyword(q, "thanks") or containsKeyword(q, "bye") or containsKeyword(q, "goodbye")) {
      return "Thank you for reaching out to SK Web Solutions! It was a pleasure assisting you. If you have any more questions in the future, don't hesitate to ask. We look forward to potentially working with you! Have a great day! 😊"
    };

    // Default fallback
    "Thank you for your question! I may not have a specific answer for that, but I'd be happy to help you further. Please contact Sarang directly:\n\n• Email: sarangkumar408@gmail.com\n• LinkedIn: linkedin.com/in/sarang-kumar-854214257\n• Or use the Contact page to submit your inquiry\n\nYou can also ask me about: services, pricing, website types, timelines, technology, SEO, support, or anything about Sarang Kumar!"
  };

  // ── Listings ───────────────────────────────────────────────────────
  public query func getListings() : async [Listing] { listings };

  public shared({ caller }) func addListing(l: Listing) : async Nat {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) {
      return 0;
    };
    let newId = nextListingId;
    nextListingId += 1;
    let newL = { id=newId; title=l.title; description=l.description; category=l.category; price=l.price; techTags=l.techTags; status=l.status; featured=l.featured };
    listings := Array.append(listings, [newL]);
    newId
  };

  public shared({ caller }) func updateListing(l: Listing) : async Bool {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) { return false };
    listings := Array.map(listings, func(x: Listing) : Listing {
      if (x.id == l.id) l else x
    });
    true
  };

  public shared({ caller }) func deleteListing(id: Nat) : async Bool {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) { return false };
    listings := Array.filter(listings, func(x: Listing) : Bool { x.id != id });
    true
  };

  // ── Service Packages ───────────────────────────────────────────────
  public query func getPackages() : async [ServicePackage] { packages };

  public shared({ caller }) func updatePackage(p: ServicePackage) : async Bool {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) { return false };
    packages := Array.map(packages, func(x: ServicePackage) : ServicePackage {
      if (x.id == p.id) p else x
    });
    true
  };

  // ── Inquiries ───────────────────────────────────────────────────────
  public shared({ caller }) func submitInquiry(clientName: Text, email: Text, phone: Text, message: Text, serviceType: Text) : async Nat {
    let id = nextInquiryId;
    nextInquiryId += 1;
    let inq: Inquiry = { id; caller; clientName; email; phone; message; serviceType; status="new"; notes=""; timestamp=Time.now() };
    inquiries := Array.append(inquiries, [inq]);
    id
  };

  public shared query({ caller }) func getMyInquiries() : async [Inquiry] {
    Array.filter(inquiries, func(x: Inquiry) : Bool { x.caller == caller })
  };

  public shared query({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) { return [] };
    inquiries
  };

  public shared({ caller }) func updateInquiryStatus(id: Nat, status: Text, notes: Text) : async Bool {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) { return false };
    inquiries := Array.map(inquiries, func(x: Inquiry) : Inquiry {
      if (x.id == id) { { x with status; notes } } else x
    });
    true
  };

  // ── Activity Tracking ───────────────────────────────────────────────
  public shared({ caller }) func logActivity(action: Text, detail: Text) : async () {
    if (Principal.isAnonymous(caller)) { return };
    let id = nextActivityId;
    nextActivityId += 1;
    let entry: UserActivity = {
      id;
      principal = caller;
      principalText = Principal.toText(caller);
      action;
      detail;
      timestamp = Time.now();
    };
    let current = if (activityLog.size() >= 500) {
      Array.tabulate(499, func(i: Nat) : UserActivity { activityLog[activityLog.size() - 499 + i] })
    } else {
      activityLog
    };
    activityLog := Array.append(current, [entry]);
  };

  public shared query({ caller }) func getActivityLog() : async [UserActivity] {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) { return [] };
    let size = activityLog.size();
    let limit = if (size > 200) 200 else size;
    let startIdx = size - limit;
    let slice = Array.tabulate(limit, func(i: Nat) : UserActivity {
      activityLog[startIdx + i]
    });
    Array.tabulate(limit, func(i: Nat) : UserActivity { slice[limit - 1 - i] })
  };

  public shared query({ caller }) func getSearchTerms() : async [SearchTermCount] {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) { return [] };
    let searches = Array.filter(activityLog, func(x: UserActivity) : Bool { x.action == "search" and x.detail != "" });
    var result: [SearchTermCount] = [];
    for (entry in Iter.fromArray(searches)) {
      let term = entry.detail;
      var found = false;
      result := Array.map(result, func(r: SearchTermCount) : SearchTermCount {
        if (r.term == term) { found := true; { term = r.term; count = r.count + 1 } }
        else r
      });
      if (not found) {
        result := Array.append(result, [{ term; count = 1 }]);
      };
    };
    result
  };

  // ── Insights ───────────────────────────────────────────────────────
  public shared query({ caller }) func getInsights() : async (Nat, Nat, Nat, Nat) {
    if (not (Authorization.hasPermission(accessControlState, caller, #admin))) { return (0,0,0,0) };
    let totalListings = listings.size();
    let availableListings = Array.filter(listings, func(x: Listing) : Bool { x.status == "available" }).size();
    let totalInquiries = inquiries.size();
    let newInquiries = Array.filter(inquiries, func(x: Inquiry) : Bool { x.status == "new" }).size();
    (totalListings, availableListings, totalInquiries, newInquiries)
  };
};
