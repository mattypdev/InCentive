import '../styles/globals.css'
import '../styles/app.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthProvider from '@/context/AuthContext'

export const metadata = {
  title: 'Incentive',
  description: 'Learn personal finance through interactive lessons, quizzes, and articles.',
  metadataBase: new URL('https://incentivefinance.org'),
  openGraph: { siteName: 'Incentive', type: 'website' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/png" sizes="48x48" href="/Finalfavicon.png" />
        <link rel="apple-touch-icon" href="/Finalfavicon.png" />
        <meta name="google-site-verification" content="lbay7MjXKyBCd--6EqINzejFxjRkufkqztZ7FycjR-8" />
      </head>
      <body style={{ backgroundColor: '#FFFDF5' }}>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
