# AUTH_AND_ARC_PLAN

Updated: 2026-05-25 IST

## Auth stack decision

**Chosen: Reown AppKit + Wagmi + Viem.**

Rationale:

- AGRA is wallet-native. The committee is autonomous, but the **treasury
  signer** that settles a USDC payout must be a real EVM wallet on Arc. AppKit
  gives a polished, multi-wallet connect modal and a custom-network
  registration that fits Arc Testnet (chain `5042002`) cleanly.
- Wagmi hooks (`useReadContract`, `useSimulateContract`, `useWriteContract`,
  `useWaitForTransactionReceipt`, `useBalance`, `useSwitchChain`) give a typed
  read → simulate → write pipeline with explicit UI states.
- Privy was rejected as the primary path: AGRA does not need email/social
  embedded-wallet onboarding for a treasury-signing demo, and custodial
  onboarding would muddy the "real wallet, real signature, real transfer"
  story. `NEXT_PUBLIC_PRIVY_APP_ID` exists in the vault if embedded onboarding
  is wanted later, but it is not used.

Wallet-native config (no email/social custody): `features` in
`src/app/providers.tsx` disables `email`, `socials`, `swaps`.

### Files

- `src/lib/web3/wagmi.ts` — `defineChain` Arc Testnet, `WagmiAdapter`
  (cookie storage + SSR), exported `wagmiConfig`.
- `src/app/providers.tsx` — `createAppKit` + `WagmiProvider` +
  `QueryClientProvider`. Theme matched to AGRA tokens.
- `src/app/layout.tsx` — async, hydrates wagmi SSR state from cookies
  (`cookieToInitialState`).
- `src/components/web3/ConnectButton.tsx` — connect / wrong-chain / connected
  states, native USDC balance pill, DiceBear avatar.
- The legacy `src/components/WalletAuthPanel.tsx` (raw `window.ethereum`
  `personal_sign` proof for `/api/auth/wallet`) is retained — it is a separate,
  honest signature-proof feature and does not conflict with wagmi.

### Env

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` — pulled from the vault into
  `.env.local`. Required for the AppKit modal / WalletConnect relay.

## Arc Testnet configuration

| Field | Value |
|---|---|
| Chain ID | `5042002` |
| RPC | `https://rpc.testnet.arc.network` |
| Native currency | USDC |
| Explorer | `https://testnet.arcscan.app` |
| USDC token | `0x3600000000000000000000000000000000000000` |
| EURC token | `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a` |

Confirmed live via `npm run arc:check`:

```json
{ "chainId": 5042002, "usdcDecimals": 6, "eurcDecimals": 6,
  "nativeUsdcGasBalance": "0", "canBroadcast": false }
```

## Read → Simulate → Write workflow (live, honest)

The real capital-allocation action is a **USDC transfer to the grantee**, run
against the live Arc Testnet USDC token. Implemented in
`src/components/web3/ArcPayoutPanel.tsx`.

1. **Read (live):** `decimals()` and `balanceOf(treasurySigner)` on the USDC
   token via `useReadContract`. Decimals confirmed = 6 from the live chain.
2. **Simulate (live):** `useSimulateContract` for `transfer(grantee, amount)`
   against live state. An unfunded wallet surfaces the revert reason
   ("insufficient USDC … live settlement disabled, simulation only") rather
   than faking success.
3. **Write (gated):** `useWriteContract` is only enabled when the simulation
   returns a valid `request`. `useWaitForTransactionReceipt` drives pending →
   confirmed → failed. **No transaction hash is rendered unless the chain
   returns one.**

UI states covered: disconnected, wrong chain (with one-click switch),
read-loading, simulation loading/success/revert, write pending, confirmed
(Arcscan link), failed.

## Current integration status

- **Live:** chain reads (decimals, balance), transfer simulation, wallet
  connect/switch on Arc Testnet.
- **Blocked from live write:** the Circle faucet has not funded the test wallet
  (`nativeUsdcGasBalance: 0`), so a real `transfer` would revert. The UI shows
  the simulation result and disables the live write honestly. No fake hashes.
- **Registry path (separate):** `DecisionRegistry.recordDecision` server-side
  broadcast (`scripts/replay-demo.ts`) remains blocked on
  `DECISION_REGISTRY_ADDRESS` + funding. Labeled fixture until deployed.

## To go fully live

1. Fund `0x58374c7ec9192e2d588e39ACA0eA43f60f432b13` (or a connected wallet)
   with Arc Testnet USDC via the Circle/Arc faucet.
2. Connect that wallet in the console → simulation passes → the "Settle N USDC
   payout" button enables → real tx hash + Arcscan link appear.
3. (Optional) Deploy `DecisionRegistry`, set `DECISION_REGISTRY_ADDRESS`, run
   `npm run replay:broadcast` for the on-chain decision record.
