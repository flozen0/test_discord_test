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

    console.log("EVENT DETECTE");

    // rejoint un vocal
    if (!oldState.channel && newState.channel) {

        console.log("JOIN DETECTE");

        try {

            await axios.post(WEBHOOK_URL, {
                content:
                `🔊 ${newState.member.user.username} a rejoint ${newState.channel.name}`
            });

            console.log("MESSAGE ENVOYE");

        } catch (err) {
            console.error(err);
        }
    }
});

client.login(TOKEN);