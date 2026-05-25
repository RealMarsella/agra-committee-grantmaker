import { parseAbi } from "viem";

// Minimal ERC-20 surface for the live USDC settlement path on Arc Testnet.
// USDC at USDC_ADDRESS is the real, deployed token on Arc — these reads and
// the transfer simulation run against the live chain, not fixtures.
export const erc20Abi = parseAbi([
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
]);
