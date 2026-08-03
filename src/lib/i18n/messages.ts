import type { Locale } from "./config";

export type MessageKey =
  | "nav.home"
  | "nav.about"
  | "nav.services"
  | "nav.insights"
  | "nav.events"
  | "nav.partners"
  | "nav.contact"
  | "home.viewAllInsights"
  | "home.viewAllEvents"
  | "home.partnersTitle"
  | "home.clientsTitle"
  | "home.hero.title"
  | "home.hero.text"
  | "home.hero.aboutLabel"
  | "home.hero.servicesLabel"
  | "home.whatWeDo.title"
  | "home.whatWeDo.text"
  | "home.whoWeServe.title"
  | "home.whoWeServe.text"
  | "home.strategy.label"
  | "home.strategy.title"
  | "home.strategy.text"
  | "home.strategy.button"
  | "home.strategy.point1"
  | "home.strategy.point2"
  | "home.strategy.point3"
  | "home.about.label"
  | "home.about.title"
  | "home.about.p1"
  | "home.about.p2"
  | "home.about.p3"
  | "home.about.visionTitle"
  | "home.about.visionText"
  | "home.about.missionTitle"
  | "home.about.missionText"
  | "home.about.valuesLabel"
  | "home.about.valuesTitle"
  | "home.value.0.title"
  | "home.value.0.desc"
  | "home.value.1.title"
  | "home.value.1.desc"
  | "home.value.2.title"
  | "home.value.2.desc"
  | "home.value.3.title"
  | "home.value.3.desc"
  | "home.value.4.title"
  | "home.value.4.desc"
  | "home.services.label"
  | "home.services.title"
  | "home.services.intro"
  | "home.services.practiceArea"
  | "home.services.count"
  | "home.contact.label"
  | "home.contact.title"
  | "home.contact.infoTitle"
  | "home.contact.infoCopy"
  | "home.contact.address"
  | "home.contact.email"
  | "home.contact.phone"
  | "home.contact.fullName"
  | "home.contact.phoneField"
  | "home.contact.message"
  | "home.contact.thankYou"
  | "home.contact.thankYouCopy"
  | "home.contact.openFull"
  | "home.insights.label"
  | "home.insights.title"
  | "home.events.title"
  | "home.events.intro"
  | "services.label"
  | "services.title"
  | "events.upcoming"
  | "events.past"
  | "events.viewDetails"
  | "contact.send"
  | "common.readMore"
  | "common.learnMore"
  | "common.back";

