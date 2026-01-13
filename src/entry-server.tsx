import { renderToString } from "react-dom/server"
import { StaticRouter } from "react-router-dom/server"
import App from "./App"

export async function render(url: string) {
  const helmetContext = {}

  const html = renderToString(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
  )

  const { helmet } = helmetContext as any

  return {
    html,
    head: `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
    `,
  }
}
