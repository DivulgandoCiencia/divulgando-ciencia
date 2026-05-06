import siteData from "../data/siteData.json"
//import { slugify } from "./utils";


export default function jsonLDGenerator({ type, post, url }) {
    if (type === 'post') {
        return `<script type="application/ld+json">
            {
                "@context": "https://schema.org",
                "@type": "ScholarlyArticle",
                "headline": "${post.title}",
                "image": ["${post.image}"],
                "url": "${url || "https://www.divulgandociencia.com/"}",
                "datePublished": "${post.date}",
                "author": [{
                    "@type": "Person",
                    "name": "${post.author}"
                }],
                "publisher": {
                    "@type": "Organization",
                    "name": "Divulgando Ciencia",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.divulgandociencia.com/images/logo.webp"
                    },
                    "email": "support@divulgandociencia.com"
                },
                "description": "${post.description}"
            }
        </script>`;
    }
    return `<script type="application/ld+json">
            {
                "@context": "https://schema.org/",
                "@type": "WebSite",
                "name": "${siteData.title}",
                "url": "${url || "https://www.divulgandociencia.com/"}",
                "publisher": {
                    "@type": "Organization",
                    "name": "Divulgando Ciencia",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.divulgandociencia.com/images/logo.webp"
                    },
                    "email": "support@divulgandociencia.com"
                },
                "description": "${post.description}"
            }
        </script>`;
}