const en: Record<MessageKey, string> = {
  "nav.home": "Home",
  "nav.about": "About Us",
  "nav.services": "Services",
  "nav.insights": "Insights",
  "nav.events": "Events",
  "nav.partners": "Partners",
  "nav.contact": "Contact",
  "home.viewAllInsights": "View all insights",
  "home.viewAllEvents": "View all events",
  "home.partnersTitle": "Our Partners",
  "home.clientsTitle": "Our Clients",
  "home.insights.label": "Articles & work",
  "home.insights.title": "Insights",
  "home.events.title": "Events",
  "home.events.intro":
    "Workshops, sessions, and announcements from Sucita & Partners.",
  "home.hero.title": "Clarity when compliance and growth decisions matter",
  "home.hero.text":
    "Audit, accounting, tax, and strategy — delivered with integrity.",
  "home.hero.aboutLabel": "About Us",
  "home.hero.servicesLabel": "Explore Services",
  "home.whatWeDo.title": "What We Do",
  "home.whatWeDo.text":
    "Statutory audits, monthly bookkeeping, tax filing, VAT refund support, internal audit, SOP development, start-up packages, and corporate secretary services — delivered with integrity and independence.",
  "home.whoWeServe.title": "Who We Serve",
  "home.whoWeServe.text":
    "SMEs and growing businesses that need reliable accounting and tax compliance. Startups requiring setup, licensing, and structured financial systems. Companies facing tax audits, VAT matters, or statutory audit requirements — and organizations seeking outsourced financial control and corporate secretary support.",
  "home.strategy.label": "Next step",
  "home.strategy.title": "Book a Strategy Call",
  "home.strategy.text":
    "Tell us where compliance, reporting, or growth decisions are stuck. We’ll respond with clear next steps — no generic pitch.",
  "home.strategy.button": "Book Strategy Call",
  "home.strategy.point1": "Clarify your audit, tax, or compliance priorities",
  "home.strategy.point2": "Get practical next steps for your situation",
  "home.strategy.point3":
    "Speak with a team that works with growing businesses",
  "home.about.label": "About Us",
  "home.about.title": "Why Sucita Exists",
  "home.about.p1":
    "Sucita & Partners was founded on a simple observation: too many organizations struggle not because they lack ambition, but because financial complexity, regulatory pressure, and compliance gaps hold them back.",
  "home.about.p2":
    "We exist to be the firm business owners and leaders turn to when they need clarity — not jargon. When tax deadlines, audit requirements, and licensing obligations pile up, our team steps in to simplify the path forward and protect what you've built.",
  "home.about.p3":
    "From startups setting up their first books to established companies navigating VAT refunds, tax audits, or statutory audits, we serve organizations that value integrity, independence, and a partner who treats their success as our own.",
  "home.about.visionTitle": "Vision",
  "home.about.visionText":
    "To set the benchmark in professional services through unwavering integrity, empowering organizations with trusted accounting, tax, audit, and compliance solutions that drive lasting impact.",
  "home.about.missionTitle": "Mission",
  "home.about.missionText":
    "At Sucita & Partners, we are dedicated to simplify complexity and protect client interests through accountable and high-quality professional services, always guided by integrity, independence, and client success.",
  "home.about.valuesLabel": "What guides us",
  "home.about.valuesTitle": "Core Values",
  "home.value.0.title": "Integrity",
  "home.value.0.desc":
    "We act with unwavering honesty, professional ethics, and transparency in every decision—building long-term trust with clients, partners, regulators and stakeholders.",
  "home.value.1.title": "Insightful Commitment",
  "home.value.1.desc":
    "We prioritize our clients’ interests, delivering accurate, timely, and tailored solutions that safeguard their business, reputation, and future.",
  "home.value.2.title": "Impact Through Excellence",
  "home.value.2.desc":
    "We uphold the highest professional standards and deliver work with precision and accountability, ensuring every outcome adds value and builds lasting confidence.",
  "home.value.3.title": "Inclusive Partnership",
  "home.value.3.desc":
    "We grow alongside our clients and partners, fostering mutual success through collaboration, trust, and shared purpose.",
  "home.value.4.title": "Intentional Protection",
  "home.value.4.desc":
    "We serve as stewards of client trust by ensuring financial integrity and regulatory compliance, safeguarding client reputations and sustainable growth.",
  "home.services.label": "What we offer",
  "home.services.title": "Services",
  "home.services.intro":
    "Audit, accounting, tax, and strategy — organized into three clear practice areas.",
  "home.services.practiceArea": "Practice area",
  "home.services.count": "services",
  "home.contact.label": "Get in touch",
  "home.contact.title": "Contact",
  "home.contact.infoTitle": "Contact info",
  "home.contact.infoCopy":
    "Reach Sucita & Partners directly, or send a message using the form.",
  "home.contact.address": "Address",
  "home.contact.email": "Email",
  "home.contact.phone": "Phone",
  "home.contact.fullName": "Full name",
  "home.contact.phoneField": "Phone / WhatsApp",
  "home.contact.message": "Message",
  "home.contact.thankYou": "Thank you",
  "home.contact.thankYouCopy":
    "We've received your message and will get back to you shortly.",
  "home.contact.openFull": "Open full contact page",
  "services.label": "What we offer",
  "services.title": "Services",
  "events.upcoming": "Upcoming",
  "events.past": "Past",
  "events.viewDetails": "View details",
  "contact.send": "Send message",
  "common.readMore": "Read more",
  "common.learnMore": "Learn more",
  "common.back": "Back",
};

