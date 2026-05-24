import { config } from "dotenv";
import { privateKeyToAccount } from "viem/accounts";
import {
  buildWalletAuthMessage,
  REQUIRED_WALLET_CHAIN_ID,
} from "../src/lib/agra/auth";

config({ path: ".env.local", quiet: true });
config({ quiet: true });

const baseUrl = process.env.AGRA_QA_URL ?? "http://localhost:3003";
const privateKey = process.env.ARC_PRIVATE_KEY as `0x${string}` | undefined;

if (!privateKey) {
  console.error(
    "ARC_PRIVATE_KEY is not configured; wallet auth smoke is blocked.",
  );
  process.exit(2);
}

const account = privateKeyToAccount(privateKey);
const nonce = `wallet-smoke-${Date.now()}`;
const message = buildWalletAuthMessage({
  address: account.address,
  chainId: REQUIRED_WALLET_CHAIN_ID,
  nonce,
});
const signature = await account.signMessage({ message });

const response = await fetch(`${baseUrl}/api/auth/wallet`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    address: account.address,
    chainId: REQUIRED_WALLET_CHAIN_ID,
    nonce,
    signature,
  }),
});

const payload = await response.json();

if (!response.ok || !payload.verified) {
  console.error(
    JSON.stringify(
      {
        status: response.status,
        error: payload.error ?? "Wallet auth smoke failed.",
      },
      null,
      2,
    ),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      verified: payload.verified,
      address: payload.address,
      chainId: payload.chainId,
      baseUrl,
    },
    null,
    2,
  ),
);
