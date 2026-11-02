const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..'),file=path.join(root,'data.js');let text=fs.readFileSync(file,'utf8');
text=text.replace(/\n\/\* REALM BANK ADAPTER \*\/[\s\S]*$/,'');
text=text.replace('["Ulaanbaatar", "Ulan Bator", "Ulaanbaatar", "Ulan Bator"]','["Ulaanbaatar", "Astana", "Bishkek", "Tashkent"]');
text=text.replace('What is the capital of Kazakhstan?", options: ["Nur-Sultan", "Almaty", "Astana", "Bishkek"]','What is the capital of Kazakhstan?", options: ["Astana", "Almaty", "Bishkek", "Tashkent"]');
text=text.replace('Which African country was never colonized?", options: ["Ethiopia", "Liberia", "Egypt", "South Africa"]','Which country defeated an Italian invasion at the Battle of Adwa in 1896?", options: ["Ethiopia", "Liberia", "Egypt", "South Africa"]');
for(const [before,after] of [
 ['Which country has the largest population?", options: ["China", "India", "United States", "Indonesia"]','Which country overtook China as the world’s most populous country in 2023?", options: ["India", "China", "United States", "Indonesia"]'],
 ['Which desert is the largest in the world?", options: ["Sahara Desert"','Which hot desert is the largest in the world?", options: ["Sahara Desert"'],
 ['What is the largest desert in Asia?','Which desert spans parts of northern China and southern Mongolia?'],
 ['Which country has the most neighbors?", options: ["China", "Russia", "Brazil", "Germany"]','Which of these countries borders Nepal?", options: ["China", "Russia", "Brazil", "Germany"]'],
 ['Which empire was ruled by Julius Caesar?", options: ["Roman Empire", "British Empire", "Ottoman Empire", "French Empire"]','Which ancient civilization did Julius Caesar belong to?", options: ["Roman civilization", "Inca civilization", "Maya civilization", "Ancient Egypt"]'],
 ['Which European country had the first female prime minister?','Which country was led by Prime Minister Sirimavo Bandaranaike?'],
 ['What is the chemical symbol for water?','What is the chemical formula for water?'],
 ['What is the name of the star that the James Webb telescope found to have water vapor in the atmosphere of one of its exoplanets?','Which exoplanet’s atmosphere was observed to contain water vapor in an early James Webb Space Telescope spectrum?'],
 ['What is the name of the first mission to use a camera on another planet?','Which mission returned the first close-up flyby images of Mars in 1965?'],
 ['What is the name of the first mission to return a sample from the Moon?','What was the first robotic mission to return a sample from the Moon?'],
 ['Which African river has the second largest flow volume?','Which African river has the greatest average discharge?'],
 ['Which desert is located in southern Africa?','Which desert covers much of Botswana?'],
 ['Which desert is the largest in China?','Which desert covers much of the Tarim Basin?'],
 ['Which desert is the largest in North America?','Which desert shares its name with the Mexican state of Chihuahua?']
])text=text.replaceAll(before,after);
// The first implementations and their duplicates were identical. Retain one each.
for(const name of ['recordQuizAnalytics','recordPictioAnalytics']){
 const matches=[...text.matchAll(new RegExp('function '+name+'\\([^)]*\\)\\s*\\{','g'))];
 if(matches.length>1){const start=matches[0].index;let i=start+matches[0][0].length,depth=1;for(;i<text.length&&depth;i++){if(text[i]==='{')depth++;else if(text[i]==='}')depth--;}text=text.slice(0,start)+text.slice(i);}
}
text+='\n/* REALM BANK ADAPTER */\n'+fs.readFileSync(path.join(root,'site/bank-adapter.js'),'utf8');fs.writeFileSync(file,text);console.log('Repaired question registry, answer distribution, and known ambiguous entries.');
