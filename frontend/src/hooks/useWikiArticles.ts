import { useState } from "react";

interface WikiArticle {
  title: string;
  extract: string;
  pageid: number;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
}

export function useWikiArticles() {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://en.wikipedia.org/w/api.php?" +
          new URLSearchParams({
            action: "query",
            format: "json",
            generator: "random",
            grnnamespace: "0",
            prop: "extracts|pageimages",
            grnlimit: "5",
            exchars: "200",
            exlimit: "max",
            explaintext: "1",
            piprop: "thumbnail",
            pithumbsize: "400",
            origin: "*",
          })
      );

      const data = await response.json();
      const newArticles = Object.values(data.query.pages).map((page: any) => ({
        title: page.title,
        extract: page.extract,
        pageid: page.pageid,
        thumbnail: page.thumbnail,
      }));

      setArticles((prev) => [...prev, ...newArticles]);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
    setLoading(false);
  };

  return { articles, loading, fetchArticles };
}
