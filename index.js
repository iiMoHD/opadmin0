// Discord.js bot
const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json"));;
let credits = JSON.parse(fs.readFileSync('credits.json', 'utf8'));
const client = new Discord.Client();

client.on('ready', () => {
    client.user.setActivity('say help', {type: 'WATCHING'});
});



var prefix = ('O!');


    client.on('message', message =>{
        let command = message.content.split(" ")[0];
  if (command === "O!purge") {
    let modlog = message.guild.channels.find('name', 'log');
    message.delete();
 if (!message.member.permissions.has("MANAGE_MESSAGES")) {
   message.channel.send('Sorry, you do not have permission to perform the purge command. :x:');
   return;
 } else if (!message.channel.permissionsFor(client.user).has("MANAGE_MESSAGES")) {
   message.channel.send("Sorry, you do not have permission to perform this command, check my permissions and try again. :x:");
   return;
 }
const user = message.mentions.users.first();
const amount = !!parseInt(message.content.split(' ')[2]) ? parseInt(message.content.split(' ')[2]) : parseInt(message.content.split(' ')[1])
if (!amount) return message.channel.send('Please specify an amount to delete! :x:');
if (!amount && !user) return message.channel.send('Please specify a user and amount, or just an amount of messages to purge! :x:');
message.channel.fetchMessages({
 limit: amount,
}).then((messages) => {
 if (user) {
   const filterBy = user ? user.id : client.user.id;
   messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
 }
 message.channel.bulkDelete(messages).catch(error => console.log(error.stack));
 message.channel.sendMessage("***The server messages/users messages has been successfully purged! :white_check_mark:***")
 const embed = new Discord.RichEmbed()
   .setColor(0xFFDF00)
   .addField('Moderator:', `${message.author.username}#${message.author.discriminator}`)
   .addField('Actions Taken:', 'Purge')
     return client.channels.get(modlog.id).sendEmbed(embed);
}) }
});

client.on('message', async message => {

  if (message.author.x5bz) return;
  if (!message.content.startsWith(prefix)) return;


  let command = message.content.split(" ")[0];
  command = command.slice(prefix.length);

  let args = message.content.split(" ").slice(1);

  if (command == "warn") {

               if(!message.channel.guild) return message.reply('** This command only for servers**');
         
  if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR")) return message.reply("**You Don't Have ` BAN_MEMBERS ` Permission**");
/*    let modRole = message.guild.roles.find("name", "PoP");
  if (!message.member.roles.has(!message.guild.roles.find("name", modRole))) {
    return  message.channel.sendMessage("Hell no kid, you can't run this powerful command.")
  }*/
  let user = message.mentions.users.first();
  let reason = message.content.split(" ").slice(2).join(" ");

  if (message.mentions.users.size < 1) return message.reply("**منشن شخص**");
  if(!reason) return message.reply ("**اكتب سبب التحذير**");


  if(!warns[user.id]) warns[user.id] = {
    warns: 0
  };
  if (!credits[user.id]) credits[user.id] = {
    credits: 0,
  };

  warns[user.id].warns++;
  credits[user.id].credits++;

  fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  const banembed = new Discord.RichEmbed()
  .setAuthor(`WARNED!`, user.displayAvatarURL)
  .setColor("RANDOM")
  .setTimestamp()
  .addField("**User:**",  '**[ ' + `${user.tag}` + ' ]**')
  .addField("**By:**", '**[ ' + `${message.author.tag}` + ' ]**')
  .addField("**Reason:**", '**[ ' + `${reason}` + ' ]**')
   client.channels.find('name', 'log').send({
    embed : banembed
  })
  
  
  
    if(warns[user.id].warns == 2){
    let muterole = message.guild.roles.find(`name`, "Muted");
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "Muted",
          color: "#000000",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
    }
    
    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.reply("**يجب عليك المنشن اولاّ**:x: ") .then(m => m.delete(5000));
    
    let mutetime = "1h";
    await(tomute.addRole(muterole.id));
    message.channel.send(`<@${user.id}> has been temporarily muted`);

    setTimeout(async function(){
    await(tomute.removeRole(muterole.id));
      message.reply(`<@${user.id}> has been unmuted.`)
    }, ms(mutetime))
  }
  if(warns[user.id].warns == 3){
    credits[message.author.id].credits -= 100;
    message.reply(`<@${user.id}> just lost a LOT OF CREDIT.`)
  }

if(warns[user.id].warns == 4){
    message.guild.member(user).ban(reason);
    message.reply(`<@${user.id}> has been banned.`)
  }
}
}
);

  client.on('message' , message => {
    var prefix = "O!";
    let user = message.mentions.users.first()|| client.users.get(message.content.split(' ')[1])
    let reasons = message.content.split(' ')[2]
    if(message.content.startsWith(prefix + 'ban')) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('❌|**\`ADMINISTRATOR\`لا توجد لديك رتبة`**');
        if(!user) return  message.channel.send(`Do this ${prefix} <@ID user> \n or \n ${prefix}ban ID user`);
        if(!reasons) return  message.channel.send(`**YOU MUST TYPE THE REASONS!**`);
        message.guild.ban(user);
        message.guild.owner.send(` ${user} has banned  By : <@${message.author.id}>`)
        message.channel.send(` ${user} has banned  By : <@${message.author.id}>`)
        var embed = new Discord.RichEmbed()
        .setThumbnail(message.author.avatarURl)
        .setColor("RANDOM")
        .setTitle('**●ban** !')
        .addField('**●User baneed :** ', `${user}` , true)
        .addField('**●By :**' ,       ` <@${message.author.id}> ` , true)
        .setAuthor(message.guild.name)
        let ch = message.guild.channels.find('name','log');
        ch.sendEmbed(embed)
    }
});

