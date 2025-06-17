    const getPhantomProvider = () => {
        if ('phantom' in window) {
            const provider = window.phantom?.solana;

            if (provider?.isPhantom) {
                return provider;
            }
        }

        return null;
    };

    const connectToPhantom = async (provider) => {

        try {
            const resp = await provider.connect();
            console.log(resp.publicKey.toString());
            // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo 
        } catch (err) {
            console.log(err)
            // { code: 4001, message: 'User rejected the request.' }
        }
    };

    const activateWallet = async () => {

        var platformsToSelect = {};
        var phantom = getPhantomProvider();
        if (phantom) {
            platformsToSelect["phantom"] = "Phantom";
        }

        const { value: platform } = await Swal.fire({
            title: "Select a detected wallets",
            input: "select",
            inputOptions: {
                Platforms: platformsToSelect
            },
            inputPlaceholder: "Select a platform",
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value) {
                        resolve();
                    } else {
                        resolve("You need to select phantom :)");
                    }
                });
            }
        });
        if (platform) {
            switch (platform) {
                case "phantom":
                    await connectToPhantom(platform);
                    break;

                default:
                    Swal.fire(`You selected: ${platform}`);
                    break;
            }
        }

    }

    $(".connectWalletBtn").click(async function () {

        await activateWallet();
        
    });

