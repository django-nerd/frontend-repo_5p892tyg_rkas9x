import React from 'react'
import { cva } from 'class-variance-authority'
import { Check, X } from 'lucide-react'

export const cn = (...classes) => classes.filter(Boolean).join(' ')

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500',
        ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export const Button = ({ className, variant, size, ...props }) => {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export const Card = ({ className, children }) => (
  <div className={cn('rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm', className)}>
    {children}
  </div>
)

export const CardHeader = ({ title, subtitle, right }) => (
  <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
    <div>
      <h3 className="text-slate-900 dark:text-slate-100 font-semibold">{title}</h3>
      {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>}
    </div>
    {right}
  </div>
)

export const CardBody = ({ children, className }) => (
  <div className={cn('p-4', className)}>{children}</div>
)

export const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input ref={ref} className={cn('w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500', className)} {...props} />
))

export const Select = ({ className, children, ...props }) => (
  <select className={cn('w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500', className)} {...props}>
    {children}
  </select>
)

export const Switch = ({ checked, onChange }) => (
  <button onClick={() => onChange(!checked)} className={cn('w-12 h-7 rounded-full transition-colors', checked ? 'bg-blue-600' : 'bg-slate-400')} aria-pressed={checked}>
    <span className={cn('block h-6 w-6 bg-white rounded-full shadow transform transition-transform', checked ? 'translate-x-6' : 'translate-x-1')} />
  </button>
)

export const Badge = ({ children, color = 'slate' }) => (
  <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full',
    color === 'green' && 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    color === 'red' && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    color === 'yellow' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    color === 'blue' && 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    color === 'slate' && 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300'
  )}>{children}</span>
)

export const Tooltip = ({ text }) => (
  <span className="ml-1 text-xs text-slate-500 dark:text-slate-400" title={text}>?</span>
)

export const ToastContext = React.createContext({ push: () => {} })

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([])
  const push = (msg, type = 'default') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2500)
  }
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={cn('rounded-lg px-4 py-3 shadow-lg border backdrop-blur bg-white/80 dark:bg-slate-900/70', t.type === 'success' && 'border-green-500/40', t.type === 'error' && 'border-red-500/40')}>
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              {t.type === 'success' && <Check size={16} className="text-green-500" />}
              {t.type === 'error' && <X size={16} className="text-red-500" />}
              <span className="text-sm">{t.msg}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