client.on('message' , message => {
    var prefix = "O!";
    let user = message.mentions.users.first()|| client.users.get(message.content.split(' ')[1])
    if(message.content.startsWith(prefix + 'unban')) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('❌|**\`ADMINISTRATOR\`لا توجد لديك رتبة`**');
        if(!user) return  message.channel.send(`Do this ${prefix} <@ID user> \n or \n ${prefix}unban ID user`);
        message.guild.ban(user);
        message.guild.owner.send(`${user}  has unbanned  By : <@${message.author.id}>`)
        var embed = new Discord.RichEmbed()
        .setThumbnail(message.author.avatarURl)
        .setColor("RANDOM")
        .setTitle('**●ban** !')
        .addField('**●User unban :** ', `${user}` , true)
        .addField('**●By :**' , ` <@${message.author.id}> ` , true)
        .setAuthor(message.guild.name)
        message.channel.sendEmbed(embed)
    }
});
    
client.on('message',function(message) {
    let messageArray = message.content.split(' ');
    
    
    
    
    
   if(message.content.startsWith(prefix + "mute")) {
       let muteRole = message.guild.roles.find('name', 'Muted');
       if(!muteRole) return message.guild.createRole({name: 'Muted'}).then(message.guild.channels.forEach(chan => chan.overwritePermissions(muteRole, {SEND_MESSAGES:false,ADD_REACTIONS:false})));
       if(!message.guild.member(message.author).hasPermission("MANAGE_ROLES")) return message.channel.send('ℹ **Error:** ``خصائص مفقودة``');
       if(!message.guild.member(client.user).hasPermission("MANAGE_ROLES")) return message.channel.send('ℹ **Error:** ``خصائص مفقودة مني``');
       let muteMember = message.mentions.members.first();
       if(!muteMember) return message.channel.send('ℹ **Error:** ``منشن شخص``');
       let muteReason = messageArray[2];
       if(!muteReason) return message.channel.send('ℹ **Error:** ``حدد سباّ``');
       let muteDuration = messageArray[3];
       if(!muteDuration) return message.channel.send('ℹ **Error:** ``حدد وقت زمني``');
       if(!muteDuration.match(/[1-999][s,m,h,d,w]/g)) return message.channel.send('ℹ **Error:** ``حدد وقت زمني صحيح``');
        var embed = new Discord.RichEmbed()
        .setThumbnail(message.author.avatarURl)
        .setColor("RANDOM")
        .setTitle('**●Mute** !')
        .addField('**●User  :** ', `${muteMember}` , true)
        .addField('**●By :**' , ` <@${message.author.id}> ` , true)
        .setAuthor(message.guild.name)
        let ch = message.guild.channels.find('name','log');
        ch.sendEmbed(embed)
       message.channel.send(`:white_check_mark: **تم اعطاء العضو ميوت : ${muteMember}**`);
       muteMember.addRole(muteRole);
       muteMember.setMute(true)
       .then(() => { setTimeout(() => {
           muteMember.removeRole(muteRole)
           muteMember.setMute(false)
       }, ms(muteDuration));
       });
   } 
});

client.on('message', message => {
  
  let men = message.mentions.users.first()
  if(message.content.startsWith(prefix + "unmute")) {
            if(!men) return message.channel.send("**please @mention someone. `Ex. #unmute <@!298732816995319809> bad boy`**");
let muterole = message.guild.roles.find('name', 'Muted');
            if(!muterole) {
                message.guild.createRole({name: "Muted", color:"#505f74", permissions: [1115136]})

            }
            message.guild.member(men).removeRole(muterole)
                message.channel.send("**" + men.username + " has been unmuted! 😀 **")
        }
    })
    

    client.on('message', message => {
        let command = message.content.split(' ')[0];
         if (command === "help") {
                        var help = [
                        "**For Admins Commands**",
                        "u must use (O!) before any command",
                        "purge : delete the messages from the chat [you must but the amount of messages example O!purge 200]",
                        "warn : warn the member example warn @raizer#4474 for spam",
                        "if he get 2 warns he will get muted about 1hour",
                        "if he get 3 warns he will lose 100 from he's bank account",
                        "if he get 4 warns he will get band from the server",
                        "ban/unban it will ban the member or The opposite",
                        "mute/unmute it will mute the member or The opposite",
                        "",
                        "**For Fun Commands**",
                        "it will turns on when u use it on <#556351168738099221>, btw I'm not gonna explain it u can try it by yourself ;)",
                        "O!عواصم",
                        "O!لغز",
                        "O!فكك",
                        "",
                        "**For ur Bank account**",
                        "it will turn on when u use it on <#515931820290998272>, I'm Not gonna expla... ugh okay I'm gonna explain it",
                        "credits : to know how much money/credit you got",
                        "give : to give transfer money to someone",
                        "END",
                        "again u can't play any command without using O!",
                        "the bots are in alpha version any suggestion or comment u can send it to me <@246220920199446528>",
                        "btw subscribe to pewdiepie"
                         ];
                         message.author.sendMessage(help).catch(console.error);
                         message.channel.send("I have sent you the list of cmds in dms")
  }
    })

client.login(process.env.TOKEN);
