import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  // 301/308 redirects from old Squarespace URLs to their new homes, so any
  // ranking/links those pages had carry over instead of hitting a 404.
  async redirects() {
    return [
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
