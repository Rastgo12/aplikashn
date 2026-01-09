
export const syncToGitHub = async (token: string, repo: string, data: any) => {
  const fileName = 'db.json';
  const url = `https://api.github.com/repos/${repo}/contents/${fileName}`;

  try {
    const getRes = await fetch(url, {
      headers: { 'Authorization': `token ${token}` }
    });
    
    let sha = '';
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Update database from KurdManhua App',
        content: content,
        sha: sha || undefined
      })
    });

    return putRes.ok;
  } catch (error) {
    console.error("GitHub Sync Error:", error);
    return false;
  }
};

export const fetchFromGitHub = async (token: string, repo: string) => {
  const fileName = 'db.json';
  const url = `https://api.github.com/repos/${repo}/contents/${fileName}`;

  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `token ${token}` }
    });
    if (!res.ok) return null;
    const fileData = await res.json();
    const content = decodeURIComponent(escape(atob(fileData.content)));
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
};