const km: Record<MessageKey, string> = {
  "nav.home": "ទំព័រដើម",
  "nav.about": "អំពីយើង",
  "nav.services": "សេវាកម្ម",
  "nav.insights": "អត្ថបទ",
  "nav.events": "ព្រឹត្តិការណ៍",
  "nav.partners": "ដៃគូ",
  "nav.contact": "ទំនាក់ទំនង",
  "home.viewAllInsights": "មើលអត្ថបទទាំងអស់",
  "home.viewAllEvents": "មើលព្រឹត្តិការណ៍ទាំងអស់",
  "home.partnersTitle": "ដៃគូរបស់យើង",
  "home.clientsTitle": "អតិថិជនរបស់យើង",
  "home.insights.label": "អត្ថបទ និងការងារ",
  "home.insights.title": "អត្ថបទ",
  "home.events.title": "ព្រឹត្តិការណ៍",
  "home.events.intro":
    "សិក្ខាសាលា សម័យប្រជុំ និងសេចក្តីប្រកាសពី Sucita & Partners។",
  "home.hero.title": "ភាពច្បាស់លាស់នៅពេលសេចក្តីសម្រេចអំពីការអនុលោម និងកំណើនមានសារៈសំខាន់",
  "home.hero.text":
    "សវនកម្ម គណនេយ្យ ពន្ធ និងយុទ្ធសាស្ត្រ — ផ្តល់ជូនដោយសុច្ឆន្ទៈ។",
  "home.hero.aboutLabel": "អំពីយើង",
  "home.hero.servicesLabel": "ស្វែងយល់សេវាកម្ម",
  "home.whatWeDo.title": "អ្វីដែលយើងធ្វើ",
  "home.whatWeDo.text":
    "សវនកម្មតាមច្បាប់ ការកត់ត្រាគណនេយ្យប្រចាំខែ ការប្រកាសពន្ធ ជំនួយសងប្រាក់ពន្ធ VAT សវនកម្មផ្ទៃក្នុង ការអភិវឌ្ឍ SOP កញ្ចប់ចាប់ផ្តើមអាជីវកម្ម និងសេវាលេខាធិការក្រុមហ៊ុន — ផ្តល់ជូនដោយសុច្ឆន្ទៈ និងឯករាជ្យភាព។",
  "home.whoWeServe.title": "អ្នកដែលយើងបម្រើ",
  "home.whoWeServe.text":
    "សហគ្រាសធុនតូច និងមធ្យម និងអាជីវកម្មកំពុងរីកចម្រើនដែលត្រូវការគណនេយ្យ និងការអនុលោមពន្ធដែលទុកចិត្តបាន។ ស្តាតអាប់ដែលត្រូវការរៀបចំ ការអាជ្ញាបណ្ណ និងប្រព័ន្ធហិរញ្ញវត្ថុមានរចនាសម្ព័ន្ធ។ ក្រុមហ៊ុនដែលជួបសវនកម្មពន្ធ បញ្ហា VAT ឬសវនកម្មតាមច្បាប់ — និងអង្គភាពដែលស្វែងរកការគ្រប់គ្រងហិរញ្ញវត្ថុខាងក្រៅ និងសេវាលេខាធិការក្រុមហ៊ុន។",
  "home.strategy.label": "ជំហានបន្ទាប់",
  "home.strategy.title": "កក់ការពិគ្រោះយុទ្ធសាស្ត្រ",
  "home.strategy.text":
    "ប្រាប់យើងថាតើការអនុលោម របាយការណ៍ ឬសេចក្តីសម្រេចកំណើនជាប់គាំងនៅណា។ យើងនឹងឆ្លើយតបដោយជំហានច្បាស់លាស់ — គ្មានការផ្តល់ជូនទូទៅ។",
  "home.strategy.button": "កក់ការពិគ្រោះយុទ្ធសាស្ត្រ",
  "home.strategy.point1": "បញ្ជាក់អាទិភាពសវនកម្ម ពន្ធ ឬការអនុលោមរបស់អ្នក",
  "home.strategy.point2": "ទទួលជំហានអនុវត្តជាក់ស្តែងសម្រាប់ស្ថានភាពរបស់អ្នក",
  "home.strategy.point3": "និយាយជាមួយក្រុមដែលធ្វើការជាមួយអាជីវកម្មកំពុងរីកចម្រើន",
  "home.about.label": "អំពីយើង",
  "home.about.title": "ហេតុអ្វី Sucita មានវត្តមាន",
  "home.about.p1":
    "Sucita & Partners ត្រូវបានបង្កើតឡើងពីការសង្កេតសាមញ្ញ៖ អង្គភាពជាច្រើនជួបការលំបាក មិនមែនព្រោះខ្វះមហិច្ឆតា ទេ ប៉ុន្តែព្រោះភាពស្មុគស្មាញហិរញ្ញវត្ថុ សម្ពាធច្បាប់ និងគម្លាតការអនុលោមរារាំងពួកគេ។",
  "home.about.p2":
    "យើងមានវត្តមានដើម្បីជាក្រុមហ៊ុនដែលម្ចាស់អាជីវកម្ម និងអ្នកដឹកនាំងាកមករក នៅពេលពួកគេត្រូវការភាពច្បាស់លាស់ — មិនមែនពាក្យលំបាក។ នៅពេលថ្ងៃផុតកំណត់ពន្ធ តម្រូវការសវនកម្ម និងកាតព្វកិច្ចអាជ្ញាបណ្ណកើនឡើង ក្រុមយើងចូលជួយសម្រួលផ្លូវទៅមុខ និងការពារអ្វីដែលអ្នកបានសាងសង់។",
  "home.about.p3":
    "ពីស្តាតអាប់ដែលរៀបចំសៀវភៅគណនេយ្យដំបូង រហូតដល់ក្រុមហ៊ុនដែលបានបង្កើតហើយដែលជួបការសង VAT សវនកម្មពន្ធ ឬសវនកម្មតាមច្បាប់ យើងបម្រើអង្គភាពដែលផ្តល់តម្លៃដល់សុច្ឆន្ទៈ ឯករាជ្យភាព និងដៃគូដែលចាត់ទុកជោគជ័យរបស់ពួកគេជារបស់យើង។",
  "home.about.visionTitle": "ចក្ខុវិស័យ",
  "home.about.visionText":
    "កំណត់ស្តង់ដារក្នុងសេវាវិជ្ជាជីវៈតាមរយៈសុច្ឆន្ទៈមិនរវើរវាយ ផ្តល់អំណាចដល់អង្គភាពដោយដំណោះស្រាយគណនេយ្យ ពន្ធ សវនកម្ម និងការអនុលោមដែលទុកចិត្តបាន ដែលជំរុញផលប៉ះពាល់យូរអង្វែង។",
  "home.about.missionTitle": "បេសកកម្ម",
  "home.about.missionText":
    "នៅ Sucita & Partners យើងខិតខំសម្រួលភាពស្មុគស្មាញ និងការពារផលប្រយោជន៍អតិថិជន តាមរយៈសេវាវិជ្ជាជីវៈមានគុណភាពខ្ពស់ និងទទួលខុសត្រូវ ដែលតែងតែណែនាំដោយសុច្ឆន្ទៈ ឯករាជ្យភាព និងជោគជ័យអតិថិជន។",
  "home.about.valuesLabel": "អ្វីដែលណែនាំយើង",
  "home.about.valuesTitle": "គុណតម្លៃស្នូល",
  "home.value.0.title": "សុច្ឆន្ទៈ",
  "home.value.0.desc":
    "យើងធ្វើសកម្មភាពដោយភាពស្មោះត្រង់ សីលធម៌វិជ្ជាជីវៈ និងតម្លាភាពក្នុងរាល់សេចក្តីសម្រេច — សាងសង់ទំនុកចិត្តរយៈពេលវែងជាមួយអតិថិជន ដៃគូ អាជ្ញាធរ និងភាគីពាក់ព័ន្ធ។",
  "home.value.1.title": "ការប្តេជ្ញាចិត្តដោយយល់ដឹង",
  "home.value.1.desc":
    "យើងផ្តល់អាទិភាពដល់ផលប្រយោជន៍អតិថិជន ផ្តល់ដំណោះស្រាយត្រឹមត្រូវ ទាន់ពេល និងសមស្រប ដើម្បីការពារអាជីវកម្ម កេរ្តិ៍ឈ្មោះ និងអនាគតរបស់ពួកគេ។",
  "home.value.2.title": "ផលប៉ះពាល់តាមរយៈឧត្តមភាព",
  "home.value.2.desc":
    "យើងរក្សាស្តង់ដារវិជ្ជាជីវៈខ្ពស់បំផុត និងផ្តល់ការងារដោយភាពជាក់លាក់ និងទទួលខុសត្រូវ ដើម្បីធានារាល់លទ្ធផលបន្ថែមតម្លៃ និងសាងសង់ទំនុកចិត្តយូរអង្វែង។",
  "home.value.3.title": "ភាពជាដៃគូរួម",
  "home.value.3.desc":
    "យើងរីកចម្រើនជាមួយអតិថិជន និងដៃគូ ជំរុញជោគជ័យទៅវិញទៅមក តាមរយៈកិច្ចសហការ ទំនុកចិត្ត និងគោលបំណងរួម។",
  "home.value.4.title": "ការការពារដោយចេតនា",
  "home.value.4.desc":
    "យើងធ្វើជាអ្នកអាណាព្យាបាលទំនុកចិត្តអតិថិជន ដោយធានាភាពត្រឹមត្រូវហិរញ្ញវត្ថុ និងការអនុលោមច្បាប់ ដើម្បីការពារកេរ្តិ៍ឈ្មោះ និងកំណើនប្រកបដោយចីរភាព។",
  "home.services.label": "អ្វីដែលយើងផ្តល់ជូន",
  "home.services.title": "សេវាកម្ម",
  "home.services.intro":
    "សវនកម្ម គណនេយ្យ ពន្ធ និងយុទ្ធសាស្ត្រ — រៀបចំជាបីផ្នែកអនុវត្តច្បាស់លាស់។",
  "home.services.practiceArea": "ផ្នែកអនុវត្ត",
  "home.services.count": "សេវាកម្ម",
  "home.contact.label": "ទាក់ទងមកយើង",
  "home.contact.title": "ទំនាក់ទំនង",
  "home.contact.infoTitle": "ព័ត៌មានទំនាក់ទំនង",
  "home.contact.infoCopy":
    "ទាក់ទង Sucita & Partners ដោយផ្ទាល់ ឬផ្ញើសារតាមទម្រង់។",
  "home.contact.address": "អាសយដ្ឋាន",
  "home.contact.email": "អ៊ីមែល",
  "home.contact.phone": "ទូរស័ព្ទ",
  "home.contact.fullName": "ឈ្មោះពេញ",
  "home.contact.phoneField": "ទូរស័ព្ទ / WhatsApp",
  "home.contact.message": "សារ",
  "home.contact.thankYou": "អរគុណ",
  "home.contact.thankYouCopy":
    "យើងបានទទួលសាររបស់អ្នក ហើយនឹងឆ្លើយតបក្នុងពេលឆាប់ៗ។",
  "home.contact.openFull": "បើកទំព័រទំនាក់ទំនងពេញ",
  "services.label": "អ្វីដែលយើងផ្តល់ជូន",
  "services.title": "សេវាកម្ម",
  "events.upcoming": "នាពេលខាងមុខ",
  "events.past": "កន្លងមក",
  "events.viewDetails": "មើលព័ត៌មានលម្អិត",
  "contact.send": "ផ្ញើសារ",
  "common.readMore": "អានបន្ថែម",
  "common.learnMore": "ស្វែងយល់បន្ថែម",
  "common.back": "ត្រឡប់ក្រោយ",
};

