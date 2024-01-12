// our-domain.com/news/[newsId]
import { useRouter } from "next/router";

export default function DetailPage() {
  const router = useRouter();
  const newsId = router.query.newsId;

  return <h1>The detail page</h1>;
}
