// robots.txt: crawl everything public, keep the app shell and APIs out of the
// index, and point crawlers at the sitemap.
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/"],
      },
    ],
    sitemap: "https://proofloft.com/sitemap.xml",
  };
}
