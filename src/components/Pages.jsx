import React from 'react'
import Spline from '@splinetool/react-spline'
import { Button, Card, CardHeader, CardBody, Input, Select, Badge, Tooltip, ToastProvider, ToastContext } from './DesignSystem'
import Layout from './Layout'
import Onboarding from './Onboarding'
import encryptedStorage from './EncryptedStorage'
import { Link } from 'react-router-dom'

const useSimplePro = () => {
  const [mode, setMode] = React.useState('simple')
  return { mode, setMode }
}

const Address = ({ addr = '0xABCD...1234' }) => (
  <span className="font-mono">{addr}</span>
)

function TransactionReview({ open, onClose, summary = 'You send 0.1 ETH to Alice', warning, unlimited, onConfirm }){
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}/>
      <Card className="relative max-w-lg w-full">
        <CardHeader title="Transaction review" subtitle="Please double-check details before confirming" />
        <CardBody>
          <div className="space-y-2 mb-3">
            <div className="text-slate-700 dark:text-slate-300">{summary}</div>
            <div className="text-sm text-slate-500">From: <Address/> → To: <Address/></div>
            <div className="text-sm">Estimated fee: 0.0012 ETH (~$4.20)</div>
            {warning && <Badge color="yellow">{warning}</Badge>}
            {unlimited && <Badge color="red">Unlimited approval selected</Badge>}
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <Select>
              <option>Eco (2-3 min)</option>
              <option>Normal (30s-1m)</option>
              <option>Fast (10-20s)</option>
            </Select>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button onClick={onConfirm}>Confirm</Button>
          </div>
          <div className="mt-3 text-xs text-slate-500">Pending too long? You can speed up by increasing gas or attempt to cancel.</div>
        </CardBody>
      </Card>
    </div>
  )
}

