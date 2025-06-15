const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");

cmd({
  pattern: "download",
  react: "📥",
  desc: "All-in-One Downloader - YouTube, Instagram, Twitter, Spotify, Drive, MediaFire, MEGA, APK",
  category: "download",
  filename: __filename,
}, async (robin, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
  try {
    if (!q) return reply("🔗 *PIKO ALL-IN-ONE DOWNLOADER* 📥\n\n📱 Usage Examples:\n• YouTube: .download https://youtu.be/...\n• Instagram: .download https://instagram.com/p/...\n• Twitter: .download https://twitter.com/.../status/...\n• Spotify: .download https://open.spotify.com/track/...\n• Google Drive: .download https://drive.google.com/file/d/...\n• MediaFire: .download https://mediafire.com/file/...\n• MEGA: .download https://mega.nz/file/...\n• APK: .download <app_name>\n\n𝐌𝐚𝐝𝐞 𝐛𝐲 P_I_K_O ☯️");

    const input = q.trim();
    const platform = detectPlatform(input);

    await reply("🔄 *Processing your request...*");

    switch (platform) {
      case 'youtube':
        await handleYouTube(robin, mek, from, input, reply);
        break;
      case 'instagram':
        await handleInstagram(robin, mek, from, input, reply);
        break;
      case 'twitter':
        await handleTwitter(robin, mek, from, input, reply);
        break;
      case 'spotify':
        await handleSpotify(robin, mek, from, input, reply);
        break;
      case 'googledrive':
        await handleGoogleDrive(robin, mek, from, input, reply);
        break;
      case 'mediafire':
        await handleMediaFire(robin, mek, from, input, reply);
        break;
      case 'mega':
        await handleMega(robin, mek, from, input, reply);
        break;
      case 'apk':
        await handleAPK(robin, mek, from, input, reply);
        break;
      default:
        return reply("❌ *Platform not supported!*\n\nSupported platforms:\n• YouTube\n• Instagram\n• Twitter/X\n• Spotify\n• Google Drive\n• MediaFire\n• MEGA\n• APK Downloads");
    }

  } catch (e) {
    console.error(e);
    reply(`❌ *Error:* ${e.message}`);
  }
});

// Platform Detection Function
function detectPlatform(input) {
  if (input.includes('youtube.com') || input.includes('youtu.be')) return 'youtube';
  if (input.includes('instagram.com')) return 'instagram';
  if (input.includes('twitter.com') || input.includes('x.com')) return 'twitter';
  if (input.includes('spotify.com')) return 'spotify';
  if (input.includes('drive.google.com')) return 'googledrive';
  if (input.includes('mediafire.com')) return 'mediafire';
  if (input.includes('mega.nz') || input.includes('mega.co.nz')) return 'mega';
  if (!input.includes('http') && !input.includes('www.')) return 'apk';
  return 'unknown';
}

// YouTube Handler
async function handleYouTube(robin, mek, from, input, reply) {
  try {
    // Search for the video if it's not a direct URL
    let data;
    if (input.includes('youtube.com') || input.includes('youtu.be')) {
      // Direct URL - extract video info
      const videoId = extractYouTubeId(input);
      const search = await yts({ videoId });
      data = search;
    } else {
      // Search query
      const search = await yts(input);
      data = search.videos[0];
    }

    const url = data.url;

    let desc = `🎥 *PIKO YOUTUBE DOWNLOADER* 🎥
👻 Title: ${data.title}
👻 Duration: ${data.timestamp}
👻 Views: ${data.views}
👻 Uploaded: ${data.ago}
👻 Channel: ${data.author.name}
👻 Link: ${data.url}

𝐌𝐚𝐝𝐞 𝐛𝐲 P_I_K_O ☯️`;

    await robin.sendMessage(
      from,
      { image: { url: data.thumbnail }, caption: desc },
      { quoted: mek }
    );

    // Download video
    const video = await downloadYouTubeVideo(url, "720");
    await robin.sendMessage(
      from,
      {
        video: video.buffer,
        caption: `🎥 *${video.title}*\n\n𝐌𝐚𝐝𝐞 𝐛𝐲 *P_I_K_O* ☯️`,
      },
      { quoted: mek }
    );

    reply("✅ *YouTube video downloaded successfully!* 🎥💙");
  } catch (error) {
    throw new Error(`YouTube download failed: ${error.message}`);
  }
}

