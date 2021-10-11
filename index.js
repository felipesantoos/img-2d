// Importação da biblioteca do electron.
const electron = require("electron");
// Importação da biblioteca image-size.
const sizeOf = require("image-size");
// Importação necessária para a comunicação entre os processos.
require('@electron/remote/main').initialize();

// Desestruturação do objeto electron.
const { app, BrowserWindow, ipcMain } = electron;
// O objeto app representa o processo principal da aplicação.
// O processo principal vai nos permitir acessar a página principal da aplicação.
// O processo principal é responsável por gerenciar todo o ciclo de vida da aplicação.
// O objeto BrowserWindow é usado para criar janelas para que ocorra a interação com o usuário.
// O objeto ipcMain é responsável por se comunicar com a janela principal.

// Variável que vai armazenar a janela principal.
let mainWindow;

// Quando o processo principal (app) estiver pronto, a função anônima é executada.
// Isso é necessário porque leva um tempo até o processo principal ser criado.
app.on("ready", () => {
   // Criação da janela principal.
   // É um processo diferente do app.
   // Esses dois processos não se comunicam diretamente.
   mainWindow = new BrowserWindow({
      webPreferences: {
         // Permitimos a integração do BrowserWindow com o Node.js.   
         nodeIntegration: true,
         contextIsolation: false,
      }
   });
   // O parâmetro do loadURL() pode ser uma string com um link ou a localização de um arquivo local.
   // Dá para carregar o google ou o youtube, por exemplo.
   // O `...` (acento grave) é a sintaxe template string que permite adicionar expressões imbutidas.
   // ${__dirname} é uma expressão imbutida que retorna o nome do diretório atual.
   mainWindow.loadURL(`file://${__dirname}/index.html`);
});

// Verifica se o evento getDimensions foi chamado.
ipcMain.on("requestDimensions", (event, path) => {
   // O objeto sizeOf recebe a localização da imagem e retorna suas dimensões (largura e altura).
   sizeOf(path, function (err, dimensions) {
      // Verifica se houve erros.
      if (err == null) {
         // Envia para a janela principal as dimensões da imagem.
         mainWindow.webContents.send("receiveDimensions", dimensions);
      }
   });
});