BOT_TOKEN='MTIxMjA0NDYyODcyNDAyMzI5Nw.GH4eC5.MzDBElkBsMgNbQ3xxhAs2Ead6HBuwin_0w0l4s'
CLIENT_ID='1212044628724023297'
GUILD_ID='1211870079692836874'
curl -X POST \
-H 'Content-Type: application/json' \
-H "Authorization: Bot $BOT_TOKEN" \
-d '{"name":"help","description":"Print help page","options":[{"name":"command","description":"Command name","type":3,"required":false}]}' \
"https://discord.com/api/v8/applications/$CLIENT_ID/guilds/$GUILD_ID/commands"