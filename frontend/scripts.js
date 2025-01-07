const ngrok = require("ngrok");
const chalk = require("chalk");

(async function () {
  try {
    const url = await ngrok.connect(3000); // Tunnel to port 3000
    console.log(chalk.green(`ngrok is running: ${url}`));
    console.log(
      chalk.blue(
        `Use this URL as your Telegram Web App URL in BotFather or testing: ${url}`
      )
    );
  } catch (err) {
    console.error(chalk.red("Error starting ngrok:"), err);
  }
})();
