import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/hocalar", "/dersler", "/instructors/"],
        disallow: ["/admin/", "/settings/", "/api/", "/login", "/register"],
      },
    ],
    sitemap: "https://kampuskarne.com/sitemap.xml",
  };
}
