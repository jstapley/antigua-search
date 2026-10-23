import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import BlogPostClient from './BlogPostClient'

export const dynamicParams = true
export const revalidate = 60

async function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export async function generateStaticParams() {
  const supabase = await getSupabase()
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')
  return data?.map(post => ({ slug: post.slug })) || []
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const supabase = await getSupabase()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, meta_title, meta_description, featured_image, slug')
    .eq('slug', resolvedParams.slug)
    .eq('status', 'published')
    .single()

  if (!post) return { title: 'Post Not Found' }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || ''

  return {
    title: `${title} | AntiguaSearch.com`,
    description,
    alternates: { canonical: `https://www.antiguasearch.com/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.antiguasearch.com/blog/${post.slug}`,
      siteName: 'AntiguaSearch.com',
      images: post.featured_image ? [{ url: post.featured_image, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featured_image ? [post.featured_image] : [],
    }
  }
}

export default async function BlogPostPage({ params }) {
  const resolvedParams = await params
  const supabase = await getSupabase()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .eq('status', 'published')
    .single()

  if (!post) notFound()

  return <BlogPostClient post={post} />
}
