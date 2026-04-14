# Prisma Futura — Real Estate Tokenization Platform

A full-stack Web3 platform for real estate tokenization. Property owners can fractionalize properties into tokens, and investors can buy tokens and claim profits proportionally.

## Tech stack

- **Backend** — Laravel 12, SQLite
- **Frontend** — React + Inertia.js + TailwindCSS + DaisyUI
- **Blockchain** — Solidity, Ethers.js, MetaMask
- **Infrastructure** — VPS, Nginx

## Architecture

User → React (Inertia.js) → Laravel → SQLite
↓
Ethers.js → Smart Contract (Sepolia)

## Smart Contract

The Solidity contract handles tokenization logic on-chain.
Repository: https://github.com/rainyuser/realestate-contract

## Features

- Create tokenized properties (stored on blockchain + database)
- Buy property tokens via MetaMask
- Distribute ETH profits to token holders
- Claim earnings proportionally

## Live demo

https://prisma-futura.com
