import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import '../styles/globals.css'
import '../styles/app.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AuthProvider from '@/context/AuthContext'
import AppShell from '@/components/AppShell'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-heading',
  display: 'swap',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata = {
  title: 'Incentive',
  description: 'Learn personal finance through interactive lessons, quizzes, and articles.',
  metadataBase: new URL('https://incentivefinance.org'),
  openGraph: { siteName: 'Incentive', type: 'website' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var a=JSON.parse(localStorage.getItem('incentive_shop_active')||'[]'),m={'color-coral':'#FF6F61','color-teal':'#0D9488','color-amber':'#F59E0B','color-purple':'#8B5CF6','color-blue':'#3B82F6','color-pink':'#EC4899'};for(var i=0;i<a.length;i++){if(m[a[i]]){document.documentElement.style.setProperty('--accent',m[a[i]]);break;}}}catch(e){}})();` }} />
        <link rel="icon" type="image/png" sizes="48x48" href="/Finalfavicon.png" />
        <link rel="apple-touch-icon" href="/Finalfavicon.png" />
        <meta name="google-site-verification" content="lbay7MjXKyBCd--6EqINzejFxjRkufkqztZ7FycjR-8" />
      </head>
      <body style={{ backgroundColor: '#FFFDF5' }}>
        <AuthProvider>
          <AppShell />
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
