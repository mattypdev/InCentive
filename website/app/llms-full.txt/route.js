import { createClient } from '@supabase/supabase-js'

function htmlToText(html) {
  return html
    // Block-level semantics → readable text
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n## ${t.replace(/<[^>]+>/g, '')}\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n### ${t.replace(/<[^>]+>/g, '')}\n`)
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) => `\n> ${t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}\n`)
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, t) => `\n\`\`\`\n${t.replace(/<[^>]+>/g, '')}\n\`\`\`\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `\n- ${t.replace(/<[^>]+>/g, '').trim()}`)
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `\n${t.replace(/<[^>]+>/g, '').trim()}\n`)
    .replace(/<hr[^>]*>/gi, '\n---\n')
    .replace(/<br[^>]*>/gi, '\n')
    // Strip remaining tags
    .replace(/<[^>]+>/g, '')
    // Decode common HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  )

  const { data: articles } = await supabase
    .from('articles')
    .select('title, slug, author, published_at, body')
    .order('published_at', { ascending: false })

  const header = `# Incentive

Incentive is a student-led nonprofit that provides free, interactive personal finance education for high school students and young adults. The platform offers self-paced lessons across six modules — covering budgeting, banking, taxes, investing, retirement planning, and behavioral finance — along with quizzes, articles, and financial calculators. Learners earn XP and in-app rewards as they progress. No account is required to use the calculators or read articles; an optional free account unlocks progress tracking and the full learning experience. Incentive does not sell financial products and does not provide personalized financial advice.

Site: https://incentivefinance.org
Calculators: /compound-interest, /loan-calculator, /retirement-calculator
Learn: /learn
Articles: /articles
Quizzes: /quizzes
About: /about

---

# Articles

`

  const articleBlocks = (articles ?? []).map((a) => {
    const date = a.published_at ? new Date(a.published_at).toISOString().slice(0, 10) : ''
    const url = `https://incentivefinance.org/articles/${a.slug}`
    const body = htmlToText(a.body ?? '')
    return `## ${a.title}
URL: ${url}
Author: ${a.author ?? 'Incentive'}${date ? `\nPublished: ${date}` : ''}

${body}`
  }).join('\n\n---\n\n')

  const text = header + (articleBlocks || 'No articles yet.')

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
