export interface LexiconJSON {
  id: string
  language: string
  name: string
  description: string
  allowedModes: number[]
  categories: {
    id: string
    name: string
    role: 'templates' | 'conjunctions' | 'words'
    items: string[]
  }[]
}

export interface LexiconData {
  id: string
  language: string
  name: string
  description: string
  allowedModes: number[]
  templates: string[]
  conjunctions: string[]
  categories: Record<string, string>
  words: Record<string, string[]>
}

export type Category = string

const DEFAULT_LEXICON_ID = 'elden-ring'
const DEFAULT_LANGUAGE = 'zh-CN'

function parseLexicon(json: LexiconJSON): LexiconData {
  const templates: string[] = []
  const conjunctions: string[] = []
  const categories: Record<string, string> = {}
  const words: Record<string, string[]> = {}

  for (const cat of json.categories) {
    if (cat.role === 'templates') {
      templates.push(...cat.items)
    } else if (cat.role === 'conjunctions') {
      conjunctions.push(...cat.items)
    } else {
      categories[cat.id] = cat.name
      words[cat.id] = cat.items
    }
  }

  return {
    id: json.id,
    language: json.language,
    name: json.name,
    description: json.description,
    allowedModes: json.allowedModes,
    templates,
    conjunctions,
    categories,
    words,
  }
}

export async function loadLexicon(
  lexiconId: string = DEFAULT_LEXICON_ID,
  language: string = DEFAULT_LANGUAGE,
): Promise<LexiconData> {
  const url = `/lexicon/${lexiconId}/${language}.json`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to load lexicon: ${url} (${response.status})`)
  }
  const json: LexiconJSON = await response.json()
  return parseLexicon(json)
}
