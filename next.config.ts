import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // 301/308 redirects from old Squarespace URLs to their new homes, so any
  // ranking/links those pages had carry over instead of hitting a 404.
  async redirects() {
    return [
      // Consolidate every www URL onto the canonical apex domain.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nexovia.pro" }],
        destination: "https://nexovia.pro/:path*",
        permanent: true,
      },
      // Consolidate the overlapping recovery calendar into the cornerstone guide.
      {
        source: "/blog/microneedling-aftercare-day-by-day",
        destination: "/microneedling-aftercare",
        permanent: true,
      },
      // Articles that still exist, now under /blog/<slug>
      { source: "/peptides-for-skin-barrier-repair", destination: "/blog/peptides-for-skin-barrier-repair", permanent: true },
      { source: "/pdrn-in-skincare", destination: "/blog/pdrn-in-skincare", permanent: true },
      { source: "/laser-skin-resurfacing-aftercare", destination: "/blog/laser-skin-resurfacing-aftercare", permanent: true },
      // Old guides hub and Squarespace tag pages -> Recovery Guides index
      { source: "/aftercare-guides", destination: "/blog", permanent: true },
      { source: "/blog/tag/:tag*", destination: "/blog", permanent: true },
    ];
  },
};

export default nextConfig;