const zh: Record<MessageKey, string> = {
  "nav.home": "首页",
  "nav.about": "关于我们",
  "nav.services": "服务",
  "nav.insights": "洞察",
  "nav.events": "活动",
  "nav.partners": "合作伙伴",
  "nav.contact": "联系我们",
  "home.viewAllInsights": "查看全部洞察",
  "home.viewAllEvents": "查看全部活动",
  "home.partnersTitle": "合作伙伴",
  "home.clientsTitle": "我们的客户",
  "home.insights.label": "文章与案例",
  "home.insights.title": "洞察",
  "home.events.title": "活动",
  "home.events.intro": "来自 Sucita & Partners 的工作坊、分享会与公告。",
  "home.hero.title": "在合规与增长决策关乎成败时，提供清晰指引",
  "home.hero.text": "审计、会计、税务与战略——以诚信交付。",
  "home.hero.aboutLabel": "关于我们",
  "home.hero.servicesLabel": "探索服务",
  "home.whatWeDo.title": "我们做什么",
  "home.whatWeDo.text":
    "法定审计、月度记账、报税、增值税退税支持、内部审计、SOP 制定、初创套餐以及公司秘书服务——以诚信与独立性交付。",
  "home.whoWeServe.title": "我们服务谁",
  "home.whoWeServe.text":
    "需要可靠会计与税务合规的中小企业及成长型企业。需要设立、许可与结构化财务体系的初创公司。面临税务稽查、增值税事务或法定审计要求的企业——以及寻求外包财务管控与公司秘书支持的组织。",
  "home.strategy.label": "下一步",
  "home.strategy.title": "预约战略咨询",
  "home.strategy.text":
    "告诉我们合规、报告或增长决策卡在哪里。我们会给出清晰下一步——不做空泛推销。",
  "home.strategy.button": "预约战略咨询",
  "home.strategy.point1": "明确您的审计、税务或合规优先事项",
  "home.strategy.point2": "获得针对您情况的可执行下一步",
  "home.strategy.point3": "与服务成长型企业的团队直接沟通",
  "home.about.label": "关于我们",
  "home.about.title": "Sucita 为何存在",
  "home.about.p1":
    "Sucita & Partners 的创立源于一个简单观察：许多组织陷入困境，并非缺乏雄心，而是财务复杂性、监管压力与合规缺口在拖累它们。",
  "home.about.p2":
    "我们的存在，是为了成为企业主与领导者在需要清晰（而非行话）时可以信赖的事务所。当报税截止日期、审计要求与许可义务堆积时，我们的团队介入，简化前路并保护您已建立的成果。",
  "home.about.p3":
    "从建立首套账簿的初创企业，到处理增值税退税、税务稽查或法定审计的成熟公司，我们服务那些重视诚信、独立性，并希望伙伴把他们的成功当作自己成功的组织。",
  "home.about.visionTitle": "愿景",
  "home.about.visionText":
    "以坚定诚信树立专业服务标杆，以可信赖的会计、税务、审计与合规解决方案赋能组织，驱动持久影响。",
  "home.about.missionTitle": "使命",
  "home.about.missionText":
    "在 Sucita & Partners，我们致力于简化复杂性、保护客户利益，通过负责任的高质量专业服务，始终以诚信、独立性与客户成功为导向。",
  "home.about.valuesLabel": "指引我们的原则",
  "home.about.valuesTitle": "核心价值观",
  "home.value.0.title": "诚信",
  "home.value.0.desc":
    "我们在每一项决策中坚持诚实、职业道德与透明——与客户、合作伙伴、监管机构及利益相关方建立长期信任。",
  "home.value.1.title": "洞察承诺",
  "home.value.1.desc":
    "我们优先考虑客户利益，提供准确、及时、量身定制的方案，守护其业务、声誉与未来。",
  "home.value.2.title": "卓越创造影响",
  "home.value.2.desc":
    "我们坚持最高专业标准，以精准与问责交付工作，确保每一项成果创造价值并建立持久信心。",
  "home.value.3.title": "包容伙伴关系",
  "home.value.3.desc":
    "我们与客户和合作伙伴共同成长，通过协作、信任与共同目标促进互利成功。",
  "home.value.4.title": "有意识的保护",
  "home.value.4.desc":
    "我们作为客户信任的守护者，确保财务完整性与监管合规，保护客户声誉与可持续增长。",
  "home.services.label": "我们提供的服务",
  "home.services.title": "服务",
  "home.services.intro": "审计、会计、税务与战略——划分为三个清晰的业务领域。",
  "home.services.practiceArea": "业务领域",
  "home.services.count": "项服务",
  "home.contact.label": "联系我们",
  "home.contact.title": "联系",
  "home.contact.infoTitle": "联系信息",
  "home.contact.infoCopy": "直接联系 Sucita & Partners，或通过表单留言。",
  "home.contact.address": "地址",
  "home.contact.email": "邮箱",
  "home.contact.phone": "电话",
  "home.contact.fullName": "全名",
  "home.contact.phoneField": "电话 / WhatsApp",
  "home.contact.message": "留言",
  "home.contact.thankYou": "谢谢",
  "home.contact.thankYouCopy": "我们已收到您的留言，将尽快回复。",
  "home.contact.openFull": "打开完整联系页",
  "services.label": "我们提供的服务",
  "services.title": "服务",
  "events.upcoming": "即将举行",
  "events.past": "往期活动",
  "events.viewDetails": "查看详情",
  "contact.send": "发送消息",
  "common.readMore": "阅读更多",
  "common.learnMore": "了解更多",
  "common.back": "返回",
};

const catalog: Record<Locale, Record<MessageKey, string>> = { en, km, zh };

export function translate(locale: Locale, key: MessageKey): string {
  return catalog[locale][key] || catalog.en[key] || key;
}
