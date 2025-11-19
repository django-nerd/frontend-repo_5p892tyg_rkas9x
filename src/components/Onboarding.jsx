import React from 'react'
import { Button, Card, CardHeader, CardBody, Input } from './DesignSystem'
import encryptedStorage from './EncryptedStorage'

const mockWordList = ['globe','future','garden','mint','ocean','ripple','signal','silk','atom','solace','ember','harbor']

function SeedWord({ index, word, revealed, onReveal }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
      <div className="text-slate-500">{index + 1}.</div>
      <div className="flex-1 text-center font-mono">
        {revealed ? <span className="select-text">{word}</span> : <span className="blur-sm select-none">••••••</span>}
      </div>
      {!revealed && <Button variant="secondary" size="sm" onClick={onReveal}>Reveal</Button>}
    </div>
  )
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = React.useState('pin')
  const [pin, setPin] = React.useState('')
  const [useBio, setUseBio] = React.useState(false)
  const [seed, setSeed] = React.useState(mockWordList)
  const [revealed, setRevealed] = React.useState(Array(12).fill(false))
  const [confirmIdxs, setConfirmIdxs] = React.useState([])
  const [guess, setGuess] = React.useState({})
  const [importing, setImporting] = React.useState(false)
  const [importText, setImportText] = React.useState('')

  React.useEffect(() => {
    // choose 3 positions to confirm
    const idxs = [1,5,9].map(i=>i%12)
    setConfirmIdxs(idxs)
  }, [])

  const handleSetPin = () => {
    if (pin.length !== 6) return
    encryptedStorage.set('pin', pin)
    encryptedStorage.set('biometric', useBio)
    setStep('seed_intro')
  }

  const handleConfirmed = () => {
    const ok = confirmIdxs.every((i)=> (guess[i]||'').toLowerCase() === seed[i])
    if (!ok) return alert('One or more words are incorrect. Please try again.')
    encryptedStorage.set('seed_backed_up', true)
    encryptedStorage.set('seed', seed.map(()=> 'REDACTED')) // never store raw in this MVP
    onComplete?.()
  }

  return (
    <div className="space-y-6">
      {step === 'pin' && (
        <Card>
          <CardHeader title="Set your 6-digit PIN" subtitle="Used to unlock the app on this device" />
          <CardBody>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input inputMode="numeric" maxLength={6} placeholder="••••••" value={pin} onChange={(e)=> setPin(e.target.value.replace(/\D/g,''))} />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useBio} onChange={(e)=> setUseBio(e.target.checked)} /> Unlock with Face/Touch ID (simulated)</label>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSetPin}>Continue</Button>
              <Button variant="ghost" onClick={()=> { setImporting(true); setStep('import')}}>Import wallet</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {step === 'seed_intro' && (
        <Card>
          <CardHeader title="Your recovery phrase" subtitle="Write these 12 words on paper. Never share them." />
          <CardBody>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">This phrase lets you recover your wallet. We will show words one by one. There is no Copy All button for your safety.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {seed.map((w, i)=> (
                <SeedWord key={i} index={i} word={w} revealed={revealed[i]} onReveal={()=> setRevealed(r => r.map((x,idx)=> idx===i ? true : x))} />
              ))}
            </div>
            <div className="mt-4">
              <Button onClick={()=> setStep('confirm')} disabled={!revealed.every(Boolean)}>I wrote them down</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {step === 'confirm' && (
        <Card>
          <CardHeader title="Confirm backup" subtitle="Pick the correct word for each position" />
          <CardBody>
            <div className="space-y-4">
              {confirmIdxs.map((i)=> {
                const options = [seed[i], 'delta','river','stone'].sort()
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-24">Word {i+1}</div>
                    <select className="h-10 rounded-md border border-slate-300 dark:border-slate-700" value={guess[i]||''} onChange={(e)=> setGuess(g => ({...g, [i]: e.target.value}))}>
                      <option value="">Select</option>
                      {options.map((o)=> <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                )
              })}
            </div>
            <div className="mt-4">
              <Button onClick={handleConfirmed}>Finish</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {step === 'import' && (
        <Card>
          <CardHeader title="Import wallet" subtitle="Enter your 12-word recovery phrase" />
          <CardBody>
            <textarea value={importText} onChange={(e)=> setImportText(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-3" placeholder="twelve words separated by spaces" />
            <div className="mt-4 flex gap-2">
              <Button onClick={()=> onComplete?.()}>Import</Button>
              <Button variant="ghost" onClick={()=> setStep('pin')}>Back</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
