// our-domain.com/news
import Link from "next/link";
import { Fragment } from "react";

export default function NewsPage() {
  return (
    <Fragment>
      <h1>The news page</h1>
      <ul>
        <li>
          <Link href="/news/nextjs-is-a-great-framework">
            NextJS is great framework
          </Link>
        </li>
        <li>
          <Link href="/news/something-else">Something else</Link>
        </li>
      </ul>
    </Fragment>
  );
}
