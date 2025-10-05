import { ChannelType } from "discord.js";

const forumId = process.env.FORUM_ID;

export async function createForumPost(client, postData) {
  console.log(postData)
  if (!postData || !postData.title || !postData.content) {
    console.error(
      "[ForumService] Error: Invalid data for post creation. A post needs a title and content."
    );
    return null;
  }

  if (!forumId) {
    console.error("[ForumService] Error: Cant find forum ID.");
    return null;
  }

  try {
    const forumChannel = await client.channels.fetch(forumId);

    if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
      console.error(
        `[ForumService] Error: Channel not founded or it's not a forum.`
      );
      return null;
    }

    const post = await forumChannel.threads.create({
      name: postData.title,
      message: {
        content: postData.content,
      },
    });

    console.log(`[ForumService] Post created with ${postData.title}`);
    return post;
  } catch (error) {
    console.error(`[ForumService] Error trying to create post`, error);
    return null;
  }
}

export async function getPostsFromDb() {
  const url = process.env.BACKEND_URL;

  const r = await fetch(`${url}/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const res = await r.json();

  if (res.data && res.data.length > 0) {
    return res.data;
  }

  return [];
}

export async function getPostsFromDiscordForum(client) {
  if (!forumId) {
    console.error('[ForumService] Erro: A variável de ambiente FORUM_ID não está definida.');
    return null;
  }

  try {
    const forumChannel = await client.channels.fetch(forumId);

    if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
      console.error(`[ForumService] Erro: Canal de fórum com ID ${forumId} não encontrado ou não é um fórum.`);
      return null;
    }

    const activePostsResult = await forumChannel.threads.fetchActive();
    const postPromises = activePostsResult.threads.map(async (thread) => {
      try {
        const starterMessage = await thread.fetchStarterMessage();
        return {
          id: thread.id,
          title: thread.name,
          content: starterMessage.content,
          author: starterMessage.author.username,
          createdAt: thread.createdAt,
        };
      } catch (err) {
        console.error(`[ForumService] Falha ao buscar mensagem inicial do post ${thread.id}:`, err);
        return null;
      }
    });

    const posts = (await Promise.all(postPromises)).filter(p => p !== null);

    console.log(`[ForumService] ${posts.length} posts ativos encontrados.`);
    return posts;

  } catch (error) {
    console.error(`[ForumService] Erro ao buscar posts do fórum:`, error);
    return null;
  }
}
