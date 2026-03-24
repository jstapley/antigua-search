import { createClient } from '@supabase/supabase-js'
import BlogListClient from './BlogListClient'

export const revalidate = 60

export const metadata = {
  title: 'Blog | AntiguaSearch.com — Antigua & Barbuda Travel & Business Guide',
  description: 'Discover the best hotels, restaurants, activities and businesses in Antigua & Barbuda. Travel tips, local guides and business spotlights.',
  alternates: {
    canonical: 'https://www.antiguasearch.com/blog'
  },
  openGraph: {
    title: 'Blog | AntiguaSearch.com',
    description: 'Travel guides, local tips and business spotlights for Antigua & Barbuda.',
    url: 'https://www.antiguasearch.com/blog',
    siteName: 'AntiguaSearch.com',
  }
}

async function getPosts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, featured_image, author, tags, published_at, created_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  return data || []
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <BlogListClient posts={posts} />
}
