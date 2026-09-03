// AJIO Discovery Engine — Review Corpus
// Sourced: Google Play, Apple App Store, Reddit (r/IndianFashionAddicts,
// r/SneakerheadsIndia, r/SneakersIndia), Trustpilot, PissedConsumer
// Each review is tagged against a closed taxonomy (THEMES below) —
// tags were assigned during collection, not invented by an LLM.

export type Review = {
  id: string;
  source: string;
  date: string;
  author: string;
  evidence: string;
  themes: string[]; // must be a subset of THEME_IDS
};

// Closed taxonomy — the classifier (or human tagger) may ONLY use these.
// This is the guardrail: no theme outside this list can ever appear in
// aggregated output, which is what makes the counts trustworthy.
export const THEMES: Record<string, string> = {
  return_friction: "Return process friction (rejected, failed pickup, tag disputes)",
  refund_delay: "Refund delayed or not received",
  waited: "Prolonged waiting / resolution took a long time",
  size_fit: "Wrong size or fit issue",
  quality: "Product quality concern (damaged, defective, poor material)",
  delivery: "Delivery problem (late, cancelled, not delivered)",
  support: "Customer support unhelpful or unresponsive",
  availability: "Desired size/replacement unavailable",
  wrong_item: "Wrong or different item received",
  trust: "Authenticity / trust / fraud concern",
  app_tech: "App technical issue",
  positive_workaround: "Positive experience or user-found workaround",
};