// Instagram Handler
async function handleInstagram(robin, mek, from, input, reply) {
  try {
    const apiUrl = `https://api.instagramdownloader.com/download?url=${encodeURIComponent(input)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.success) {
      const data = response.data.data;
      
      let desc = `📸 *PIKO INSTAGRAM DOWNLOADER* 📸
👻 Caption: ${data.caption || 'No caption'}
👻 Type: ${data.type || 'Post'}
👻 Username: ${data.username || 'Unknown'}
👻 Link: ${input}

𝐌𝐚𝐝𝐞 𝐛𝐲 P_I_K_O ☯️`;

      if (data.type === 'video') {
        await robin.sendMessage(
          from,
          {
            video: { url: data.download_url },
            caption: desc
          },
          { quoted: mek }
        );
      } else {
        await robin.sendMessage(
          from,
          {
            image: { url: data.download_url },
            caption: desc
          },
          { quoted: mek }
        );
      }

      reply("✅ *Instagram content downloaded successfully!* 📸💜");
    } else {
      throw new Error("Failed to fetch Instagram content");
    }
  } catch (error) {
    throw new Error(`Instagram download failed: ${error.message}`);
  }
}

// Twitter Handler
async function handleTwitter(robin, mek, from, input, reply) {
  try {
    const apiUrl = `https://api.twitterdownloader.com/download?url=${encodeURIComponent(input)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.success) {
      const data = response.data.data;
      
      let desc = `🐦 *PIKO TWITTER DOWNLOADER* 🐦
👻 Tweet: ${data.text || 'No text'}
👻 Username: ${data.username || 'Unknown'}
👻 Date: ${data.date || 'Unknown'}
👻 Link: ${input}

𝐌𝐚𝐝𝐞 𝐛𝐲 P_I_K_O ☯️`;

      if (data.media_type === 'video') {
        await robin.sendMessage(
          from,
          {
            video: { url: data.download_url },
            caption: desc
          },
          { quoted: mek }
        );
      } else if (data.media_type === 'image') {
        await robin.sendMessage(
          from,
          {
            image: { url: data.download_url },
            caption: desc
          },
          { quoted: mek }
        );
      }

      reply("✅ *Twitter content downloaded successfully!* 🐦💙");
    } else {
      throw new Error("Failed to fetch Twitter content");
    }
  } catch (error) {
    throw new Error(`Twitter download failed: ${error.message}`);
  }
}

// Spotify Handler
async function handleSpotify(robin, mek, from, input, reply) {
  try {
    const apiUrl = `https://api.spotifydownloader.com/download?url=${encodeURIComponent(input)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.success) {
      const data = response.data.data;
      
      let desc = `🎵 *PIKO SPOTIFY DOWNLOADER* 🎵
👻 Title: ${data.title}
👻 Artist: ${data.artist}
👻 Album: ${data.album}
👻 Duration: ${data.duration}
👻 Link: ${input}

𝐌𝐚𝐝𝐞 𝐛𝐲 P_I_K_O ☯️`;

      await robin.sendMessage(
        from,
        { image: { url: data.thumbnail }, caption: desc },
        { quoted: mek }
      );

      await robin.sendMessage(
        from,
        {
          audio: { url: data.download_url },
          mimetype: 'audio/mpeg',
          fileName: `${data.title} - ${data.artist}.mp3`
        },
        { quoted: mek }
      );

      reply("✅ *Spotify track downloaded successfully!* 🎵💚");
    } else {
      throw new Error("Failed to fetch Spotify track");
    }
  } catch (error) {
    throw new Error(`Spotify download failed: ${error.message}`);
  }
}

// Google Drive Handler
async function handleGoogleDrive(robin, mek, from, input, reply) {
  try {
    const fileId = extractGoogleDriveId(input);
    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    // Get file info
    const infoUrl = `https://drive.google.com/file/d/${fileId}/view`;
    const response = await axios.get(infoUrl);
    
    let desc = `📁 *PIKO GOOGLE DRIVE DOWNLOADER* 📁
👻 File ID: ${fileId}
👻 Link: ${input}
👻 Status: Ready to download

𝐌𝐚𝐝𝐞 𝐛𝐲 P_I_K_O ☯️`;

    await robin.sendMessage(
      from,
      {
        document: { url: directUrl },
        fileName: `GoogleDriveFile_${fileId}`,
        caption: desc
      },
      { quoted: mek }
    );

    reply("✅ *Google Drive file downloaded successfully!* 📁💙");
  } catch (error) {
    throw new Error(`Google Drive download failed: ${error.message}`);
  }
}

