import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import { router } from '@/app/router'
import { store } from '@/app/store'
import '@/shared/styles/global.scss'

// Builds without a backend (GitHub Pages, `npm run dev:mock`) answer /api in
// the browser. The import is dynamic, so normal builds never download MSW.
if (import.meta.env.VITE_MOCK_API === 'true') {
  try {
    const { worker } = await import('@/mocks/browser')
    await worker.start({
      serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
      onUnhandledFrame: 'bypass',
      quiet: true,
    })
  } catch (error) {
    // Some browsers block service workers (private modes, embedded views).
    // Render anyway: the app then shows its "API offline" state instead of a blank page.
    console.error('Mock API could not start', error)
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
