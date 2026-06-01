# Alonsal

O Alonsal é um Bot multitarefas para o Discord<br>
Ele atua em diversas áreas e apresenta diversas funções!

Dentre as áreas de atuação, separamos por esses tópicos: //
- [😂] Diversão
- [💡] Utilitários
- [🎉] Customização
- [🎲] Jogos
- [👤] Usuário
- [💂] Moderação
- [📡] Infos

Separados por esses tópicos temos em torno de 100 comandos prontos para todas as suas demandas!

O Alonsal é um bot em constante evolução e sempre esta em atualizações para trazer novos comandos e ajustes
nos comandos já existentes, seja com novas informações ou opções de uso

-> Atualmente ele pode ser utilizado diretamente pelos comandos em barra, com diversas opções de entrada
para os mais diversos estilos de uso. Também é possível definir um idioma para o Alonsal, temos 7 idiomas
totalmente funcionais no momento, sendo eles o Português, Inglês, Espanhol, Francês, Italiano, Russo e um idioma fictício chamado de Alonsês.

<hr>

<h2>📑 Exemplos de comandos 📑</h2>

`/tempo são paulo` <br>
<img src="https://user-images.githubusercontent.com/56841881/231588729-700f7e95-588d-48f4-b1ae-7b747563520e.png">

`/rasputia menu` <br>
<img src="https://user-images.githubusercontent.com/56841881/231589113-cf24c542-594d-4d97-8bc6-6154bbf1102b.png">

`/games` <br>
<img src="https://user-images.githubusercontent.com/56841881/231589736-cae96ea6-05a4-4bc9-9345-8d02c7389565.png">

`/server info` <br>
<img src="https://user-images.githubusercontent.com/56841881/231589381-19ff0920-e532-4782-906d-b327d4e168d9.png">

`/mine` <br>
<img src="https://user-images.githubusercontent.com/56841881/231589580-e6adfd12-4fd2-49a1-8d54-645790604780.png">

<h2>🖥️ Site 🖥️</h2>

Visite hoje mesmo o site do Alonsal para descobrir muito mais detalhes sobre esse projeto!

Através dele é possível visualizar todos os comandos de forma externa ao discord, verificar as funções existentes e descobrir
as praticidades que só o Alonsal é capaz de prover para seu servidor!

Clique na imagem abaixo para ser redirecionado ao site!

<img src="https://user-images.githubusercontent.com/56841881/134081823-cd22499a-8330-4d43-9bf0-d109acef3a9b.png">

<h2>⚙️ Ajude o Alonsal!</h2>

É possível ajudar o desenvolvimento do Alonsal em diversas áreas, seja através de correções de texto pelo [Alondioma](https://github.com/Alonses/Alondioma) ou por correções e melhorias nos códigos do bot em si, toda ajuda é bem vinda!

<img src="https://user-images.githubusercontent.com/56841881/231592171-2db80fab-c3cb-4842-b392-765ba71bb08e.png">

<h2>🐱‍🏍 Formatação</h2>

Para uma melhor visualização dos códigos Alonsais, usamos padrões ao criar elementos da biblioteca do Discord.JS!
- `EmbedBuilder`
> Ordem de construção <br><br>
> setTitle <br>
> setColor <br>
> setAuthor <br>
> setThumbnail / setImage <br>
> setDescription <br>
> setFields / addFields <br>
> setTimestamp <br>
> setFooter

-> Caso um embed possua "setadores" que são dependentes de condições lógicas, a inclusão deles serão realizadas após o fim do bloco completo do `EmbedBuilder`.

- `Replyes / Updates`
> Ordem de construção <br><br>
> content <br>
> embeds <br>
> files <br>
> components <br>
> fetchReply <br>
> ephemeral

<h2>🔣 Fontes 🔣</h2>

O Alonsal faz uso direto da [APISAL](https://github.com/odnols/APISAL), uma API planejada do zero para fornecer diversas soluções de forma prática

Ele também executa o Web Scraping de vários sites públicos, como o site do [History e seus acontecimentos do dia](https://history.uol.com.br/hoje-na-historia), o [LastFM](https://www.last.fm/pt/home), a [Steam](https://store.steampowered.com/?l=portuguese) e a [Wikipédia do Minecraft](https://minecraft.wiki/w/Minecraft_Wiki).

Aqui vão nossos agradecimentos pelas pessoas por trás das funções utilizadas pelo Alonsal até o momento:
- [lllggghhhaaa](https://github.com/lllggghhhaaa) Pelas ajudas com os códigos e melhorias em várias partes, incluindo o banco de dados externo e funções de prefixo customizáveis, idiomas e a criação da [WCH](https://github.com/lllggghhhaaa/WaxCommandHandler) usada amplamente em versões anteriores do Alonsal.
- [BielMaxBR](https://github.com/BielMaxBR) pelo pontapé inicial e alinhamento do Alonsal, removendo arquivos sem propósito e ajudando a desenvolver/melhorar funções de minigames e outras.
- [AuroPick](https://github.com/AuroPick/epic-free-games) pela API dedicada a jogos gratuitos semanais da Epic Games, usada amplamente toda santa quinta feira. 🙏🏻
- [oGabrielArruda](https://github.com/oGabrielArruda/api-charadas) pela API dedicada a piadas e charadas usada no comando `/cazalbe piada`.
- [adam10603](https://github.com/adam10603/GTAWeather) pela API dedicada ao clima do GTA online, para uso no comando `/gta`.
- [LukyVj](https://github.com/LukyVj/MadamNazar.io) pela API dedicada a exibir a localização da Madame Nazar no `/nazar`.
- [vtex](https://github.com/vtex/country-iso-2-to-3) pelo pacote dedicado a traduzir códigos de países de 2 caracteres para 3 caracteres, usado amplamente no comando `/tempo`.
- [michaelwittig](https://github.com/michaelwittig/node-i18n-iso-countries) pelo pacote dedicado a traduzir o nome dos países com base no código dos mesmos, para os idiomas nativos, usado amplamente no comando `/tempo`.
- [IntriguingTiles](https://github.com/IntriguingTiles/cleverbot-free) pelo pacote dedicado as conversações do cleverbot, usada pelo Alonsal para simular uma IA.

Todos os direitos vão diretamente para eles por fornecerem conteúdos de forma pública e possibilitar o funcionamento do bot. Obrigado!