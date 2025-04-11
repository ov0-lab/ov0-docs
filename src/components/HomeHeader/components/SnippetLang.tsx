export default function SnippetLang({ lang, setLang }: { lang: string, setLang: (lang: string) => void }) {
  return (
    <select
      className="snippet-lang"
      value={lang}
      onChange={(e) => setLang(e.currentTarget.value)}
    >
      <option value="javascript" className="snippet-lang-option">JavaScript</option>
      <option value="typescript" className="snippet-lang-option">TypeScript</option>
    </select>
  )
}
