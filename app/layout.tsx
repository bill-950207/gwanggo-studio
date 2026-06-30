import type { Metadata } from 'next'
import './globals.css'
import { I18nProvider } from '@/lib/i18n'
import { ThemeProvider, themeInitScript } from '@/lib/theme'
import { StudioProvider } from '@/lib/studio'

export const metadata: Metadata = {
  title: 'Gwanggo Studio',
  description: 'Open-source AI media generation studio. Self-host it, or power it with one API key.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <I18nProvider>
            <StudioProvider>{children}</StudioProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
