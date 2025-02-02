document.addEventListener('DOMContentLoaded', () => {
  const resultDiv = document.getElementById('result');

  document.getElementById('extract').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: extractHTMLContent
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const content = results[0].result;
            const searchResult = searchSensitiveInfo(content);
            resultDiv.innerHTML = '';

            const preview = document.createElement('div');
            preview.innerHTML = searchResult 
              ? `<div class="links-container"><strong>信息检测结果:</strong><br>${searchResult}</div>`
              : `<div class="links-container"><strong>信息检测结果:</strong> 啥也没有,整一根吧🚬🚬</div>`;
            resultDiv.appendChild(preview);
          }
        }
      );
    });
  });

  document.getElementById('deepScan').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: extractJSFiles
        },
        async (results) => {
          if (results && results[0] && results[0].result) {
            const jsFiles = results[0].result;
            resultDiv.innerHTML = '';

            for (const file of jsFiles) {
              const content = await fetchJSContent(file);
              const searchResult = searchSensitiveInfo(content);

              const preview = document.createElement('div');
              preview.innerHTML = searchResult 
                ? `<div class="links-container"><strong>文件: ${file}</strong><br><pre>${content.substring(0, 500)}...</pre><strong>敏感信息:</strong><br>${searchResult}</div>`
                : `<div class="links-container"><strong>文件: ${file}</strong><br><strong>敏感信息:</strong> 啥也没有,整一根吧🚬🚬</div>`;
              resultDiv.appendChild(preview);
            }
          }
        }
      );
    });
  });
});

function extractHTMLContent() {
  return document.documentElement.outerHTML;
}

function extractJSFiles() {
  const scripts = document.querySelectorAll('script[src]');
  const jsFiles = Array.from(scripts).map(script => script.src);
  return jsFiles;
}

async function fetchJSContent(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error fetching JS file:', error);
    return '';
  }
}

function searchSensitiveInfo(content) {
  const patterns = {
    'API Key': /api[_-]?key\s*[:=]\s*["'][a-zA-Z0-9-_]+["']/gi,
    'Secret': /secretKey\s*=\s*"([^"]+)"/gi,
    'AccessKey': /AccessKey\s*=\s*"([^"]+)"/gi,
    'AccessToken': /accessToken\s*=\s*"([^"]+)"/gi,
    'Swagger UI': /((swagger-ui.html)|(\"swagger\":)|(Swagger UI)|(swaggerUi)|(swaggerVersion))/g,
    '阿里云AK': /^LTAI[A-Za-z0-9]{12,20}$/g,
    '腾讯云AK': /^AKID[A-Za-z0-9]{13,20}$/g,
    '百度云AK': /^AK[A-Za-z0-9]{10,40}$/g,
    '京东云': /^JDC_[A-Z0-9]{28,32}/g,
    '火山引擎': /^AKLT[a-zA-Z0-9-_]{0,252}/g,
    '明文ID参数': /(\b(id|\w+id)=(\d{2,15})\b(?![-_\\/]))/gi,
    'JSON-ID参数': /(["']?([a-zA-Z_]*id)["']?\s*:\s*["']?(\d{2,15}))/gi,
    'Shiro特征': /(=deleteMe|rememberMe=)/gi,
    'URL跳转参数': /([?&])(goto|redirect_to|redirect_url|jump_to|to|target)(=)/gi,
    '敏感管理路径': /(\/)(admin|manage|manager|system|console|dashboard)(\/|$)/gi,
    '数据库连接': /jdbc:[a-z:]+:\/\/[a-z0-9\.\-_:;=\/@?,&]+/gi,
    '密码字段':  /((|'|")([p](ass|wd|asswd|assword))(|'|")(:|=)( |)('|")(.*?)('|")(|,))/g,
    '账号字段': /((|'|")(([u](ser|name|ame|sername))|(account))(|'|")(:|=)( |)('|")(.*?)('|")(|,))/g,
    '车牌号': /[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]/g,
    '手机号': /\b(?:\+?86)?1[3-9]\d{9}\b/g,
    '身份证': /\b\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])\d{3}[\dXx]\b/g,
    '邮箱': /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    '银行卡号': /\b\d{16,19}\b/g
  };

  const colors = {
    // 高风险 (红色)
    'API Key': 'red',
    'Secret': 'red',
    'AccessKey': 'red',
    'AccessToken': 'red',
    '阿里云AK': 'red',
    '腾讯云AK': 'red',
    '百度云AK': 'red',
    '京东云': 'red',
    '火山引擎': 'red',
    'Shiro特征': 'red',
    '数据库连接': 'red',
    '身份证号': 'red',

    // 中风险 (橙色)
    '明文ID参数': '#FFA500',
    'JSON-ID参数': '#FFA500',
    '密码字段': '#FFA500',

    // 低风险 (黄色)
    'Swagger UI': 'green',
    'URL跳转参数': 'green',
    '敏感管理路径': 'green',
    '账号字段': 'green',
    '邮箱': 'green',

    // 普通信息 (蓝色)
    '手机号': '#4169E1',
    '银行卡号': '#4169E1',
    '车牌号': '#4169E1'
  };
  let results = '';

  for (const [key, pattern] of Object.entries(patterns)) {
    const matches = content.match(pattern);
    if (matches) {
      results += `<strong style="color:${colors[key]}">${key}:</strong> ${matches.join(', ')}<br>`;
    }
  }

  return results;
}
