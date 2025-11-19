import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Wallet, Settings, HelpCircle, Shield, Home, Globe, Bell, Sun, Moon } from 'lucide-react'
import { Button, Switch, Badge } from './DesignSystem'

const networks = ['Ethereum Mainnet','Polygon','Arbitrum']

export const ThemeContext = React.createContext({ theme: 'light', toggle: () => {} })
export const LangContext = React.createContext({ lang: 'en', setLang: () => {} })

export default function Layout({ children }) {
  const [theme, setTheme] = React.useState('light')
  const [lang, setLang] = React.useState('en')
  const [status, setStatus] = React.useState('All systems operational')

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <div className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="font-semibold text-lg">Unnamed</Link>
              <Badge color="yellow">Never share your seed phrase. Support will never ask for it.</Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-slate-500 dark:text-slate-400">{status}</span>
              <Bell size={18} />
              <div className="flex items-center gap-2">
                <Sun size={16} />
                <Switch checked={theme === 'dark'} onChange={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
                <Moon size={16} />
              </div>
              <select value={lang} onChange={(e)=> setLang(e.target.value)} className="h-8 text-sm rounded-md bg-transparent border border-slate-300 dark:border-slate-700">
                <option value="en">EN</option>
                <option value="sv">SV</option>
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 py-6">
          <aside className="lg:col-span-3 xl:col-span-2 space-y-1">
            <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}><Home size={18}/> Dashboard</NavLink>
            <NavLink to="/wallet" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}><Wallet size={18}/> Wallet</NavLink>
            <NavLink to="/send" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>Send / Receive</NavLink>
            <NavLink to="/swap" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>Swap</NavLink>
            <NavLink to="/bridge" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>Bridge</NavLink>
            <NavLink to="/defi" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>DeFi</NavLink>
            <NavLink to="/nfts" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>NFTs</NavLink>
            <NavLink to="/security" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}><Shield size={18}/> Security Center</NavLink>
            <NavLink to="/learn" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}><HelpCircle size={18}/> Learn / Help</NavLink>
            <NavLink to="/buy" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>Buy / Sell</NavLink>
            <NavLink to="/fees" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>Fees & Limits</NavLink>
            <NavLink to="/support" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}>Support / Status</NavLink>
            <NavLink to="/settings" className={({isActive}) => `flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${isActive ? 'bg-slate-100 dark:bg-slate-800' : ''}`}><Settings size={18}/> Settings</NavLink>
          </aside>
          <main className="lg:col-span-9 xl:col-span-10">
            {children}
          </main>
        </div>
      </div>
    </LangContext.Provider>
    </ThemeContext.Provider>
  )
}
