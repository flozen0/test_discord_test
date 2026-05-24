const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const TOKEN = process.env.TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

client.on('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {

    // quelqu'un rejoint un salon
    if (oldState.channelId !== newState.channelId && newState.channel) {

        const channel = newState.channel;

        // nombre de personnes dans le vocal
        const memberCount = channel.members.size;

        try {

            // PREMIERE PERSONNE
            if (memberCount === 1) {

                await axios.post(WEBHOOK_URL, {
                    content:
                    `🔊 ${newState.member.user.username} a lancé une conversation dans ${channel.name}`
                });

                console.log("Premier membre détecté");
            }

            // 5 PERSONNES
            if (memberCount >= 5) {

                const now = Date.now();

                // cooldown 24h
                if (
                    !lastPing[channel.id] ||
                    now - lastPing[channel.id] > 24 * 60 * 60 * 1000
                ) {

                    lastPing[channel.id] = now;

                    await axios.post(WEBHOOK_URL, {
                        content:
                        `@everyone 🔥 Il y a ${memberCount} personnes dans ${channel.name}, whole house mad !`
                    });

                    console.log("@everyone envoyé");
                }
            }

        } catch (err) {
            console.error(err);
        }
    }
});

client.login(TOKEN);
