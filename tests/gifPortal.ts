import * as anchor from '@project-serum/anchor'

const main = async() => {
  console.log("🚀 Starting test...")

  const provider = anchor.Provider.env()
  anchor.setProvider(provider);

  const program = anchor.workspace.gifPortal;
  const baseAccount = anchor.web3.Keypair.generate()

  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey)
  console.log('👀 GIF Count', account.totalGifs.toString())

  await program.rpc.addGif('https://media.giphy.com/media/mVTHTOUsvduNfYRO15/giphy.gif', {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    }
  })

  account = await program.account.baseAccount.fetch(baseAccount.publicKey)
  console.log('Gif added', account.gifList)
  console.log('👀 GIF Count', account.totalGifs.toString())
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();