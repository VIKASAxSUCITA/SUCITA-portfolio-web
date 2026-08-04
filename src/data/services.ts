import type { LocalizedString } from "@/lib/i18n/config";

export type ServiceItem = {
  label: string | LocalizedString;
  children?: Array<string | LocalizedString>;
};

export type ServiceCategory = {
  id: string;
  letter: string;
  title: string | LocalizedString;
  description: string | LocalizedString;
  bodyHtml?: string | LocalizedString;
  coverImage?: string;
  items: ServiceItem[];
};

function L(en: string, km: string, zh: string): LocalizedString {
  return { en, km, zh };
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "audit-assurance",
    letter: "A",
    title: L("Audit & Assurance", "សវនកម្ម និងការធានា", "审计与鉴证"),
    description: L(
      "Independent audit and assurance services that strengthen stakeholder confidence and meet regulatory requirements.",
      "សេវាសវនកម្ម និងការធានាឯករាជ្យ ដែលពង្រឹងទំនុកចិត្តភាគីពាក់ព័ន្ធ និងបំពេញតម្រូវការច្បាប់។",
      "独立的审计与鉴证服务，增强利益相关方信心并满足监管要求。"
    ),
    items: [
      {
        label: L("Audit", "សវនកម្ម", "审计"),
        children: [
          L(
            "Statutory Audit Service",
            "សេវាសវនកម្មតាមច្បាប់",
            "法定审计服务"
          ),
        ],
      },
      {
        label: L("Assurance", "ការធានា", "鉴证"),
        children: [
          L("Agreed-Upon Procedure", "នីតិវិធីដែលបានយល់ព្រម", "商定程序"),
          L("Financial Statement Review", "ការពិនិត្យរបាយការណ៍ហិរញ្ញវត្ថុ", "财务报表审阅"),
          L("Internal Audit", "សវនកម្មផ្ទៃក្នុង", "内部审计"),
        ],
      },
    ],
  },
  {
    id: "accounting-tax",
    letter: "B",
    title: L("Accounting & Tax", "គណនេយ្យ និងពន្ធ", "会计与税务"),
    description: L(
      "End-to-end accounting and tax support — from monthly bookkeeping to complex VAT and tax compliance matters.",
      "ការគាំទ្រគណនេយ្យ និងពន្ធពេញលេញ — ពីការកត់ត្រាប្រចាំខែ រហូតដល់បញ្ហា VAT និងការអនុលោមពន្ធស្មុគស្មាញ។",
      "端到端会计与税务支持——从月度记账到复杂的增值税与税务合规事务。"
    ),
    items: [
      { label: L("Monthly Bookkeeping", "ការកត់ត្រាគណនេយ្យប្រចាំខែ", "月度记账") },
      {
        label: L(
          "Monthly/Annual Tax Filling",
          "ការប្រកាសពន្ធប្រចាំខែ/ឆ្នាំ",
          "月度/年度报税"
        ),
      },
      { label: L("Tax Audit Assistance", "ជំនួយសវនកម្មពន្ធ", "税务稽查协助") },
      { label: L("VAT Refund Assistance", "ជំនួយសងប្រាក់ពន្ធ VAT", "增值税退税协助") },
      { label: L("VAT 0% Certificate", "វិញ្ញាបនបត្រ VAT 0%", "增值税0%证明") },
      {
        label: L(
          "Tax Compliance Certificate",
          "វិញ្ញាបនបត្រអនុលោមពន្ធ",
          "税务合规证明"
        ),
      },
      { label: L("Annual Income Tax", "ពន្ធលើប្រាក់ចំណូលប្រចាំឆ្នាំ", "年度所得税") },
      {
        label: L(
          "Other Tax Advisory Services",
          "សេវាប្រឹក្សាពន្ធផ្សេងទៀត",
          "其他税务咨询服务"
        ),
      },
    ],
  },
  {
    id: "transformative-strategy",
    letter: "C",
    title: L("Transformative Strategy", "យុទ្ធសាស្ត្រផ្លាស់ប្តូរ", "转型战略"),
    description: L(
      "Strategic advisory and operational support to help your business scale with strong systems, compliance, and structure.",
      "ការប្រឹក្សាយុទ្ធសាស្ត្រ និងការគាំទ្រប្រតិបត្តិការ ដើម្បីជួយអាជីវកម្មរបស់អ្នករីកចម្រើនដោយប្រព័ន្ធ ការអនុលោម និងរចនាសម្ព័ន្ធរឹងមាំ។",
      "战略咨询与运营支持，帮助企业以稳健的体系、合规与结构实现扩张。"
    ),
    items: [
      {
        label: L(
          "Financial Controlling & Outsourcing Service",
          "សេវាគ្រប់គ្រងហិរញ្ញវត្ថុ និងអៅសស៊ឺស៊ីង",
          "财务管控与外包服务"
        ),
      },
      { label: L("SOP Development", "ការអភិវឌ្ឍ SOP", "SOP 制定") },
      { label: L("Start-up Package", "កញ្ចប់ចាប់ផ្តើមអាជីវកម្ម", "初创套餐") },
      {
        label: L(
          "Corporate Secretary Service",
          "សេវាលេខាធិការក្រុមហ៊ុន",
          "公司秘书服务"
        ),
      },
      {
        label: L(
          "System Support (Accounting & HR System)",
          "ការគាំទ្រប្រព័ន្ធ (គណនេយ្យ និង HR)",
          "系统支持（会计与人力资源系统）"
        ),
      },
      {
        label: L(
          "Legal Compliance & Licensing",
          "ការអនុលោមច្បាប់ និងអាជ្ញាបណ្ណ",
          "法律合规与许可"
        ),
      },
    ],
  },
];

/** Flat list of selectable service labels (parents + children). */
export function getServiceLabels(category: ServiceCategory): string[] {
  return category.items.flatMap((item) => {
    const label =
      typeof item.label === "string" ? item.label : item.label.en || "";
    const children =
      item.children?.map((child) =>
        typeof child === "string" ? child : child.en || ""
      ) ?? [];
    return children.length ? [label, ...children] : [label];
  });
}

export function countServiceItems(category: ServiceCategory): number {
  return category.items.reduce((total, item) => {
    if (item.children?.length) return total + item.children.length;
    return total + 1;
  }, 0);
}
