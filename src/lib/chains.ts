import {
  ethereum,
  polygon,
  polygonAmoy,
  sepolia,
  base,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  bsc,
  avalanche,
  avalancheFuji,
} from "thirdweb/chains";

export const appChains = [
  polygon,
  ethereum,

  // testnets
  sepolia,
  polygonAmoy,
  baseSepolia,
  arbitrumSepolia,
  optimismSepolia,
  avalancheFuji,

  // mainnets
  base,
  arbitrum,
  optimism,
  bsc,
  avalanche,
];