function Dashboard(){
  const { mode, setMode } = useSimplePro()
  const [openReview, setOpenReview] = React.useState(false)
  const toast = React.useContext(ToastContext)

  return (
    <Layout>
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 overflow-hidden">
          <div className="h-64">
            <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </div>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-semibold">$12,345.67</div>
                <div className="text-sm text-slate-500">Last updated 12s ago</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={()=> setOpenReview(true)}>Send</Button>
                <Link to="/swap"><Button variant="secondary">Swap</Button></Link>
                <Link to="/buy"><Button variant="secondary">Buy</Button></Link>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Card>
                <CardHeader title="Assets" subtitle="Trusted tokens only" />
                <CardBody>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>ETH</span><span>1.23 ($4,320)</span></div>
                    <div className="flex justify-between"><span>USDC</span><span>5,000 ($5,000)</span></div>
                    <div className="flex justify-between"><span>MATIC</span><span>2,345 ($1,234)</span></div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Status" subtitle="Systems and partners" />
                <CardBody className="space-y-2 text-sm">
                  <div><Badge color="green">Operational</Badge> App front-end</div>
                  <div><Badge color="green">Operational</Badge> Blockchain RPC</div>
                  <div><Badge color="green">Operational</Badge> Fiat partners</div>
                </CardBody>
              </Card>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span>Mode:</span>
              <Button size="sm" variant={mode==='simple'?'primary':'secondary'} onClick={()=> setMode('simple')}>Simple</Button>
              <Button size="sm" variant={mode==='pro'?'primary':'secondary'} onClick={()=> setMode('pro')}>Pro</Button>
            </div>
            {mode === 'pro' && (
              <div className="text-xs text-slate-500">Gas price: 24 gwei • Nonce: 12 • Hex: 0xdeadbeef</div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Wallet" subtitle="Ethereum Mainnet" right={<Badge>0x12...ab90</Badge>} />
          <CardBody className="space-y-3">
            <div className="flex gap-2">
              <Button onClick={()=> toast.push('Address copied', 'success')}>Copy address</Button>
              <Link to="/send"><Button variant="secondary">Receive</Button></Link>
            </div>
            <div className="text-xs text-slate-500">New address? We will warn if recipient is new.</div>
          </CardBody>
        </Card>
      </div>

      <TransactionReview open={openReview} onClose={()=> setOpenReview(false)} onConfirm={()=> { setOpenReview(false); toast.push('Transaction submitted', 'success') }} />
    </Layout>
  )
}

function WalletPage(){
  return (
    <Layout>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Accounts" subtitle="Primary wallet" />
          <CardBody>
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span>Main</span><span>0x12...ab90</span></div>
              <div className="flex justify-between"><span>DeFi</span><span>0x77...dd22</span></div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="NFTs" subtitle="Recent items" />
          <CardBody>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map(i=> <div key={i} className="aspect-square rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700" />)}
            </div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}

function SendReceive(){
  const toast = React.useContext(ToastContext)
  const [addr, setAddr] = React.useState('')
  const [amt, setAmt] = React.useState('')
  const [review, setReview] = React.useState(false)
  const [unknown, setUnknown] = React.useState(false)

  const openReview = () => {
    setUnknown(addr && !addr.startsWith('0x12'))
    setReview(true)
  }

  return (
    <Layout>
      <Card>
        <CardHeader title="Send" subtitle="Simple mode hides advanced fields" />
        <CardBody className="space-y-3">
          <Input placeholder="Recipient address" value={addr} onChange={(e)=> setAddr(e.target.value)} />
          <Input placeholder="Amount (ETH)" value={amt} onChange={(e)=> setAmt(e.target.value)} />
          <div className="flex gap-2">
            <Button onClick={openReview}>Review</Button>
            <Button variant="secondary" onClick={()=> toast.push('Address copied', 'success')}>Copy my address</Button>
          </div>
          {unknown && <Badge color="yellow">This is a new address you have never sent to before.</Badge>}
        </CardBody>
      </Card>
      <TransactionReview open={review} onClose={()=> setReview(false)} onConfirm={()=> { setReview(false); toast.push('Transaction submitted', 'success') }} warning={unknown ? 'New recipient address' : undefined}/>
    </Layout>
  )
}

function Swap(){
  const [a, setA] = React.useState('ETH')
  const [b, setB] = React.useState('USDC')
  const [amount, setAmount] = React.useState('')
  const [review, setReview] = React.useState(false)
  return (
    <Layout>
      <Card>
        <CardHeader title="Swap" subtitle={<span>Best route via DEX X <Tooltip text="Mock aggregator"/></span>} />
        <CardBody className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Select value={a} onChange={(e)=> setA(e.target.value)}>
              <option>ETH</option>
              <option>USDC</option>
              <option>MATIC</option>
            </Select>
            <Select value={b} onChange={(e)=> setB(e.target.value)}>
              <option>USDC</option>
              <option>ETH</option>
              <option>MATIC</option>
            </Select>
          </div>
          <Input placeholder="Amount" value={amount} onChange={(e)=> setAmount(e.target.value)} />
          <div className="text-sm text-slate-500">Slippage 0.5% <Tooltip text="Allowed price movement"/> • Minimum received shows after quote • Spread approx 0.12%</div>
          <Button onClick={()=> setReview(true)}>Review</Button>
        </CardBody>
      </Card>
      <TransactionReview open={review} onClose={()=> setReview(false)} onConfirm={()=> setReview(false)} />
    </Layout>
  )
}

function Bridge(){
  return (
    <Layout>
      <Card>
        <CardHeader title="Bridge" subtitle={<span>Bridging is higher risk. <Tooltip text="Funds move across chains"/></span>} />
        <CardBody className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Select><option>Ethereum</option><option>Polygon</option></Select>
            <Select><option>Polygon</option><option>Ethereum</option></Select>
          </div>
          <Input placeholder="Amount" />
          <div className="text-sm text-slate-500">Estimated 15-30 minutes • Fee ~$5</div>
          <ol className="text-sm list-decimal list-inside space-y-1">
            <li>Locking on Chain A</li>
            <li>In transit</li>
            <li>Releasing on Chain B</li>
          </ol>
          <Button>Review</Button>
        </CardBody>
      </Card>
    </Layout>
  )
}

function DeFi(){
  const [showIntro, setShowIntro] = React.useState(true)
  return (
    <Layout>
      {showIntro && (
        <Card>
          <CardHeader title="Before you start" />
          <CardBody>
            <ul className="text-sm list-disc ml-4 space-y-1">
              <li>You deposit tokens</li>
              <li>You earn yield</li>
              <li>Risks: impermanent loss, liquidation, smart contract risk</li>
            </ul>
            <div className="mt-3"><Button onClick={()=> setShowIntro(false)}>I understand</Button></div>
          </CardBody>
        </Card>
      )}
      <div className="grid md:grid-cols-3 gap-4">
        {[{name:'Basic staking',yield:'4.2%',risk:'Low',audit:'Audited',admin:'Can pause'},{name:'Lending',yield:'3.1%',risk:'Medium',audit:'Audited',admin:'Upgradeable'},{name:'LP',yield:'8.5%',risk:'High',audit:'Not audited',admin:'Admin can pause'}].map((s)=> (
          <Card key={s.name}>
            <CardHeader title={s.name} subtitle={`Yield ${s.yield}`} right={<Badge color={s.risk==='High'?'red':s.risk==='Medium'?'yellow':'green'}>{s.risk}</Badge>} />
            <CardBody className="text-sm space-y-1">
              <div>Audit: {s.audit}</div>
              <div>Admin keys: {s.admin}</div>
              <Button>Deposit</Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </Layout>
  )
}

function NFTs(){
  return (
    <Layout>
      <Card>
        <CardHeader title="NFT Gallery" subtitle="Mock items" />
        <CardBody>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {[...Array(12)].map((_,i)=> (
              <Link key={i} to="#" className="aspect-square rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700" />
            ))}
          </div>
        </CardBody>
      </Card>
    </Layout>
  )
}

function Security(){
  return (
    <Layout>
      <Card>
        <CardHeader title="Security Center" subtitle="Stay safe" />
        <CardBody className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Common scams</h4>
            <ul className="list-disc ml-4 space-y-1"><li>Phishing websites</li><li>Fake support</li><li>Airdrop scams</li></ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Support will never…</h4>
            <ul className="list-disc ml-4 space-y-1"><li>Ask for your seed</li><li>Ask for PIN</li><li>Ask to install remote tools</li></ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Unknown tokens</h4>
            <Button variant="danger">Reveal hidden tokens</Button>
          </div>
        </CardBody>
      </Card>
    </Layout>
  )
}

function LearnHelp(){
  return (
    <Layout>
      <Card>
        <CardHeader title="Learn & Help" subtitle="FAQs and basics" />
        <CardBody className="text-sm space-y-2">
          <div>What is gas? <Tooltip text="Network fee paid to validators"/></div>
          <div>What is slippage? <Tooltip text="Difference between expected and execution price"/></div>
        </CardBody>
      </Card>
    </Layout>
  )
}

function BuySell(){
  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Buy crypto" subtitle="Choose a provider" />
          <CardBody className="space-y-3">
            {[{n:'Provider A',fee:'2.1%',time:'~10 min'},{n:'Provider B',fee:'1.9%',time:'~15 min'}].map(p=> (
              <div key={p.n} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <div className="font-medium">{p.n}</div>
                  <div className="text-xs text-slate-500">Fee {p.fee} • {p.time}</div>
                </div>
                <Button size="sm">Select</Button>
              </div>
            ))}
            <Input placeholder="Amount (USD)" />
            <div className="text-sm text-slate-500">You pay $100, fees $2, you receive 97.9 USDC (est)</div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Sell to bank" subtitle="USDC → EUR/SEK" />
          <CardBody className="space-y-3">
            <Input placeholder="Amount (USDC)" />
            <Select><option>EUR</option><option>SEK</option></Select>
            <div className="text-sm">Status: Processing → Sent to bank → Completed</div>
            <Button>Start</Button>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}

function FeesLimits(){
  return (
    <Layout>
      <Card>
        <CardHeader title="Fees & Limits" />
        <CardBody>
          <div className="text-sm">
            <div>Network fees: variable (paid to validators)</div>
            <div>Platform fee: 0.5% on swaps</div>
            <div>Buy/Sell limits: Daily $2,000 • Weekly $10,000</div>
          </div>
        </CardBody>
      </Card>
    </Layout>
  )
}

function SupportStatus(){
  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Help & Support" />
          <CardBody className="space-y-3">
            <Input placeholder="Search FAQ" />
            <Input placeholder="Email" />
            <Select><option>General</option><option>Security</option><option>Payments</option></Select>
            <textarea rows={4} className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent p-3" placeholder="Message" />
            <Button>Create ticket</Button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Status" />
          <CardBody className="space-y-2 text-sm">
            <div><Badge color="green">Operational</Badge> App front-end</div>
            <div><Badge color="yellow">Degraded</Badge> RPC</div>
            <div><Badge color="green">Operational</Badge> Fiat partners</div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}

function Settings(){
  const [locked, setLocked] = React.useState(false)
  const [countdown, setCountdown] = React.useState(10)
  const [viewable, setViewable] = React.useState(false)
  React.useEffect(()=>{ if(locked){ const id = setInterval(()=> setCountdown(c=> c>0?c-1:0), 1000); return ()=> clearInterval(id) }}, [locked])
  return (
    <Layout>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Backup & Recovery" subtitle="Seed vs PIN vs password" />
          <CardBody className="space-y-3">
            <div>Status: {encryptedStorage.get('seed_backed_up') ? 'Backed up' : 'Not backed up'}</div>
            {!viewable && <Button onClick={()=> setLocked(true)}>View seed phrase</Button>}
            {locked && <div className="text-sm">Re-enter PIN and wait {countdown}s</div>}
            {locked && countdown===0 && <Button onClick={()=> { setLocked(false); setViewable(true) }}>Unlock</Button>}
            {viewable && (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({length:12}).map((_,i)=> <div key={i} className="p-2 rounded border border-slate-200 dark:border-slate-800">Word {i+1}</div>)}
              </div>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Appearance & Privacy" />
          <CardBody className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Auto-lock</span><Select><option>Immediate</option><option>1 min</option><option>5 min</option><option>15 min</option></Select></div>
            <div className="flex items-center justify-between"><span>Analytics</span><Select><option>Off</option><option>On</option></Select></div>
            <div>Font size: <input type="range" min={12} max={20} defaultValue={16} /></div>
            <div><Badge>Privacy-first mode</Badge> hides fiat values and encourages address rotation.</div>
            <div className="text-xs text-slate-500">Environment: {navigator.userAgent}</div>
          </CardBody>
        </Card>
      </div>
    </Layout>
  )
}

export default function PagesRouter(){
  const [ready, setReady] = React.useState(!!encryptedStorage.get('pin'))
  const [finishedOnboarding, setFinishedOnboarding] = React.useState(false)
  return (
    <ToastProvider>
      {!ready || !encryptedStorage.get('seed_backed_up') ? (
        <div className="max-w-3xl mx-auto p-4">
          <Onboarding onComplete={()=> { setFinishedOnboarding(true); setReady(true) }} />
        </div>
      ) : (
        <RoutesViews />
      )}
    </ToastProvider>
  )
}

import { Routes, Route, Navigate } from 'react-router-dom'

function RoutesViews(){
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/wallet" element={<WalletPage/>} />
      <Route path="/send" element={<SendReceive/>} />
      <Route path="/swap" element={<Swap/>} />
      <Route path="/bridge" element={<Bridge/>} />
      <Route path="/defi" element={<DeFi/>} />
      <Route path="/nfts" element={<NFTs/>} />
      <Route path="/security" element={<Security/>} />
      <Route path="/learn" element={<LearnHelp/>} />
      <Route path="/buy" element={<BuySell/>} />
      <Route path="/fees" element={<FeesLimits/>} />
      <Route path="/support" element={<SupportStatus/>} />
      <Route path="/settings" element={<Settings/>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
