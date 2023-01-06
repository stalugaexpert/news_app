import { gql } from 'graphql-request'
import { sortNewsByImage } from './sortNewsByImage'

export const fetchNews = async (
  category?: Category | string,
  keywords?: string,
  isDynamic?: boolean
) => {
  const query = gql`
    query MyQuery(
      $access_key: String!
      $categories: String!
      $keywords: String
    ) {
      myQuery(
        access_key: $access_key
        categories: $categories
        countries: "gb"
        sort: "published_desc"
        keywords: $keywords
      ) {
        data {
          author
          category
          country
          description
          image
          language
          published_at
          source
          title
          url
        }
        pagination {
          count
          limit
          offset
          total
        }
      }
    }
  `

  const res = await fetch('https://kehl.stepzen.net/api/handy-hare/__graphql', {
    method: 'POST',
    cache: isDynamic ? 'no-cache' : 'default',
    next: isDynamic ? { revalidate: 0 } : { revalidate: 30 },
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Apikey ${process.env.STEPZEN_API_KEY}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        access_key: process.env.MEDIASTACK_API_KEY,
        categories: category,
        keywords: keywords,
      },
    }),
  })

  const newsResponse = await res.json()

  const news = sortNewsByImage(newsResponse.data.myQuery)

  return news
}

// example import
// stepzen import curl "http://api.mediastack.com/v1/news?access_key=0429fc2f5d0f9cf872900fa129d3c685&countries=us%2Cgb&limit=100&offset=0&sort=published_desc"
