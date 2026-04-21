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
  const type = await ask('Writing or Photos? (w/p): ');
  const date = await ask('Date (e.g. April 21, 2026): ');
  
  let postHTML = '';

  if (type.toLowerCase() === 'w') {
    const text = await ask('Write your post: ');
    const image = await ask('Image file name (press enter to skip): ');
    const imgHTML = image
      ? `\n    <img src="${image}" alt="photo" style="width: 300px; margin-top: 1rem; display: block;">`
      : '';
    postHTML = `
        <li>
          <span class="post-date">${date}</span>
          <div class="post-content" style="display:none;">
            <p>${text}</p>${imgHTML}
          </div>
        </li>`;
  } else {
    const image = await ask('Image file name: ');
    postHTML = `
        <li>
          <span class="post-date">${date}</span>
          <div class="post-content" style="display:none;">
            <img src="${image}" alt="photo" style="width: 100%; margin-top: 1rem; display: block;">
          </div>
        </li>`;
  }

  let html = fs.readFileSync('index.html', 'utf8');
  
  if (type.toLowerCase() === 'w') {
    html = html.replace('</ul>\n    </div>\n\n    <div class="column"', postHTML + '\n      </ul>\n    </div>\n\n    <div class="column"');
  } else {
    html = html.replace('</ul>\n    </div>\n  </div>', postHTML + '\n      </ul>\n    </div>\n  </div>');
  }

  fs.writeFileSync('index.html', html);

  execSync('git add .');
  execSync(`git commit -m "new post: ${date}"`);
  execSync('git push');

  console.log('✅ Post published!');
  rl.close();
}

main();