// MediaFire Handler
async function handleMediaFire(robin, mek, from, input, reply) {
  try {
    const apiUrl = `https://api.mediafiredownloader.com/download?url=${encodeURIComponent(input)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.success) {
      const data = response.data.data;
      
      let desc = `🔥 *PIKO MEDIAFIRE DOWNLOADER* 🔥
👻 Filename: ${data.filename}
👻 Size: ${data.size}
👻 Upload Date: ${data.upload_date}
👻 Link: ${input}

𝐌𝐚𝐝𝐞 𝐛𝐲 P_I_K_O ☯️`;

      await robin.sendMessage(
        from,
        {
          document: { url: data.download_url },
          fileName: data.filename,
          caption: desc
        },
        { quoted: mek }
      );

      reply("✅ *MediaFire file downloaded successfully!* 🔥🧡");
    } else {
      throw new Error("Failed to fetch MediaFire file");
    }
  } catch (error) {
    throw new Error(`MediaFire download failed: ${error.message}`);
  }
}

// MEGA Handler
async function handleMega(robin, mek, from, input, reply) {
  try {
    const apiUrl = `https://api.megadownloader.com/download?url=${encodeURIComponent(input)}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.success) {
      const data = response.data.data;
      
      let desc = `☁️ *PIKO MEGA DOWNLOADER* ☁️
👻 Filename: ${data.filename}
👻 Size: ${data.size}
👻 Link: ${input}

𝐌𝐚𝐝𝐞 𝐛𝐲 P_I_K_O ☯️`;

      await robin.sendMessage(
        from,
        {
          document: { url: data.download_url },
          fileName: data.filename,
          caption: desc
        },
        { quoted: mek }
      );

      reply("✅ *MEGA file downloaded successfully!* ☁️❤️");
    } else {
      throw new Error("Failed to fetch MEGA file");
    }
  } catch (error) {
    throw new Error(`MEGA download failed: ${error.message}`);
  }
}

// APK Handler
async function handleAPK(robin, mek, from, input, reply) {
  try {
    const appName = input.toLowerCase().replace(/\s+/g, '+');
    const apiUrl = `https://api.apkdownloader.com/search?q=${appName}`;
    const response = await axios.get(apiUrl);

    if (response.data && response.data.success && response.data.data.length > 0) {
      const app = response.data.data[0];
      
      let desc = `📱 *PIKO APK DOWNLOADER* 📱
👻 App Name: ${app.name}
👻 Package: ${app.package}
👻 Version: ${app.version}
👻 Size: ${app.size}
👻 Developer: ${app.developer}

𝐌𝐚𝐝𝐞 𝐛𝐲 P_I_K_O ☯️`;

      await robin.sendMessage(
        from,
        { image: { url: app.icon }, caption: desc },
        { quoted: mek }
      );

      await robin.sendMessage(
        from,
        {
          document: { url: app.download_url },
          fileName: `${app.name}_v${app.version}.apk`,
          mimetype: 'application/vnd.android.package-archive'
        },
        { quoted: mek }
      );

      reply("✅ *APK file downloaded successfully!* 📱💚");
    } else {
      throw new Error("APK not found. Try with exact app name.");
    }
  } catch (error) {
    throw new Error(`APK download failed: ${error.message}`);
  }
}

// Helper Functions
async function downloadYouTubeVideo(url, quality) {
  const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=${quality}&url=${encodeURIComponent(
    url
  )}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
  const response = await axios.get(apiUrl);

  if (response.data && response.data.success) {
    const { id, title } = response.data;

    const progressUrl = `https://p.oceansaver.in/ajax/progress.php?id=${id}`;
    while (true) {
      const progress = await axios.get(progressUrl);
      if (progress.data.success && progress.data.progress === 1000) {
        const videoBuffer = await axios.get(progress.data.download_url, {
          responseType: "arraybuffer",
        });
        return { buffer: videoBuffer.data, title };
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  } else {
    throw new Error("Failed to fetch video details.");
  }
}

function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function extractGoogleDriveId(url) {
  const regExp = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// Additional command aliases
cmd({
  pattern: "yt",
  react: "🎥",
  desc: "Download YouTube Video",
  category: "download",
  filename: __filename,
}, async (robin, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
  if (!q) return reply("Provide YouTube URL or search term. 🎥");
  
  const fullCommand = `download ${q}`;
  // Reuse the main download command
  return cmd.find(c => c.pattern === "download").function(robin, mek, m, { 
    from, quoted, body, isCmd, command: "download", args: ["download", ...q.split(" ")], 
    q: fullCommand.replace("download ", ""), isGroup, sender, reply 
  });
});

cmd({
  pattern: "ig",
  react: "📸",
  desc: "Download Instagram Content",
  category: "download",
  filename: __filename,
}, async (robin, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
  if (!q) return reply("Provide Instagram URL. 📸");
  
  const fullCommand = `download ${q}`;
  return cmd.find(c => c.pattern === "download").function(robin, mek, m, { 
    from, quoted, body, isCmd, command: "download", args: ["download", ...q.split(" ")], 
    q: fullCommand.replace("download ", ""), isGroup, sender, reply 
  });
});

cmd({
  pattern: "apk",
  react: "📱",
  desc: "Download APK Files",
  category: "download",
  filename: __filename,
}, async (robin, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, reply }) => {
  if (!q) return reply("Provide app name for APK download. 📱");
  
  const fullCommand = `download ${q}`;
  return cmd.find(c => c.pattern === "download").function(robin, mek, m, { 
    from, quoted, body, isCmd, command: "download", args: ["download", ...q.split(" ")], 
    q: fullCommand.replace("download ", ""), isGroup, sender, reply 
  });
});