export const REVIEWS: Review[] = [
  { id: "GP-01", source: "Google Play", date: "2025-04-17", author: "Aarthi Chandran", evidence: "Wrong/cheap products; no return/refund option; support unhelpful.", themes: ["quality", "return_friction", "refund_delay", "support"] },
  { id: "GP-02", source: "Google Play", date: "2024-08-27", author: "Ishitaa Sharma", evidence: "Quality described as poor; return policy changed to exchange-only; wants more transparency.", themes: ["quality", "return_friction"] },
  { id: "GP-03", source: "Google Play", date: "2026-08-26", author: "Ritu Gupta", evidence: "Delivery date repeatedly extended, then order cancelled; prepaid amount not received.", themes: ["delivery", "waited", "refund_delay"] },
  { id: "GP-04", source: "Google Play", date: "2017-09-08", author: "Google user", evidence: "No product-review option and return policy described as very bad.", themes: ["return_friction"] },
  { id: "GP-05", source: "Google Play", date: "2025-04-17", author: "Aarthi Chandran", evidence: "Asked for pickup and full refund after receiving incorrect products.", themes: ["return_friction", "refund_delay", "wrong_item"] },
  { id: "AS-01", source: "Apple App Store", date: "2025-01-07", author: "Zesha45", evidence: "Refund did not arrive after return; repeated bank-detail requests; refund moved to AJIO Cash.", themes: ["refund_delay", "return_friction"] },
  { id: "AS-02", source: "Apple App Store", date: "2025-04-21", author: "Ajio the worst app", evidence: "Nike flip-flops were a size bigger; exchange pickup never happened; return window expired.", themes: ["size_fit", "return_friction", "waited"] },
  { id: "AS-03", source: "Apple App Store", date: "2024-08-07", author: "Chandhana Gandla", evidence: "Items too large; desired exchange size out of stock; return/refund disputed.", themes: ["size_fit", "availability", "refund_delay"] },
  { id: "AS-04", source: "Apple App Store", date: "2023-03-31", author: "Mkathu", evidence: "Wrong/missing kurtas; complaint repeatedly closed; money not returned.", themes: ["wrong_item", "return_friction", "refund_delay"] },
  { id: "AS-05", source: "Apple App Store", date: "2023-02-12", author: "Neha V.", evidence: "Nike shoe quality concern; return pickup refused; refund delayed.", themes: ["quality", "return_friction", "refund_delay"] },
  { id: "AS-06", source: "Apple App Store", date: "2024-08-22", author: "Anshu Vijay", evidence: "Return pickup failed repeatedly until return window closed.", themes: ["return_friction", "waited", "support"] },
  { id: "R-01", source: "Reddit r/IndianFashionAddicts", date: "2026-06-10", author: "u/author", evidence: "Clothing did not fit as shown; suitable size unavailable; three pickup attempts failed; return window closed.", themes: ["size_fit", "availability", "return_friction", "waited"] },
  { id: "R-02", source: "Reddit r/IndianFashionAddicts", date: "2026-01-04", author: "u/author", evidence: "Low-rise jeans arrived with a much higher rise; coupon made item non-refundable.", themes: ["size_fit", "wrong_item"] },
  { id: "R-03", source: "Reddit r/IndianFashionAddicts", date: "2026-03-26", author: "u/author", evidence: "Clothes did not fit; bigger size unavailable; item picked up but app later showed delivered.", themes: ["size_fit", "availability", "return_friction"] },
  { id: "R-04", source: "Reddit r/IndianFashionAddicts", date: "2023-09-19", author: "u/author", evidence: "Wanted to return shirts for size and quality issues; app crashed opening order.", themes: ["size_fit", "quality", "return_friction", "app_tech"] },
  { id: "R-05", source: "Reddit r/SneakerheadsIndia", date: "2026-03-15", author: "u/commenter", evidence: "My Size isn't there.", themes: ["availability"] },
  { id: "R-06", source: "Reddit r/SneakerheadsIndia", date: "2026-03-15", author: "u/commenter", evidence: "Can I buy one size bigger then ask for exchange with the lower size for same price? Does that work?", themes: ["size_fit", "positive_workaround"] },
  { id: "R-07", source: "Reddit r/SneakerheadsIndia", date: "2026-03-15", author: "u/commenter", evidence: "Order both and return the one that doesn't fit.", themes: ["size_fit", "positive_workaround"] },
  { id: "R-08", source: "Reddit r/SneakerheadsIndia", date: "2026-03-15", author: "u/commenter", evidence: "Hope they deliver the original and not fake.", themes: ["trust"] },
  { id: "R-09", source: "Reddit r/SneakerheadsIndia", date: "2026-03-15", author: "u/commenter", evidence: "UK 11 unavailable.", themes: ["availability"] },
  { id: "R-10", source: "Reddit r/SneakersIndia", date: "2026-07-15", author: "u/author", evidence: "Defective Adidas Gazelles; preferred size unavailable for exchange; return reportedly cancelled.", themes: ["quality", "size_fit", "availability", "return_friction"] },
  { id: "R-11", source: "Reddit r/SneakersIndia", date: "2026-05-06", author: "u/author", evidence: "Loose threads, messy stitching, mark on upper; asks whether to replace or refund.", themes: ["quality", "return_friction"] },
  { id: "R-12", source: "Reddit r/SneakersIndia", date: "2026-01-26", author: "u/commenter", evidence: "Bought many sneakers from AJIO; replacement for size issues worked quickly.", themes: ["size_fit", "positive_workaround"] },
  { id: "R-13", source: "Reddit r/SneakerheadsIndia", date: "2026-01-26", author: "u/commenter", evidence: "Returned shoes due to sizing issue.", themes: ["size_fit", "return_friction"] },
  { id: "R-14", source: "Reddit r/IndianFashionAddicts", date: "2026-06-10", author: "u/commenter", evidence: "Keep pestering AJIO with mails and calls; consumer helpline may help.", themes: ["support", "positive_workaround"] },
  { id: "R-15", source: "Reddit r/IndianFashionAddicts", date: "2026-06-10", author: "u/commenter", evidence: "Got refund after approximately 2.5 months.", themes: ["refund_delay", "waited"] },
  { id: "T-01", source: "Trustpilot", date: "2026-09-03", author: "Piyush Patil", evidence: "Worst app ever; worst service.", themes: ["support"] },
  { id: "T-02", source: "Trustpilot", date: "2026-09-02", author: "Chandan Shetty", evidence: "Delivery cancelled without an attempt; amount refunded.", themes: ["delivery", "refund_delay"] },
  { id: "T-03", source: "Trustpilot", date: "2026-08-28", author: "Rahul Saggi", evidence: "Discounts described as enticing customers; advises not ordering.", themes: ["trust"] },
  { id: "T-04", source: "Trustpilot", date: "2026-08-28", author: "Shubham Sahu", evidence: "Wrong colour delivered; no exchange; customer must return/refund/reorder.", themes: ["wrong_item", "return_friction"] },
  { id: "T-05", source: "Trustpilot", date: "2026-08-20", author: "Pintu Naidu", evidence: "Return was rejected; after escalation it was accepted, but refund still not credited.", themes: ["return_friction", "refund_delay", "support"] },
  { id: "T-06", source: "Trustpilot", date: "2026-08-25", author: "Neha Sharma", evidence: "Wrong/used saree received; evidence submitted; unresolved after escalation.", themes: ["quality", "wrong_item", "support"] },
  { id: "T-07", source: "Trustpilot", date: "2026-08-20", author: "Vaibhav Jain", evidence: "Product taken but refund not received.", themes: ["return_friction", "refund_delay"] },
  { id: "T-08", source: "Trustpilot", date: "2026-08-20", author: "Priyanka Badoni", evidence: "Wrong product; no pickup for weeks; generic support; refund delayed.", themes: ["wrong_item", "return_friction", "refund_delay", "support"] },
  { id: "T-09", source: "Trustpilot", date: "2026-08-17", author: "Harshi Rana", evidence: "No delivery timelines.", themes: ["delivery", "waited"] },
  { id: "T-10", source: "Trustpilot", date: "2026-08-16", author: "Tejaswini Ghan Kulkarni", evidence: "Unable to cancel; repeatedly told to wait; money stuck.", themes: ["waited", "refund_delay"] },
  { id: "T-11", source: "Trustpilot", date: "2026-08-15", author: "Moonmoon Das", evidence: "Product lacked brand/price tag; return cancelled repeatedly.", themes: ["trust", "return_friction"] },
  { id: "T-12", source: "Trustpilot", date: "2026-08-14", author: "Shibananda Biswal", evidence: "Ordered shirt for a ceremony; still not delivered.", themes: ["delivery", "waited"] },
  { id: "T-13", source: "Trustpilot", date: "2026-08-13", author: "anu bharti", evidence: "Orders cancelled after days of waiting; exchange cancelled; asks AJIO to fix fulfilment.", themes: ["waited", "availability"] },
  { id: "T-14", source: "Trustpilot", date: "2026-02-10", author: "Bhagyashree salekar", evidence: "Damaged and poor-quality products; follow-ups over 15 days.", themes: ["quality", "waited", "support"] },
  { id: "T-15", source: "Trustpilot", date: "2026-01-26", author: "Alex Wagner", evidence: "Third-party delivery service reportedly delays delivery; warns against prepayment.", themes: ["delivery", "trust"] },
  { id: "PC-01", source: "PissedConsumer", date: "2026-09-03", author: "kishan S Kgl", evidence: "Black shirt was too small; return failed because brand tag was missing.", themes: ["size_fit", "return_friction"] },
  { id: "PC-02", source: "PissedConsumer", date: "2026-07-03", author: "SANAM R Gjw", evidence: "Different/damaged products received; returns not allowed.", themes: ["quality", "return_friction"] },
  { id: "PC-03", source: "PissedConsumer", date: "2026-08-19", author: "Anamika R Ezm", evidence: "Skincare order pending for more than 10 days; poor communication.", themes: ["waited", "delivery"] },
  { id: "PC-04", source: "PissedConsumer", date: "2026-04-16", author: "Nithya V Ncs", evidence: "Wrong torn cloth; return pickup missed twice; refund unresolved.", themes: ["wrong_item", "return_friction", "refund_delay", "waited"] },
  { id: "PC-05", source: "PissedConsumer", date: "2026-09-03", author: "Makwana A Yry", evidence: "Returned shoes; money not received for two months.", themes: ["return_friction", "refund_delay", "waited"] },
  { id: "PC-06", source: "PissedConsumer", date: "2026-09-02", author: "VenkatasivaNagaraju B", evidence: "Orders getting delayed day by day.", themes: ["delivery", "waited", "trust"] },
  { id: "PC-07", source: "PissedConsumer", date: "2026-09-02", author: "Madhu N Bta", evidence: "Ordered two shirts, received one; quality issue.", themes: ["wrong_item", "quality", "refund_delay"] },
  { id: "PC-08", source: "PissedConsumer", date: "2026-09-01", author: "Riker Fqa", evidence: "Wrong and defective products arrived after very late delivery.", themes: ["wrong_item", "quality", "delivery"] },
  { id: "PC-09", source: "PissedConsumer", date: "2026-09-01", author: "Dalinda Ole", evidence: "Pant was too small; return pickup absent for 10 days.", themes: ["size_fit", "return_friction", "waited"] },
  { id: "PC-10", source: "PissedConsumer", date: "2026-08-01", author: "Jogi S Zqb", evidence: "Return option missing in app after WhatsApp order; wrong product received.", themes: ["return_friction", "app_tech", "wrong_item"] },
  { id: "PC-11", source: "PissedConsumer", date: "2026-08-26", author: "Pratheeksha P Uiq", evidence: "App says refund credited but amount not received.", themes: ["refund_delay"] },
  { id: "PC-12", source: "PissedConsumer", date: "2026-08-17", author: "Keerthan Rad", evidence: "Ordered 18 pieces, received 2; refund still missing.", themes: ["wrong_item", "refund_delay"] },
  { id: "PC-13", source: "PissedConsumer", date: "2026-08-25", author: "Ankit S Wjb", evidence: "Return option not showing for delivered order.", themes: ["return_friction", "app_tech"] },
  { id: "PC-14", source: "PissedConsumer", date: "2026-07-13", author: "Vishwash P", evidence: "AJIO app not working while trying to purchase.", themes: ["app_tech"] },
  { id: "PC-15", source: "PissedConsumer", date: "2026-08-11", author: "VeeraAnil E", evidence: "Caller claiming customer care requested additional payment during refund dispute.", themes: ["trust", "refund_delay"] },
];
