# Prisma Futura — Real Estate Tokenization Platform

A full-stack Web3 platform for real estate tokenization. Property owners can fractionalize properties into tokens, investors can buy tokens and claim profits proportionally.

## Live demo

https://prisma-futura.com

## Tech stack

- **Backend** — Laravel 12, SQLite
- **Frontend** — React + Inertia.js + TailwindCSS + DaisyUI
- **Blockchain** — Solidity, Ethers.js, MetaMask
- **Infrastructure** — VPS, Nginx

## Architecture

User → React (Inertia.js) → Laravel → SQLite
↓
Ethers.js → Smart Contract (Sepolia)

## Pages

| Route            | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `/`              | Property listing with on-chain data                      |
| `/property/{id}` | Property detail — buy tokens, claim profits              |
| `/portfolio`     | Investor dashboard — token balances and pending earnings |
| `/admin`         | Admin panel — create and manage properties               |

## Features

- Create tokenized properties (registered on blockchain + database)
- Buy property tokens via MetaMask
- Distribute ETH profits to token holders
- Claim earnings proportionally to token balance
- Soft delete properties (deactivated, not removed)

## Smart Contract

Solidity contract handling all tokenization logic on-chain.
Repository: https://github.com/rainyuser/realestate-contract
Sepolia: `0x6ba2c572dC2FC96DeA80827c4e893c26ea4b4CB0`
