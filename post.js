const readline = require('readline');
const fs = require('fs');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  const date = await ask('Date (e.g. April 21, 2026): ');
  const text = await ask('Write your post: ');
  const image = await ask('Image file name (press enter to skip): ');

  const imgHTML = image 
    ? `\n    <img src="${image}" alt="photo" style="width: 300px; margin-top: 1rem; display: block;">` 
    : '';

  const newPost = `
      <li>
        <span class="post-date">${date}</span>
        <div class="post-content" style="display:none;">
          <p>${text}</p>${imgHTML}
        </div>
      </li>`;

  let html = fs.readFileSync('index.html', 'utf8');
  html = html.replace('</ul>', newPost + '\n    </ul>');
  fs.writeFileSync('index.html', html);

  execSync('git add .');
  execSync(`git commit -m "new post: ${date}"`);
  execSync('git push');

  console.log('✅ Post published!');
  rl.close();
}

main();