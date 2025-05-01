# Colabio: Crowdfund on Solana

![Colabio Logo](./assets/colabio-logo.png)

A decentralized crowdfunding platform built on Solana that enables communities to fund green energy projects with transparency, accountability, and community validation.

## 🌟 Features

- **Community-Powered Validation**: Projects are validated through community voting with anti-Sybil protection
- **Milestone-Based Funding**: Funds are released as projects achieve verified milestones
- **Risk Assessment**: Clear risk ratings help funders make informed decisions
- **Transparent Tracking**: On-chain tracking of all contributions and fund releases
- **Impact Metrics**: Visualize the environmental impact of funded projects

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- Yarn or npm
- [Phantom Wallet](https://phantom.app/) or other Solana wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/colabio.git
cd colabio

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
yarn dev
```

Visit `http://localhost:3000` to see the application running.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Blockchain**: Solana, Web3.js
- **Authentication**: Wallet adapter for Solana
- **Data Storage**: On-chain (program accounts) + IPFS for media

## 📁 Project Structure

```
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Next.js pages
│   ├── program/        # Solana program interaction
│   ├── styles/         # Global styles and Tailwind config
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions
├── tests/              # Test files
└── ...config files
```

## 🔧 Smart Contract

The Solana program is located in the `program` directory. It handles:

- Project registration and validation
- Fund collection and escrow
- Milestone verification and fund release
- Community voting

### Program Addresses

- Devnet: `Colab1o1111111111111111111111111111111111111`
- Mainnet: TBD

## 🧪 Testing

```bash
# Run frontend tests
yarn test

# Run Solana program tests
cd program
yarn test
```

## 🌐 Deployment

### Frontend

1. Build the application:
   ```bash
   yarn build
   ```

2. Deploy to your hosting provider of choice (Vercel recommended for Next.js)

### Solana Program

1. Build the program:
   ```bash
   cd program
   cargo build-bpf
   ```

2. Deploy to Solana:
   ```bash
   solana program deploy target/deploy/colabio.so
   ```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Roadmap

- [x] MVP Development
- [ ] Community Testing
- [ ] Solana Devnet Deployment
- [ ] Security Audit
- [ ] Solana Mainnet Launch
- [ ] DAO Governance Implementation
- [ ] Integration with Real-world Energy Monitoring

## 🏆 Hackathon

This project was developed for the Solana Colosseum Hackathon 2025.

## 📞 Contact

- Twitter: [@colabiosolana](https://twitter.com/colabiosolana)
- Discord: [Colabio Community](https://discord.gg/colabio)
- Email: team@colabio.xyz

---

<p align="center">Built with 💚 for a sustainable future on Solana</p>
